import OwnedBookModel from "../models/ownedbookmodel.js";
import BookModel from "../models/bookmodel.js";
import UserModel from "../models/usermodel.js";

const error = (res, message, error) => res.status(400).json(message, error);
/**
 * Tries to create a new owned book that belongs to req.user._id
 * if the req.body._id is,
 * 1) not set or the book does not exist:
 *      create new book with created_by field and an owned book that refers to it.
 * 2) set and refers to a book without created_by field:
 *      create new owned book that refers to it.
 * 3) set and refers to a book with a created_by field:
 *      user created book and cannot be added to owned book.
 *      it is either someone else or already owned.
 */
const create = async (req, res) => {
  try {
    const owner = req.user._id;
    let book = await BookModel.findById(req.body._id);

    if (book) {
      if (book.created_by) throw new Error("User created book!");
    } else {
      book = await BookModel.create({ ...req.body, created_by: owner }); //new book
    }

    const ownedbook = await OwnedBookModel.create({ book: book._id, owner, holder: owner });
    res.json(ownedbook.populate("book"));
  } catch (err) {
    error(res, "Cannot create book", err);
  }
};

/**
 * Tries to modify an owned book.
 * if req.body._id
 * 1) not set or doesn't refer to any owned book
 *      error
 * 2) refers owned book belonging to somebody else
 *      error
 * 3) owned book points to book user did not create
 *      error
 * ELSE:
 *      modify the books information (not owned book information)
 */

const modify = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).orFail();
    const ownedbook = await OwnedBookModel.findById(req.body._id).populate("book").orFail();
    if (ownedbook.book.created_by !== user._id) throw new Error("Not my book!");
    await BookModel.findByIdAndUpdate(ownedbook.book, req.body.book);
    res.json(await OwnedBookModel.findById(ownedbook._id).populate("book"));
  } catch (err) {
    error(res, "Cannot modify", err);
  }
};
/**
 * Tries to remove owned book
 * if req.body._id
 * 1) not set or not in ownedbooks
 *      error
 * 2) refers to owned book by someone else
 *      error
 * 3) refers to user's owned book
 *      a) book was not created by user
 *          delete owned book but the book it refers to
 *      b) was created by the user
 *          delete both
 */
const remove = async (req, res) => {
  try {
    const owner = await UserModel.findById(req.user._id).orFail();
    const ownedbook = await OwnedBookModel.findById(req.body._id).orFail();
    const book = await BookModel.findById(ownedbook.book).orFail();
    if (book.created_by === owner._id) await book.remove();
    await ownedbook.remove();
    res.json(book);
  } catch (err) {
    error(res, "Cannot remove book", err);
  }
};

const query = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).orFail();
    //TODO: add query options
    const ownedBooks = await OwnedBookModel.find({ owner: req.user._id }).populate("book");
    res.json(ownedBooks);
  } catch (err) {
    error(res, "Cannot query my books!", err);
  }
};

const queryAvailable = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).orFail();
    let query = BookModel.find({ created_by: { $exists: false } });
    //TODO: add query options
    res.json(await query);
  } catch (err) {
    error(res, "Cannot query available books", err);
  }
};

const queryLoaned = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).orFail();
    let query = OwnedBookModel.find({ owner: user._id }).where("holder").ne(user._id);
    res.json(await query.populate("book"));
  } catch (err) {
    error(res, "Cannot query loaned books", err);
  }
};

const myBookController = {
  delete: remove,
  post: create,
  put: modify,
  get: query,
  available: queryAvailable,
  loaned: queryLoaned,
};

export default myBookController;
