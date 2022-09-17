import { useState } from "react";
import { useApp } from "../models/appcontext.js";
import { Box, FormControl, FormControlLabel, FormLabel, RadioGroup, Radio } from "@mui/material";
import BookList from "../components/userlist.js";
import BookEdit from "../components/bookedit.js";

export default function MyBooksView() {
  const [app] = useApp();
  const [mode, setMode] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const handleClick = (book) => {
    const thisBook = book.book ?? book;
    setSelectedBook(book);
    setShowEdit(true);
  };
  const handleChange = (e) => setMode(e.target.value);
  const handleEditClose = (book) => {
    setShowEdit(false);
    setSelectedBook(null);
  };
  return (
    <Box>
      <FormControl>
        <FormLabel>My Books</FormLabel>
        <RadioGroup row name="friend-radio-group" value={mode} onChange={handleChange}>
          <FormControlLabel value="" control={<Radio />} label="Owned" />
          <FormControlLabel value="/loaned" control={<Radio />} label="Loaned" />
          <FormControlLabel value="/available" control={<Radio />} label="Available" />
        </RadioGroup>
      </FormControl>
      <BookList url={app.myBooksUrl + mode} onClick={handleClick} actions={null} />
      <BookEdit show={showEdit} book={selectedBook?.book} close={handleEditClose} />
    </Box>
  );
}

// import { useState, useCallback, useEffect } from "react";
// import { useApp } from "../models/appcontext.js";
// import { useLogin } from "../models/logincontext.js";
// import BookBack from "../components/bookback.js";
// import { List, Grid } from "@mui/material";

// export default function MyBooksView() {
//   const [app] = useApp();
//   const user = useLogin();
//   const [loading, setLoading] = useState(false);
//   const [myBooks, setMyBooks] = useState([]);

//   const loadBooks = useCallback(async () => {
//     if (!user.authorized) return;
//     setLoading(true);
//     const books = await user.get(app.myBooksUrl, {});
//     setMyBooks(books);
//     setLoading(false);
//   }, [user, app.myBooksUrl]);

//   useEffect(() => {
//     loadBooks();
//   }, [loadBooks]);

//   return (
//     <Grid container spacing={10}>
//       <Grid item xs={6}>
//         <List dense={true}>
//           {myBooks.map((book, idx) => (
//             <BookBack book={book} />
//           ))}
//         </List>
//       </Grid>
//       <Grid item xs={6}></Grid>
//     </Grid>
//   );
// }
