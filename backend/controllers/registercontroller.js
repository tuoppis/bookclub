import UserModel from "../models/usermodel.js";
import bcrypt from "bcrypt";

const registerError = (res, status, message) => res.status(status).send(message || "Registering user failed!");

export default async function registerHandler(req, res) {
  if (!req.body.username || !req.body.password) return registerError(res, 400);

  const userObj = {
    username: req.body.username,
    passwordHash: bcrypt.hashSync(req.body.password, Number(process.env.PASSWORD_SALT)),
  };

  try {
    await UserModel.create(userObj);
  } catch (err) {
    return registerError(res, 401);
  }
  res.send("Ok");
}
