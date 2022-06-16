import { Request, Response, NextFunction } from "express";
import ResponseForm from "../helpers/responseData";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import pool from "../config/db";
import { ResultSetHeader } from "mysql2";

const sendMail = async (to: string, content: string): Promise<boolean> => {
  let sent = false;

  return sent;
};

export const createMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstName, lastName, email, phone } = req.body;
  const id = uuidv4();

  try {
    const qrCode = await QRCode.toDataURL(id, { rendererOpts: { quality: 1 } });
    const [newMember] = await pool.query<ResultSetHeader>(
      "INSERT INTO members(id, first_name, last_name, email, phone, qr_code) VALUES (?)",
      [[id, firstName, lastName, email, phone, qrCode]]
    );

    if (newMember.affectedRows) {
      const emailSent = await sendMail(email, qrCode);

      const response: ResponseForm<object> = {
        status: "Success",
        message: emailSent
          ? "An email with the qr code was sent to: " + email
          : "",
        data: { qrCode },
      };
      res.status(201).json(response);
    }
  } catch (error) {
    console.log(error);
    const response: ResponseForm<null> = {
      status: "error",
      message: "Server Error",
      data: null,
    };
    res.status(500).json(response);
  }
  next();
};
