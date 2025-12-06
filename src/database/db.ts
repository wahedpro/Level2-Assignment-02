import { Pool } from "pg";

export const pool = new Pool({
    connectionString : 'postgresql://neondb_owner:npg_LNYOn6ZDC8of@ep-billowing-union-a86c1sly-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require'
})

export const initDB = async ()=>{

    // User Table
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

    // Vehicles table
    await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        vehicle_name TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('car','bike','van','SUV')),
        registration_number TEXT NOT NULL UNIQUE,
        daily_rent_price NUMERIC NOT NULL,
        availability_status TEXT NOT NULL CHECK (availability_status IN ('available','booked')),
        created_at TIMESTAMP DEFAULT NOW()
        );
    `);

    console.log("Database Connected & Tables Verified");
}