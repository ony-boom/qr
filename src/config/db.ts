import {connect} from "mongoose";
const DB_URI = process.env.DB_URI || "mongodb://localhost:27017/qr";

async function connecDb () {
    await connect(DB_URI);
}

export default connecDb;
