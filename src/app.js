import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

app.use(express.json({ limit: "16kb" }))

app.use(express.urlencoded({ extended: true, limit: "16kb" }))

app.use(express.static("public"))

app.use(cookieParser());


//! routes import

import userRouter from "./routes/user.routes.js";


//! routes declarations

app.use("/api/v1/users", userRouter)


export { app };


/**
 * ! CORS
 *  ?1)
 *  app.use(cors());
 * 
 * ?2)
 *  app.use(cors({
 *    origin: process.env.CORS_ORIGIN,
 *    credentials: true,
 *  }));
 * 
 */



/**
 * ! routes declarations
 * * app.use("/users", userRouter)
 * 
 * * https://localhost:8000//api/v1/users/register
 * * https://localhost:8000//api/v1/users/login
 */