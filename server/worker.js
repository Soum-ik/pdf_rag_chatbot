import { Worker } from 'bullmq';
import { QdrantVectorStore } from '@langchain/qdrant';
import { QdrantClient } from '@qdrant/js-client-rest';
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
      console.log(`Loaded ${docs.length} documents from PDF`);

      // Initialize embeddings
      try {
        console.log('Initializing Google Generative AI Embeddings...');
        const embeddings = new GoogleGenerativeAIEmbeddings({
          modelName: "gemini-embedding-exp-03-07",
          title: "User uploaded document",
          taskType: "RETRIEVAL_DOCUMENT",
          apiKey: geminiApiKey,
        });

        // Get vector dimension for this embedding model (should be 3072 for Gemini)
        console.log('Checking embedding dimensions...');
        const sampleText = "Sample text for dimension check";
        const sampleEmbedding = await embeddings.embedQuery(sampleText);
        const dimension = sampleEmbedding.length;
        console.log(`Embedding dimension: ${dimension}`);

        // Connect to Qdrant and check/recreate collection if necessary
        const qdrantClient = new QdrantClient({ url: 'http://localhost:6333' });
        
        try {
          // Check if collection exists
          console.log('Checking Qdrant collection...');
          let collection = null;
          try {
            collection = await qdrantClient.getCollection('langchainjs-testing');
            console.log('Collection exists');
          } catch (err) {
            console.log('Collection does not exist, will create it');
          }
          
          // If collection exists but dimensions don't match, delete it
          if (collection && collection.config.params.vectors.size !== dimension) {
            console.log(`Collection dimension mismatch: expected ${dimension}, got ${collection.config.params.vectors.size}`);
            console.log('Deleting existing collection...');
            await qdrantClient.deleteCollection('langchainjs-testing');
            collection = null;
          }
          
          // Create collection if it doesn't exist
          if (!collection) {
            console.log(`Creating new collection with dimension ${dimension}...`);
            await qdrantClient.createCollection('langchainjs-testing', {
              vectors: {
                size: dimension,
                distance: 'Cosine'
              }
            });
            console.log('Collection created successfully');
          }
          
          // Create a new vector store and add documents
          console.log('Creating vector store and adding documents...');
          const vectorStore = await QdrantVectorStore.fromDocuments(
            docs,
            embeddings,
            {
              url: 'http://localhost:6333',
              collectionName: 'langchainjs-testing',
            }
          );
          
          console.log('Documents successfully added to vector store');
          
        } catch (qdrantError) {
          console.error('Error with Qdrant operations:', qdrantError);
          throw qdrantError;
        }
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
