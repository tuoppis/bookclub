import UserModel from "../models/usermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const loginError = (res, status, message) => res.status(status).send(message || "Incorrect username of password!");

export default async function loginHandler(req, res) {
  if (!req.body.username || !req.body.password) return loginError(res, 400);
  try {
    const user = await UserModel.findOne({ username: req.body.username });

    if (!user) return loginError(res, 401);
    const passwordOk = await bcrypt.compare(req.body.password, user.passwordHash);
    if (!passwordOk) return loginError(res, 401);
    const token = jwt.sign({ _id: user._id }, process.env.JWT_TOKEN, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    return loginError(res, 500, "Something's not right!");
  }
}
