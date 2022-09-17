import express from "express";
import loginHandler from "../controllers/logincontroller.js";

const loginRoute = express.Router();
loginRoute.post("/", loginHandler);

export default loginRoute;
