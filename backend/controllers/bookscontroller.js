import BookModel from "../models/bookmodel.js";

const bookError = (res, status, message, error) => res.status(status).json({ message, error });

const queryBooks = async (req, res) => {
  try {
    // TODO: add query options
    const query = BookModel.find();
    res.json(await query);
  } catch (err) {
    bookError(res, 400, "Cannot query books", err);
  }
};

const addBook = async (req, res) => {
  try {
    const book = await BookModel.create(req.body);
    res.json(book);
  } catch (err) {
    bookError(res, 400, "Cannot create book", err);
  }
};

const bookController = {
  get: queryBooks,
  post: addBook,
};

export default bookController;
