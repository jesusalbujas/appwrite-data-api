import express from "express";
import dotenv from "dotenv";
import { dbListener } from "../models/db-listener.js";
import cors from "cors";
import { getThreads, getTopics, getTypology, getClients } from "../models/appwrite.js";


dotenv.config();
const app = express();
const PORT = process.env.API_PORT
const channel = "new_registered_user"
app.disable("x-powered-by");
app.use(cors());

app.post("/db-listener", async (req, res) => {
    try {
        console.info ("Connected to API db-listener")
        const result = await dbListener(process.env.KEYCLOAK_DB_DATABASE, channel)
        res.status(200).send(result.message)
        
    } catch (error) {
        console.error("Error: ", error.message);
        res.status(500).send("Error ejecutando el script");
    }
});


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

app.listen(PORT, () => {
    console.log (`Server listening on port ${PORT}`)
});