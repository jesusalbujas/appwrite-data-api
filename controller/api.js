import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { getThreads, getTopics, getTypology, getClients, updateDocumentByField } from "../models/appwrite.js";


dotenv.config();
const app = express();
const PORT = process.env.API_PORT
app.disable("x-powered-by");
app.use(cors());
app.use(express.json());


app.get("/threads", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 25;
        const threads = await getThreads(page, limit);
        res.status(200).json(threads);
    } catch (error) {
        console.error("Error fetching threads:", error.message);
        res.status(500).send("Error fetching threads");
    }
});

app.get("/clients", async (req, res) => {
    try {
        const page = parseInt (req.query.page) || 1;
        const limit = parseInt (req.query.limit) || 10000;
        const clients = await getClients(page, limit);
        res.status(200).json(clients);
    } catch (error) {
        console.error("Error fetching clients:", error.message);
        res.status(500).send("Error fetching clients");
    }
});

app.get("/tipology", async (req, res) => {
    try {
        const typology = await getTypology();
        res.status(200).json(typology);
    } catch (error) {
        console.error("Error fetching tipology:", error.message);
        res.status(500).send("Error fetching tipology");
    }
});


app.get("/topics", async (req, res) => {
    try {
        const topics = await getTopics();
        res.status(200).json(topics);
    } catch (error) {
        console.error("Error fetching topics:", error.message);
        res.status(500).send("Error fetching topics");
    }
});

app.put("/update-threads", async (req, res) => {
    try {
        const { filterField, filterValue, updates, limitRecords } = req.body;

        if (!filterField || !filterValue || !updates) {
            return res.status(400).json({ message: "Missing filterField, filterValue, or updates in request body." });
        }

        const result = await updateDocumentByField(filterField, filterValue, updates, limitRecords);

        if (!result.success) {
            if (result.message.includes("No document found")) {
                return res.status(404).json(result);
            } else {
                return res.status(500).json(result);
            }
        }

        res.status(200).json(result);
    } catch (error) {
        console.error("Error updating document in API:", error.message);
        res.status(500).json({ message: "Error updating document", error: error.message, updatedCount: 0 });
    }
});

app.listen(PORT, () => {
    console.log (`Server listening on port ${PORT}`)
});