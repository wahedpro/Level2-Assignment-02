import { pool } from "../../database/db";

export const getAllUsersFromDB = async () => {
  const result = await pool.query(`
    SELECT id, name, email, phone, role 
    FROM users
    ORDER BY id ASC
  `);

  return result.rows;
};