import { NextFunction, Request, Response } from "express";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";

import { ResponseForm } from "../helpers/responseData";
import Member from "../models/member";
import createTransporter from "../helpers/mailAPI";
import isValidCredentials, { Credential } from "../helpers/isValidCredentials";

const sendMail = async (
  to: string,
  content: string,
  member: string
): Promise<boolean> => {
  let sent = false;

  const [memberLastName] = member.split(" ");

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

  return sent;
};

export const createMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstname, lastname, email, phone } = req.body;
  const id = uuidv4();

  try {
    const qrCode = await QRCode.toDataURL(id, { rendererOpts: { quality: 1 } });
    const newMember = await Member.create({
      email,
      lastname,
      firstname,
      phone,
    });

    if (newMember) {
      const emailSent = await sendMail(email, qrCode, lastname);

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

export const validate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let cred: Credential = "_id";
  let value = "";
  let valid = false;

  switch (req.method.toLowerCase()) {
    case "put":
      cred = "_id";
      value = req.body.id;
      break;
    case "get":
      cred = "email";
      value = req.params.email;
      break;
  }
  valid = await isValidCredentials(cred, value);
  if (!valid) {
    const response: ResponseForm<null> = {
      status: "Failed",
      message: "Member not found, Please Provide a valid " + cred,
      data: null,
    };
    return res.status(404).json(response);
  }

  next();
};

export const checkQuery = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.params;

  if (!email) {
    const response: ResponseForm<null> = {
      status: "Failed",
      message: "Please Provide a valid mail",
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

  // const rows = await pool.query("SELECT id, points FROM members WHERE id = ?", [
  //   id,
  // ]);
  // const member = rows[0] as IdDataResult[];
  //
  // try {
  //   if (member.length > 0) {
  //     member[0].points = Number(member[0].points) + 1;
  //     const newPoints = member[0].points;
  //
  //     const [info] = await pool.query<ResultSetHeader>(
  //       "UPDATE members SET points = ? WHERE id = ?",
  //       [newPoints, id]
  //     );
  //
  //     if (info.affectedRows) {
  //       const response: ResponseForm<object> = {
  //         status: "Success",
  //         message: "Member Points Updated",
  //         data: member[0],
  //       };
  //       res.status(200).json(response);
  //     }
  //   }
  // } catch (err) {
  //   const response: ResponseForm<null> = {
  //     status: "error",
  //     message: "Server Error",
  //     data: null,
  //   };
  //   res.status(500).json(response);
  // }
  next();
};

export const getMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.params;

  // try {
  //   const rows = await pool.query(
  //     "SELECT first_name, last_name, email, points, phone, qr_code FROM members WHERE email = ?",
  //     [email]
  //   );
  //   const memberInfo = rows[0] as IdDataResult[];
  //
  //   const response: ResponseForm<object> = {
  //     status: "Success",
  //     message: "Member found",
  //     data: memberInfo[0],
  //   };
  //   res.status(200).json(response);
  // } catch (e) {
  //   const response: ResponseForm<null> = {
  //     status: "error",
  //     message: "Server Error",
  //     data: null,
  //   };
  //   res.status(500).json(response);
  // }
  next();
};

export const getAllMember = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  // const [rows] = await pool.query(
  //   "SELECT first_name, last_name, points, email FROM members"
  // );
  //
  // const response: ResponseForm<object> = {
  //   status: "Success",
  //   message: "Members",
  //   data: rows,
  // };
  //
  // res.status(200).json(response);
  next();
};
