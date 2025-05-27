import { Client, Databases, Query } from 'node-appwrite';
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

const getThreads = async (page, limit) => {
  try {
    const offset = (page - 1) * limit;
    const response = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_COLLECTION_ID,
      [
        `limit(${limit})`,
        `offset(${offset})`
      ]
    );
    console.info("Successfully fetched Threads from Appwrite");

    console.info(`Total number of records: ${response.documents.length}`);

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
    console.info("Successfully fetched Topics from Appwrite");
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
    console.info("Successfully fetched Typology from Appwrite");
    return response.documents.map(doc => ({ name: doc.name, value: doc.code }));
  } catch (error) {
    console.error('Error fetching typology from Appwrite:', error.message);
    return [];
  }
};


const getClients = async (page, limit) => {
  try {
    const offset = (page - 1) * limit
    const response = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_COLLECTION_ID,
      [
        `limit(${limit})`,
        `offset(${offset})`
      ]
    );
    console.info("Successfully fetched Clients from Appwrite");

    const uniqueMap = new Map();
    response.documents.forEach(doc => {
      const clientname = doc.clientname?.trim().toUpperCase();
      const clientchannel = doc.clientchannel?.trim().toUpperCase();
      const key = `${clientname}-${clientchannel}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, {
          clientname,
          clientchannel
        });
      }
    });

    const resultClient = Array.from(uniqueMap.values());
    console.info(`Total number of records: ${resultClient.length}`);
    return resultClient
  } catch (error) {
    console.error('Error fetching clients from Appwrite:', error.message);
    return [];
  }
};

const updateDocumentByField = async (filterField, filterValue, updates, limitRecords = 1) => {
  try {
    const queries = [`equal("${filterField}", "${filterValue}")`];

    // Si limitRecords no es "ALL", añadimos el límite a la consulta de búsqueda
    if (limitRecords !== "ALL") {
      queries.push(`limit(${limitRecords})`);
    } else {
      queries.push(`limit(100000)`); // Un límite muy alto para simular "ALL"
    }

    const response = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_COLLECTION_ID,
      queries
    );

    console.log(`[Appwrite.js] Searching for document: Field=${filterField}, Value=${filterValue}, Limit=${limitRecords}`);
    console.log(`[Appwrite.js] Response from listDocuments: Found ${response.documents.length} documents.`);

    if (response.documents.length === 0) {
      console.warn(`[Appwrite.js] No document found by listDocuments for ${filterField} = ${filterValue}`);
      return { success: false, message: `No document found with ${filterField} = ${filterValue}`, updatedCount: 0 };
    }

    const updatedDocuments = [];
    for (const documentToUpdate of response.documents) {
      const documentId = documentToUpdate.$id;
      try {
        const updatedDocument = await databases.updateDocument(
          process.env.APPWRITE_DATABASE_ID,
          process.env.APPWRITE_COLLECTION_ID,
          documentId,
          updates
        );
        updatedDocuments.push(updatedDocument);
        console.info(`[Appwrite.js] Successfully updated document with ID: ${documentId}`);
      } catch (updateError) {
        console.error(`[Appwrite.js] Error updating single document ${documentId}:`, updateError.message);
      }
    }

    if (updatedDocuments.length > 0) {
        return { success: true, message: "Documents updated successfully", updatedCount: updatedDocuments.length, documents: updatedDocuments };
    } else {
        return { success: false, message: "No documents were successfully updated", updatedCount: 0 };
    }

  } catch (error) {
    console.error(`[Appwrite.js] Error updating document by field ${filterField}:`, error.message);
    return { success: false, message: "Server Error", error: error.message, updatedCount: 0 };
  }
};

export { getThreads, getTopics, getTypology, getClients, updateDocumentByField };