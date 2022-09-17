import UserModel from "../models/usermodel.js";
import OwnedBookModel from "../models/ownedbookmodel.js";

const error = (res, message, error) => res.status(400).json({ message, error });

const loanBook = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).orFail();
    const ownedBook = await OwnedBookModel.findById(req.body._id).orFail();
    if ("" + ownedBook.holder !== "" + ownedBook.owner) throw new Error("Already loaned to someone!");
    ownedBook.holder = user._id;
    const book = await ownedBook.save();
    res.json(await book.populate("book"));
  } catch (err) {
    console.log(err);
    error(res, "Cannot loan book", err);
  }
};

const returnBook = async (req, res) => {
  try {
    const user = UserModel.findById(req.user._id).orFail();
    const ownedBook = OwnedBookModel.findById(req.body._id).orFail();
    if (ownedBook.holder !== user._id) throw new Error("Not loaned to user!");
    ownedBook.holder = ownedBook.owner;
    res.json(await ownedBook.save());
  } catch (err) {
    error(res, "Cannot return loaned book", err);
  }
};

const showLoans = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).orFail();
    //TODO: add query options
    const loans = await OwnedBookModel.find({ holder: user._id }).where("owner").ne(user._id).populate("book");
    res.json(loans);
  } catch (err) {
    error(res, "Cannot query loans", err);
  }
};

const queryAvailableLoans = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).orFail();
    // TODO: add query options
    let query = OwnedBookModel.find({ $expr: { $eq: ["$owner", "$holder"] } })
      .where("owner")
      .in(user.friends);

    res.json(await query.populate("book"));
  } catch (err) {
    error(res, "Cannot query available loans", err);
  }
};

const myLoanController = {
  get: showLoans,
  available: queryAvailableLoans,
  post: loanBook,
  delete: returnBook,
};

export default myLoanController;
