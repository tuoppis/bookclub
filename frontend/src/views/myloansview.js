import { useState } from "react";
import { useApp } from "../models/appcontext.js";
import { Box, FormControl, FormControlLabel, FormLabel, RadioGroup, Radio } from "@mui/material";
import BookList from "../components/userlist.js";
import BookEdit from "../components/bookedit.js";

export default function MyLoansView() {
  const [app] = useApp();
  const [mode, setMode] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const handleClick = (book) => {
    const thisBook = book.book ?? book;
    setSelectedBook(book);
    setShowEdit(true);
    alert("Clicked a book " + thisBook?.title + " by " + thisBook?.author);
  };
  const handleChange = (e) => setMode(e.target.value);
  const handleEditClose = (book) => {
    setShowEdit(false);
  };
  return (
    <Box>
      <FormControl>
        <FormLabel>My Loans</FormLabel>
        <RadioGroup row name="friend-radio-group" value={mode} onChange={handleChange}>
          <FormControlLabel value="" control={<Radio />} label="Loaned " />
          <FormControlLabel value="/available" control={<Radio />} label="Available" />
        </RadioGroup>
      </FormControl>
      <BookList url={app.myLoansUrl + mode} onClick={handleClick} actions={null} />
      <BookEdit open={showEdit} book={selectedBook} close={handleEditClose} />
    </Box>
  );
}
