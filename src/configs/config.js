import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

export default {
  PORT: process.env.PORT || 5000,
  MONGO_URI:process.env.MONGO_URI
};
