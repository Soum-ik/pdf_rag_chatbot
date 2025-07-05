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

      // Load the PDF
      console.log('Loading PDF from path:', data.path);
      const loader = new PDFLoader(data.path);
      const docs = await loader.load();
      console.log(`Loaded ${docs.length} documents from PDF`);

      // Split the documents into chunks
      const textSplitter = new CharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 200,
      });
      console.log('Splitting documents into chunks...');
      const splitDocs = await textSplitter.splitDocuments(docs);
      console.log(`Split into ${splitDocs.length} chunks`);

      // Initialize embeddings
      try {
        console.log('Initializing Google Generative AI Embeddings...');
        const embeddings = new GoogleGenerativeAIEmbeddings({
          modelName: "gemini-embedding-exp-03-07",
          title: "User uploaded document",
          taskType: "RETRIEVAL_DOCUMENT",
          apiKey: geminiApiKey,
        });
        console.log('Embedding model initialized:', embeddings.modelName);

        // Connect to vector store
        console.log('Connecting to Qdrant vector store...');
        const vectorStore = await QdrantVectorStore.fromExistingCollection(
          embeddings,
          {
            url: 'http://localhost:6333',
            collectionName: 'langchainjs-testing',
          }
        );
        console.log('Connected to vector store successfully');

        // Add documents to vector store
        console.log('Adding documents to vector store...');
        await vectorStore.addDocuments(splitDocs);
        console.log(`Successfully added ${splitDocs.length} documents to vector store`);

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
    concurrency: 100,
    connection: {
      host: 'localhost',
      port: '6379',
    },
  }
);

// Worker starts automatically when imported
console.log('Worker is ready and listening for jobs...');
