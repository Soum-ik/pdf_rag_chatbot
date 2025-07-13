import express from 'express';
import cors from 'cors';
import upload from './config/multer.js';
import { Queue } from 'bullmq';
import { QdrantVectorStore } from '@langchain/qdrant';
import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Mistral } from '@mistralai/mistralai';
import { worker } from './worker.js';
import { mistralApiKey, geminiApiKey } from './config/config.js';

const mistralClient = new Mistral({ apiKey: mistralApiKey });

const queue = new Queue('file-upload-queue', {
  connection: {
    host: 'localhost',
    port: '6379',
  },
});

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  return res.json({ status: 'All Good!' });
});

app.post('/upload/pdf', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    await queue.add(
      'file-ready',
      JSON.stringify({
        filename: req.file.originalname,
        destination: req.file.destination,
        path: req.file.path,
      })
    );

    return res.json({
      message: 'File uploaded successfully',
      filename: req.file.originalname,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/chat', async (req, res) => {
  try {
    const userQuery = req.query.message;
    console.log('User Query:', userQuery);

    try {
      const embeddings = new GoogleGenerativeAIEmbeddings({
        modelName: "gemini-embedding-exp-03-07",
        title: "User uploaded document",
        taskType: "RETRIEVAL_DOCUMENT",
        apiKey: geminiApiKey,
      });

      try {
        const vectorStore = await QdrantVectorStore.fromExistingCollection(
          embeddings,
          {
            url: 'http://localhost:6333',
            collectionName: 'langchainjs-testing',
          }
        );

        const ret = vectorStore.asRetriever({
          k: 2,
        });

        const result = await ret.invoke(userQuery);
        console.log('Retrieved documents count:', result.length);

        if (!result || result.length === 0) {
          return res.status(404).json({
            error: 'No relevant documents found for your query.'
          });
        }

        const documentContents = result.map(doc => {
          return `Document Content: ${doc.pageContent || 'No content available'}`;
        }).join('\r\n\r\n');
        

        const SYSTEM_PROMPT = `
        You are a helpful AI Assistant who answers the user query based on the available context from PDF File.
        
        Context:
        ${documentContents}
        User Query: ${userQuery}
        Answer the user query based on the context provided.
        `;

        try {
          const chatResponse = new ChatGoogleGenerativeAI({
            model: "gemini-1.5-flash",
            temperature: 0,
            maxRetries: 2,
            apiKey: geminiApiKey,
          });

          const result = await chatResponse.invoke(SYSTEM_PROMPT);
          console.log('Chat response:', result);
          return res.json({
            message: result.content,
            docs: result.content,
          });
        } catch (llmError) {
          console.error('Error generating response from LLM:', llmError);
          return res.status(500).json({
            error: 'Failed to generate a response. Please try again later.'
          });
        }
      } catch (vectorStoreError) {
        console.error('Error retrieving documents from vector store:', vectorStoreError);
        return res.status(500).json({
          error: 'Failed to retrieve relevant documents. Please try again later.'
        });
      }
    } catch (embeddingError) {
      console.error('Error initializing embeddings:', embeddingError);
      return res.status(500).json({
        error: 'Failed to initialize embedding model. Please check your API key and try again.'
      });
    }
  } catch (error) {
    console.error('Unexpected error in chat endpoint:', error);
    return res.status(500).json({
      error: 'An unexpected error occurred. Please try again later.'
    });
  }
});

app.listen(8000, () => {
  console.log(`Server started on PORT:${8000}`);
  console.log('Worker is active and ready to process jobs');
});
