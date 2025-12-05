import bcrypt from "bcryptjs";
import { pool } from "../../database/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = "myjwtsecret123";

const getUserByEmail = async (email: string) => {
  const result = await pool.query(
    `
      SELECT * FROM users WHERE email=$1
    `,
    [email.toLowerCase()]
  );

  return result.rows[0];
};

const comparePassword = async (plain: string, hashed: string) => {
  return await bcrypt.compare(plain, hashed);
};

const generateToken = (payload: any) => {
  return jwt.sign(payload, JWT_SECRET as string, {
    expiresIn: "7d",
  });
};


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
  getUserByEmail,
  comparePassword,
  generateToken,
};
