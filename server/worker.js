import { Worker } from 'bullmq';
import { OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore } from '@langchain/qdrant';
import { Document } from '@langchain/core/documents';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { CharacterTextSplitter } from '@langchain/textsplitters';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { geminiApiKey } from './config/config.js';


export const worker = new Worker(
  'file-upload-queue',
  async (job) => {
    try {
      console.log(`Job:`, job.data);
      const data = JSON.parse(job.data);

      const loader = new PDFLoader(data.path);
      const docs = await loader.load();

      // // Split the documents into chunks
      // const textSplitter = new CharacterTextSplitter({
      //   chunkSize: 1000,
      //   chunkOverlap: 200,
      // });

      // const splitDocs = await textSplitter.splitDocuments(docs);
      // const validDocs = splitDocs.filter(doc =>
      //   doc.pageContent &&
      //   typeof doc.pageContent === 'string' &&
      //   doc.pageContent.trim().length > 0
      // );
      // console.log(`Valid documents: ${validDocs.length} out of ${splitDocs.length}`);
      // if (validDocs.length === 0) {
      //   throw new Error('No valid documents to embed');
      // }
      // Initialize embeddings
      try {
        console.log('Initializing Google Generative AI Embeddings...');
        const embeddings = new GoogleGenerativeAIEmbeddings({
          modelName: "gemini-embedding-exp-03-07",
          title: "User uploaded document",
          taskType: "RETRIEVAL_DOCUMENT",
          apiKey: geminiApiKey,
        });
        // Embed manually
        // console.log('Generating embeddings...');
        // const texts = validDocs.map(doc => doc.pageContent);
        // const vectors = await embeddings.embedDocuments(texts);
        // // Validate vectors (must be arrays of 3072 floats)
        // const filtered = vectors
        //   .map((vec, i) => ({ vec, doc: validDocs[i] }))
        //   .filter(item =>
        //     Array.isArray(item.vec) &&
        //     item.vec.length === 3072 &&
        //     item.vec.every(v => typeof v === 'number' && !isNaN(v))
        //   );

        // if (filtered.length === 0) {
        //   throw new Error('All embeddings are invalid (empty or wrong dimensions)');
        // }

        // console.log(`Prepared ${filtered.length} valid embeddings`);

        // Connect to Qdrant
        const vectorStore = await QdrantVectorStore.fromExistingCollection(
          embeddings,
          {
            url: 'http://localhost:6333',
            collectionName: 'langchainjs-testing',
          }
        );

        console.log('Connected to Qdrant, uploading vectors...');

        // Add vectors manually
        await vectorStore.addDocuments(docs);
        console.log('Vectors uploaded successfully');
      } catch (embeddingError) {
        console.error('Error with embeddings or vector store:', embeddingError);
        throw embeddingError;
      }

    } catch (error) {
      console.error('Error processing job:', error);
      console.error('Error stack:', error.stack);
      throw error; // Re-throw to mark job as failed
    }
  },
  {
    autorun: true,
    removeOnFail: true,
    retryProcessDelay: 1000,
    maxRetries: 3,
    concurrency: 100,
    connection: {
      host: 'localhost',
      port: '6379',
    },
  }
);

// Worker starts automatically when imported
console.log('Worker is ready and listening for jobs...');
