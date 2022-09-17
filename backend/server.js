import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import readline from "readline";
import appRoute from "./routes/approute.js";
import loginRoute from "./routes/loginroute.js";
import registerRoute from "./routes/registerroute.js";

dotenv.config();

if (!process.env.JWT_TOKEN || !process.env.PASSWORD_SALT) {
  console.log("Environment has not been configured correctly!");
  process.exit(1);
}

const port = 3008;
const app = express();
app.use(express.json());
app.use(cors());
app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/app", appRoute);

await mongoose.connect("mongodb://localhost:27017/libraryDB");

const server = app.listen(port, () => console.log("Listening port", port));

const con = readline.createInterface({ input: process.stdin, output: process.stdout });

con.question("Press enter to quit", async (ans) => {
  await mongoose.disconnect();
  server.closeAllConnections();
  server.close(() => console.log("server closed"));
});
