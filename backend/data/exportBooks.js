import mongoose from "mongoose";
import BookModel from "../models/bookmodel.js";
import { readFileSync } from "fs";

const database = process.argv[2];
const bookFile = process.argv[3];

if (!bookFile || !database) {
  console.log("Name of database and data file are required!");
  process.exit(1);
}

const books = JSON.parse(readFileSync(bookFile));

await mongoose.connect("mongodb://localhost:27017/" + database);
await BookModel.create(books);
mongoose.disconnect();
console.log("Exported", books.length, "books to", database);
