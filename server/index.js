import express from 'express';
import cors from 'cors';
import upload from './config/multer.js';
import { Queue } from 'bullmq';
import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore } from '@langchain/qdrant';
import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { worker } from './worker.js';
import { geminiApiKey } from './config/config.js';


const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  temperature: 0,
  maxRetries: 2,
  apiKey: geminiApiKey
});

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
  const userQuery = req.query.message;
  console.log('User Query:', userQuery);
  

  const embeddings = new GoogleGenerativeAIEmbeddings({
    modelName: "gemini-embedding-exp-03-07",
    title: "User uploaded document",
    taskType: "RETRIEVAL_DOCUMENT",
    apiKey: geminiApiKey,
  });

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

  const SYSTEM_PROMPT = `
  You are a helpful AI Assistant who answers the user query based on the available context from PDF File.
  Context:
  ${JSON.stringify(result)}
  
  User Question: ${userQuery}
  
  Please provide a helpful answer based on the context above.
  `;

  const chatResult = await llm.invoke(SYSTEM_PROMPT);
  console.log('Chat Result:', chatResult.content);

  return res.json({
    message: chatResult.content,
    docs: result,
  });
});

app.listen(8000, () => {
  console.log(`Server started on PORT:${8000}`);
  console.log('Worker is active and ready to process jobs');
}); 
