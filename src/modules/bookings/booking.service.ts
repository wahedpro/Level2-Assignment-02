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

export const getAllBookingsAdminDB = async () => {
  const result = await pool.query(`
    SELECT 
      b.id,
      b.customer_id,
      b.vehicle_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,
      u.name AS customer_name,
      u.email AS customer_email,
      v.vehicle_name,
      v.registration_number
    FROM bookings b
    JOIN users u ON b.customer_id = u.id
    JOIN vehicles v ON b.vehicle_id = v.id
    ORDER BY b.id ASC
  `);

  return result.rows;
};

export const getBookingsByCustomerDB = async (customerId: number) => {
  const result = await pool.query(`
    SELECT 
      b.id,
      b.vehicle_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,
      v.vehicle_name,
      v.registration_number,
      v.type
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.customer_id = $1
    ORDER BY b.id ASC
  `, [customerId]);

  return result.rows;
};
