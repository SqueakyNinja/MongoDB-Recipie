import connectDB from "./config/db";
import express from "express";
import dotenv from "dotenv";
import apiRouter from "./api.routes";
import cors from "cors";

const app = express();

connectDB();

dotenv.config();

app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use("/api", apiRouter);

export default app;
