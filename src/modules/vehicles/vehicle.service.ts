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

export const getVehicleByIdFromDB = async (vehicleId: number) => {
  const result = await pool.query(
    `
      SELECT 
        id,
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status
      FROM vehicles
      WHERE id = $1
    `,
    [vehicleId]
  );

  return result.rows[0];
};

export const updateVehicleInDB = async (
  id: number,
  payload: Record<string, any>
) => {
  const fields = [];
  const values = [];
  let index = 1;

  for (const key in payload) {
    fields.push(`${key} = $${index}`);
    values.push(payload[key]);
    index++;
  }

  if (fields.length === 0) return null;

  const query = `
    UPDATE vehicles
    SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status
  `;

  values.push(id);

  const result = await pool.query(query, values);

  return result.rows[0];
};

export const checkActiveBookings = async (vehicleId: number) => {
  const result = await pool.query(
    `
    SELECT id FROM bookings 
    WHERE vehicle_id = $1 AND status = 'active'
    `,
    [vehicleId]
  );

  return result.rows.length > 0;
};

export const deleteVehicleFromDB = async (vehicleId: number) => {
  const result = await pool.query(
    `
    DELETE FROM vehicles WHERE id = $1
    RETURNING id
    `,
    [vehicleId]
  );

  return result.rows[0];
};