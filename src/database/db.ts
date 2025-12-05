import { Pool } from "pg";

export const pool = new Pool({
    connectionString : 'postgresql://neondb_owner:npg_LNYOn6ZDC8of@ep-billowing-union-a86c1sly-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require'
})

export const initDB = async ()=>{
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        phone TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin','customer')),
        created_at TIMESTAMP DEFAULT NOW()
        );
    `)
    console.log("Database Connented");
}