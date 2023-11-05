import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";


dotenv.config({ path: './env' })

connectDB();






















/** 
 *   ! 1) First Approach for Connecting to Database
 *   import mongoose from "mongoose";
 *   import { DB_NAME } from "./constants";
 *   
 *   import express from "express";
 *   const app = express();
 *   
 *   const PORT = process.env.PORT || 8000;
 *   
 *   ; (async () => {
 *     try {
 *       await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
 *   
 *       app.on("error", (err) => {
 *         console.log("Error: ", err);
 *         throw err;
 *       });
 *   
 *       app.listen(PORT, () => {
 *         console.log(`App listening on port http://localhost:${PORT}`);
 *       })
 *   
 *     } catch (error) {
 *       console.error("ERROR: ", error);
 *       throw error;
 *     }
 *   })()
 *   
 */

/**
 * !) older version or commonjs version
 *  require('dotenv').config({ path: './env' })
 * 
 * !) new version or es6 version 
 * import dotenv from "dotenv";
 * dotenv.config({ path: './env' })
 * 
 * ? currently is experimental feature
 *  "scripts": {
 *      "dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js"
 *   },
 */