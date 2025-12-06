import { pool } from "../../database/db";

export const getAllUsersFromDB = async () => {
  const result = await pool.query(`
    SELECT id, name, email, phone, role 
    FROM users
    ORDER BY id ASC
  `);

  return result.rows;
};

export const updateUserInDB = async (id: number, payload: Record<string, any>) => {
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
    UPDATE users
    SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING id, name, email, phone, role
  `;

  values.push(id);

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getUserByIdFromDB = async (id: number) => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

export const checkUserActiveBookings = async (userId: number) => {
  const result = await pool.query(
    `
      SELECT id FROM bookings
      WHERE customer_id = $1 AND status = 'active'
    `,
    [userId]
  );

  return result.rows.length > 0;
};

export const deleteUserFromDB = async (userId: number) => {
  const result = await pool.query(
    `
      DELETE FROM users
      WHERE id = $1
      RETURNING id
    `,
    [userId]
  );

  return result.rows[0];
};