import dotenv from "dotenv";
import connectDb from "./config/db";
import app from "./app";
dotenv.config();

connectDb()
  .catch((err) => {
    throw err;
  })
  .then(() => {
    console.log("db connection ok");
  });

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
