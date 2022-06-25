import express from "express";
import cors from "cors";
import morgan from "morgan";
import memberRoute from "./routes/memberRouter";

const app = express();

app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/members", memberRoute);

export default app;
