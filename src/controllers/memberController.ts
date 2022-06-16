import { Request, Response, NextFunction } from "express";
import ResponseForm from "../helpers/responseData";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import pool from "../config/db";
import createTransporter from "../helpers/mailAPI";

import { ResultSetHeader } from "mysql2";

const sendMail = async (to: string, content: string): Promise<boolean> => {
  let sent = false;

  try {
    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: `Ony <${process.env.MAIL_USER}>`,
      to,
      subject: "QR member code",
      text: "This is you're QR Code",
      attachments: [
        {
          path: content
        }
      ],
    });

    if (info.messageId) {
      sent = true
    }
  } catch (error) {
    throw error;
  }

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
      "INSERT INTO members(id, first_name, last_name, email, phone, qr_code, points) VALUES (?)",
      [[id, firstName, lastName, email, phone, qrCode, 0]]
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
    const response: ResponseForm<null> = {
      status: "error",
      message: "Server Error",
      data: null,
    };
    res.status(500).json(response);
  }
  next();
};
