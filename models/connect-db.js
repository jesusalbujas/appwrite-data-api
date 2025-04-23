import pkg from "pg";

export function connectDB (database) {
    const { Client } = pkg;
    const port = process.env.POSTGRES_PORT || 5432;
    const PORT = new Number(port);

    const client = new Client ({
        user: process.env.ADEMPIERE_DB_NAME,
        host: process.env.DB_HOST,
        database: database ?? "adempiere",
        password: process.env.ADEMPIERE_DB_PASSWORD,
        port: PORT,
    });
    return client
}