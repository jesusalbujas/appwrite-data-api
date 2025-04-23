import express from "express";
import dotenv from "dotenv";
import { dbListener } from "../models/db-listener.js";
import cors from "cors";

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

app.listen(PORT, () => {
    console.log (`Server listening on port ${PORT}`)
});