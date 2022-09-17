import { useState, useEffect } from "react";
import { useLogin } from "../models/logincontext";
import { List, Box, ButtonGroup, Button } from "@mui/material";
import BookBack from "./bookback.js";
import BookEdit from "./bookedit.js";
import { AddCircle, Edit, Delete, Sync } from "@mui/icons-material";

export default function OwnedBookList({ url, whenAdd, whenEdit, whenRemove, whenSelect }) {
  const user = useLogin();
  const [books, setBooks] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadBooks = async () => {
    if (!user.authorized) return;
    setLoading(true);
    const books = await user.get(url);
    setBooks(books);
    setLoading(false);
  };

  const handleAdd = () => {
    whenAdd(books[selectedIndex]);
  };

  const handleRemove = () => {
    whenRemove(books[selectedIndex]);
  };

  const handleEdit = () => {
    whenEdit(books[selectedIndex]);
  };

  const handleSelect = (index, value, setter) => {
    whenSelect(index, value, setter);
  };

  useEffect(() => loadBooks, [user]);

  return (
    <Box>
      <ButtonGroup>
        {whenAdd ? (
          <Button onClick={handleAdd} startIcon={<AddCircle />}>
            Add
          </Button>
        ) : (
          false
        )}
        {whenRemove ? (
          <Button onClick={handleRemove} startIcon={<Delete />}>
            Remove
          </Button>
        ) : (
          false
        )}
        {whenEdit ? (
          <Button onClick={handleEdit} startIcon={<Edit />}>
            Edit
          </Button>
        ) : (
          false
        )}
        <Button onClick={loadBooks} startIcon={<Sync />}>
          Refresh
        </Button>
      </ButtonGroup>
      <List>
        {books.map((book, idx) => (
          <BookBack book={book.book} index={idx} onClick={handleSelect} />
        ))}
      </List>
    </Box>
  );
}
