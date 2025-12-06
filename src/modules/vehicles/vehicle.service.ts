import { pool } from "../../database/db";

interface CreateVehicleInput {
  vehicle_name: string;
  type: string;
  registration_number: string;
  daily_rent_price: number;
  availability_status: string;
}

export const createVehicleIntoDB = async (payload: CreateVehicleInput) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;

  const result = await pool.query(
    `
      INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status
    `,
    [vehicle_name, type, registration_number, daily_rent_price, availability_status]
  );

  return result.rows[0];
};

export const getAllVehiclesFromDB = async () => {
  const result = await pool.query(`
    SELECT 
      id, 
      vehicle_name, 
      type, 
      registration_number, 
      daily_rent_price, 
      availability_status 
    FROM vehicles
    ORDER BY id ASC
  `);

  return result.rows;
};
