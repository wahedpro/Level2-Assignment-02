import express, { json, Request, Response } from "express";
import {Pool} from "pg"

const app = express();
app.use(express.json());

const pool = new Pool({
    connectionString : 'postgresql://neondb_owner:npg_LNYOn6ZDC8of@ep-billowing-union-a86c1sly-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require'
})

const initDB = async ()=>{
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

initDB();

app.post("/users", async (req : Request, res : Response)=>{
    const body = req.body;
    console.log(body);
})

app.get("/",(req : Request, res : Response)=>{
    res.status(200).json({
        message: "This is the root API"
    })
})

app.listen(5000,()=>{
    console.log("Vehicle Rental System Server is Running")
})