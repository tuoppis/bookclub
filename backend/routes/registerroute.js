import express from "express";
import registerHandler from "../controllers/registercontroller.js";

const registerRoute = express.Router();
registerRoute.post("/", registerHandler);

export default registerRoute;
