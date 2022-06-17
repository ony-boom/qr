import { NextFunction, Request, Response } from "express";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";

import { ResultSetHeader } from "mysql2";
import { ResponseForm, IdDataResult } from "../helpers/responseData";
import pool from "../config/db";
import createTransporter from "../helpers/mailAPI";

const sendMail = async (
  to: string,
  content: string,
  member: string
): Promise<boolean> => {
  let sent = false;

  const [memberLastName] = member.split(" ");

  try {
    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: `Ony <${process.env.MAIL_USER}>`,
      to,
      subject: "QR member code",
      text: "Howdy " + memberLastName + " !" + "\n This is you're QR Code",
      attachments: [
        {
          path: content,
        },
      ],
    });

    if (info.messageId) {
      sent = true;
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
      const emailSent = await sendMail(email, qrCode, lastName);

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

export const checkBody = (req: Request, res: Response, next: NextFunction) => {
  let check = "";

  switch (req.method.toLowerCase()) {
    case "post":
      check = req.body.email;
      break;
    case "put":
      check = req.body.id;
      break;
  }

  if (!check) {
    const response: ResponseForm<null> = {
      status: "Failed",
      message: "Please Provide an ID",
      data: null,
    };
    return res.status(400).json(response);
  }

  next();
};

export const checkQuery = (req: Request, res: Response, next: NextFunction) => {
  const query = req.query;

  if (!query) {
    const response: ResponseForm<null> = {
      status: "Failed",
      message: "Please Provide an ID",
      data: null,
    };
    return res.status(400).json(response);
  }
  next();
};

export const updateMemberPoints = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.body;

  try {
    const rows = await pool.query(
      "SELECT id, points FROM members WHERE id = ?",
      [id]
    );
    const member = rows[0] as IdDataResult[];

    if (member.length > 0) {
      member[0].points = Number(member[0].points) + 1;
      const newPoints = member[0].points;

      const [info] = await pool.query<ResultSetHeader>(
        "UPDATE members SET points = ? WHERE id = ?",
        [newPoints, id]
      );

      if (info.affectedRows) {
        const response: ResponseForm<object> = {
          status: "Success",
          message: "Member Points Updated",
          data: member[0],
        };
        res.status(200).json(response);
      }
    }
  } catch (e) {
    const response: ResponseForm<null> = {
      status: "error",
      message: "Server Error",
      data: null,
    };
    res.status(500).json(response);
  }

  next();
};

export const getMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: mail } = req.query;

  try {
    const [rows] = await pool.query("SELECT * FROM members WHERE email = ?", [mail]);

    const memberInfo = rows as object[];

    const response: ResponseForm<object> = {
      status: "Success",
      message: "Member Points Updated",
      data: memberInfo[0],
    };
    res.status(200).json(response);
  } catch (e) {
    const response: ResponseForm<null> = {
      status: "error",
      message: "Server Error",
      data: null,
    };
    res.status(500).json(response);
  }
  next();
};
