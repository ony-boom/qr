// import { ResultSetHeader } from "mysql2";
import pool from "../config/db";

export type Credential = "email" | "id";

const isValidCredentials = async (
  credential: Credential,
  value: string
): Promise<boolean> => {
  let isValid = false;
  const [rows] = await pool.query(
    `SELECT ${credential} FROM members WHERE ${credential} = ?`,
    [value]
  );

  const result = <any[]>rows;

  if (result.length > 0) {
    isValid = true;
  }
  
  return isValid;
};

export default isValidCredentials;
