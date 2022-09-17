import { useState, useEffect } from "react";
import { useLogin } from "../models/logincontext.js";
import { Box, List, ListItem, ListItemText, ListItemButton, ListItemIcon } from "@mui/material";
import { MenuBook } from "@mui/icons-material";

function BookListItem({ book, onClick, index }) {
  const thisBook = book.book ?? book;
  return (
    <ListItem key={`book-${thisBook?.title}-${index}`} disablePadding>
      <ListItemButton onClick={() => onClick(book)}>
        <ListItemIcon>
          <MenuBook />
        </ListItemIcon>
        <ListItemText primary={thisBook.title} secondary={thisBook.author} />
      </ListItemButton>
    </ListItem>
  );
}

export default function BookList({ url, onClick, actions }) {
  const user = useLogin();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadBooks = async () => {
    setLoading(true);
    const users = await user.get(url);
    setBooks(users);
    setLoading(false);
  };

  useEffect(() => {
    loadBooks();
  }, [user, url]);

  return (
    <Box>
      <List
        dense={true}
        sx={{
          width: "100%",
          maxWidth: "50%",
          bgcolor: "background.paper",
          position: "relative",
          overflow: "auto",
          maxHeight: "80%",
          "& ul": { padding: 0 },
        }}
        disabled={loading}
      >
        {books.map((book, idx) => (
          <BookListItem book={book} onClick={onClick} index={idx} />
        ))}
      </List>
      <Box>{Array.isArray(actions) && actions}</Box>
    </Box>
  );
}
