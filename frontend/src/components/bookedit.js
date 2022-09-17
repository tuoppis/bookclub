import { useEffect, useReducer } from "react";
import { breakCamel } from "../util/stringops.js";
import { TextField, Dialog, DialogTitle, DialogActions, DialogContent, Button } from "@mui/material";

const bookReducer = (state, action) => {
  const altState = { ...state };
  Object.entries(action)
    .filter(([key, value]) => value !== undefined)
    .forEach(([key, value]) => (altState[key] = value));
  return altState;
};

const BookField = ({ field, type, value, dispatch }) => {
  const handleChange = (e) => dispatch({ [field]: type === "number" ? Number(value) : value });
  return <TextField label={breakCamel(field)} value={value} type={type} fullWidth onChange={handleChange} />;
};

const baseBook = {
  title: "",
  author: "",
  language: "",
  year: 1900,
  pages: 0,
  link: "",
  imageLink: "",
};

export default function BookEdit({ book, show, close }) {
  const [editedBook, dispatch] = useReducer(bookReducer, baseBook);

  const handleOk = () => close(editedBook, book);
  const handleCancel = () => close();

  useEffect(() => {
    const eBook = book ? { ...book } : {};
    delete eBook._id;
    delete eBook.created_by;
    delete eBook.__v;
    dispatch(eBook);
  }, [book]);

  return (
    <Dialog open={show} keepMounted>
      <DialogTitle>{book?._id ? "Edit book" : "Create book"}</DialogTitle>
      <DialogContent>
        {Object.entries(editedBook).map(([key, value], idx) => {
          const type = key === "pages" || key === "year" ? "number" : "text";
          return <BookField key={`bookfield${idx}`} field={key} value={value} type={type} dispatch={dispatch} />;
        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleOk}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
