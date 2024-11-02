import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const CORS_ORIGIN = process.env.CORS_ORIGIN;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;
const CLAUDHINARY_API_KEY = process.env.CLAUDHINARY_API_KEY;
const CLAUDHINARY_SECRET_KEY = process.env.CLAUDHINARY_SECRET_KEY;
const CLAUDHINARY_CLOUD_NAME = process.env.CLAUDHINARY_CLOUD_NAME;
export {
  PORT,
  MONGO_URI,
  CORS_ORIGIN,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  CLAUDHINARY_API_KEY,
  CLAUDHINARY_SECRET_KEY,
  CLAUDHINARY_CLOUD_NAME,
};
