import express from "express";
import { router as serverEmail } from "./api/serverEmail";
import { router as index } from "./api/index";
import { router as tableUser } from "./api/tableUser";
import { router as tableImage } from "./api/tableImage";
import { router as tableVote } from "./api/tableVote";
import { router as upload } from "./api/upload";
import cors from 'cors';
import bodyParser from "body-parser";

export const app = express();
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/", index);
app.use("/send-otp", serverEmail);

app.use("/tableUser", tableUser);
app.use("/tableImage", tableImage);
app.use("/tableVote", tableVote);
app.use("/upload", upload);