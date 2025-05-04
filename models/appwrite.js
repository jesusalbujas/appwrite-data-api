import { Client, Databases } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client();

if (!process.env.APPWRITE_ENDPOINT) 
    throw new Error('APPWRITE_ENDPOINT is not defined');
if (!process.env.APPWRITE_PROJECT_ID) 
    throw new Error('APPWRITE_PROJECT_ID is not defined');
if (!process.env.APPWRITE_API_KEY) 
    throw new Error('APPWRITE_API_KEY is not defined');
if (!process.env.APPWRITE_DATABASE_ID) 
    throw new Error('APPWRITE_DATABASE_ID is not defined');
if (!process.env.APPWRITE_COLLECTION_ID) 
    throw new Error('APPWRITE_COLLECTION_ID is not defined');

client
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

console.log(`Appwrite connected! Endpoint: ${process.env.APPWRITE_ENDPOINT}`);

const getThreads = async () => {
  try {
    const response = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_COLLECTION_ID
    );
    console.log("Raw response from Appwrite:", response);
    return response.documents;
  } catch (error) {
    console.error('Error fetching threads from Appwrite:', error.message);
    return [];
  }
};

const getTopics = async () => {
  try {
    const response = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_TOPICS_COLLECTION_ID
    );
    console.log("Raw response from Appwrite:", response);
    return response.documents.map(doc => ({ name: doc.name, value: doc.code }));
  } catch (error) {
    console.error('Error fetching topics from Appwrite:', error.message);
    return [];
  }
};

const getTypology = async () => {
  try {
    const response = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_TIPOLOGY_COLLECTION_ID
    );
    console.log("Raw response from Appwrite:", response);
    return response.documents.map(doc => ({ name: doc.name, value: doc.code }));
  } catch (error) {
    console.error('Error fetching typology from Appwrite:', error.message);
    return [];
  }
};

export { getThreads, getTopics, getTypology };
