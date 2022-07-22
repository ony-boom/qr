import { Schema, model } from "mongoose";

interface IMember {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  qrCode: string;
  points?: number;
}

const memberSchema = new Schema<IMember>({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  points: { type: Number, required: false },
  qrCode: { type: String, required: true },
});

const Member = model<IMember>("Member", memberSchema);

export default Member;
