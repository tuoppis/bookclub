import { useState, useEffect, useCallback } from "react";
import { useLogin } from "../models/logincontext.js";
import { useApp } from "../models/appcontext.js";
import { Box, List, Typography } from "@mui/material";
import BookBack from "../components/bookback.js";
import BookEdit from "../components/bookedit.js";

export default function BookView() {
  const user = useLogin();
  const [app] = useApp();
  const [books, setBooks] = useState([]);
  const [selected, setSelected] = useState(-1);
  const [loading, setLoading] = useState(false);

  const loadBooks = useCallback(async () => {
    setLoading(true);
    setSelected(-1);
    const books = await user.get(app.authUrl + "/books");
    setBooks(books);
    setLoading(false);
  }, [user, app]);

  const handleClose = useCallback((data) => {
    setSelected(-1);
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  return (
    <Box>
      <Typography>List of Books</Typography>
      <List
        dense={true}
        sx={{
          width: "100%",
          //maxWidth: 500,
          bgcolor: "background.paper",
          position: "relative",
          overflow: "auto",
          maxHeight: "80%",
          "& ul": { padding: 0 },
        }}
        disabled={loading}
      >
        {books.map((book, idx) => (
          <BookBack book={book} index={idx} onClick={setSelected} />
        ))}
      </List>
      <BookEdit book={books[selected]} show={selected >= 0} close={handleClose} />
    </Box>
  );
}
