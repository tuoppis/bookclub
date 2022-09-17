import { readFileSync } from "fs";
import mongoose from "mongoose";
import UserModel from "../models/usermodel.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const userfile = process.argv[3];
const database = process.argv[2];

if (!userfile || !database || !process.env.PASSWORD_SALT) {
  console.log("Needs database and user file names or password salt not set.");
  process.exit(1);
}

const users = JSON.parse(readFileSync(userfile));

await mongoose.connect("mongodb://localhost:27017/" + database);

const mongoUser = {};
const userFriends = {};

for (const user of users) {
  mongoUser[user.username] = new UserModel({
    username: user.username,
    passwordHash: await bcrypt.hash(user.password, Number(process.env.PASSWORD_SALT)),
    friends: [],
  });
  userFriends[user.username] = user.friends;
}
const mongoArr = [];
for (const [username, mUser] of Object.entries(mongoUser)) {
  const friends = userFriends[username];
  mUser.friends = friends.map((un) => mongoUser[un]._id);
  mongoArr.push(mUser);
}

await Promise.all(mongoArr.map((user) => user.save()));
await mongoose.disconnect();
console.log("Created", mongoArr.length, "users");
