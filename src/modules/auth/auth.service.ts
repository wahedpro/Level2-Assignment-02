import bcrypt from "bcryptjs";
import { pool } from "../../database/db";

const createUserIntoDB = async (payload: Record<string, any>) => {
  const { name, email, password, phone, role } = payload;

  const hashPassword = await bcrypt.hash(password, 12);

  const result = await pool.query(
    `
    INSERT INTO users(name,email,password,phone,role)
    VALUES($1,$2,$3,$4,$5)
    RETURNING id,name,email,phone,role
    `,
    [name, email.toLowerCase(), hashPassword, phone, role]
  );

  return result.rows[0];
};

export const authServices = {
  createUserIntoDB,
};
