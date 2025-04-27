import pkg from "pg";

export function connectDB (database) {
    const { Client } = pkg;

    const client = new Client ({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
    });
    return client
}