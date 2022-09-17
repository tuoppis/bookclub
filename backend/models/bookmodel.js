import mongoose from "mongoose";

const IntValidator = {
  validator: function (num) {
    return Number.isInteger(num);
  },
  message: "This value must be an integer, was {VALUE}!",
};

const bookSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  language: String,
  year: {
    type: Number,
    validate: IntValidator,
  },
  pages: {
    type: Number,
    validate: IntValidator,
  },
  imageLink: String,
  link: String,
  created_by: {
    type: mongoose.ObjectId,
    ref: "users",
  },
});

const BookModel = mongoose.model("books", bookSchema);
export default BookModel;
