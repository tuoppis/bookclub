import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, match: /[a-zA-Z0-9]+/ },
  passwordHash: String,
  friends: [
    {
      type: mongoose.ObjectId,
      ref: "users",
    },
  ],
});

const UserModel = mongoose.model("users", userSchema);
export default UserModel;
