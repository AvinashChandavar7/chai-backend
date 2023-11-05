// ! 2) In this file connectDB.js is the 2nd Approach for connecting to MongoDB

import colors from "colors";
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {

    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);

    console.log(`\n MongoDB connection DB HOST : ${connectionInstance.connection.host}`.blue.bold.underline);

  } catch (error) {
    console.log("\n MONGODB connection Failed: ".bgRed.bold, error);
    process.exit(1);
  }
};

export default connectDB;




// ! 2) In this file connectDB.js is the 2nd Approach for connecting to MongoDB
