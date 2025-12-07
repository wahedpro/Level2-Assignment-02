import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config(); 

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

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

    // Bookings table
    await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings (
            id SERIAL PRIMARY KEY,
            customer_id INTEGER NOT NULL,
            vehicle_id INTEGER NOT NULL,
            rent_start_date DATE NOT NULL,
            rent_end_date DATE NOT NULL,
            total_price NUMERIC NOT NULL,
            status TEXT NOT NULL CHECK (status IN ('active','cancelled','returned')),
            created_at TIMESTAMP DEFAULT NOW(),
            CONSTRAINT fk_customer
            FOREIGN KEY(customer_id) REFERENCES users(id) ON DELETE CASCADE,
            CONSTRAINT fk_vehicle
            FOREIGN KEY(vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
        );
    `);
}