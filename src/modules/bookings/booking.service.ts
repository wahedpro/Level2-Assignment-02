import { pool } from "../../database/db";

export const getVehicleById = async (vehicleId: number) => {
  const result = await pool.query(
    `SELECT * FROM vehicles WHERE id = $1`,
    [vehicleId]
  );
  return result.rows[0];
};

export const createBookingInDB = async (payload: any) => {
  const {
    customer_id,
    vehicle_id,
    rent_start_date,
    rent_end_date,
    total_price,
    status,
  } = payload;

  const result = await pool.query(
    `
      INSERT INTO bookings 
      (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status
    `,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      status,
    ]
  );

  return result.rows[0];
};

export const updateVehicleStatus = async (vehicleId: number, status: string) => {
  await pool.query(
    `UPDATE vehicles SET availability_status = $1 WHERE id = $2`,
    [status, vehicleId]
  );
};