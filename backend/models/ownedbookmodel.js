import mongoose from "mongoose";

const ownedBookSchema = new mongoose.Schema({
  book: {
    type: mongoose.ObjectId,
    ref: "books",
  },
  owner: {
    type: mongoose.ObjectId,
    ref: "users",
  },
  holder: {
    type: mongoose.ObjectId,
    ref: "users",
  },
});

// ownedBookSchema.pre("find", function (next) {
//   this.populate("book_id");
// });

const OwnedBookModel = mongoose.model("ownedbooks", ownedBookSchema);
export default OwnedBookModel;
