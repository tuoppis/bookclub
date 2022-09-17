import { useState, useEffect } from "react";
import { ListItem, ListItemText, ListItemButton } from "@mui/material";

export default function BookBack({ book, index, onClick }) {
  const [selected, setSelected] = useState(false);
  const [idx, setIdx] = useState(-1);
  const handleClick = () => {
    const newSelected = !selected;
    //setSelected(newSelected);
    onClick(idx, newSelected, setSelected);
  };

  useEffect(() => {
    setIdx(index);
  }, [index]);
  return (
    <ListItemButton onClick={handleClick}>
      <ListItem
        key={`bookback${book.title}`}
        secondaryAction={<ListItemText edge="end" primary={book.year ?? ""} secondary={book.language ?? ""} />}
        selected={selected}
      >
        <ListItemText primary={book.title} secondary={book.author} />
      </ListItem>
    </ListItemButton>
  );
}
