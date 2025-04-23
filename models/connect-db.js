import pkg from "pg";

export function connectDB (database) {
    const { Client } = pkg;

    const client = new Client ({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: database ?? "adempiere",
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });
    return client
}