import express, { urlencoded } from "express";
const app = express();
import reqResInspector from "express-req-res-inspector";
import cookieParser from "cookie-parser";
import cors from "cors";
import { CORS_ORIGIN } from "./configs/config";




app.use(reqResInspector());
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: WebTransportDatagramDuplexStream,
  })
);
app.use(cookieParser());
app.use(express.json({limit:"16kb"}))
app.use(urlencoded({
    extended:true ,
    limit:"16kb"
}))
app.use(express.static("public"))

export { app };
