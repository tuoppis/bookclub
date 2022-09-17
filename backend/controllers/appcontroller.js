import jwt from "jsonwebtoken";

const tokenError = (res) => res.status(401).send("Invalid token!");

export default function tokenVerify(req, res, next) {
  const auth = req.get("authorization");
  if (auth?.toLowerCase().startsWith("bearer ")) {
    const token = auth.substring(7);
    const payload = jwt.verify(token, process.env.JWT_TOKEN);
    if (!token || !payload._id) return tokenError(res);
    req.user = payload;
    next();
  } else return tokenError(res);
}

export const refreshToken = async (req, res) =>
  res.json({ token: jwt.sign({ _id: req.user._id }, process.env.JWT_TOKEN, { expiresIn: "1h" }) });
