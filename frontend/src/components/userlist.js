import { useState, useEffect } from "react";
import { useLogin } from "../models/logincontext.js";
import { Box, List, ListItem, ListItemText, ListItemButton, ListItemIcon } from "@mui/material";
import { Person } from "@mui/icons-material";

function UserListItem({ user, onClick }) {
  return (
    <ListItem key={user.username} disablePadding>
      <ListItemButton onClick={() => onClick(user)}>
        <ListItemIcon>
          <Person />
        </ListItemIcon>
        <ListItemText primary={user.username} secondary={user._id} />
      </ListItemButton>
    </ListItem>
  );
}

export default function UserList({ url, onClick, actions }) {
  const user = useLogin();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    const users = await user.get(url);
    setUsers(users);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, [user, url]);

  return (
    <Box>
      <List
        dense={true}
        sx={{
          width: "100%",
          maxWidth: "80%",
          bgcolor: "background.paper",
          position: "relative",
          overflow: "auto",
          maxHeight: "80%",
          "& ul": { padding: 0 },
        }}
        disabled={loading}
      >
        {users.map((user) => (
          <UserListItem user={user} onClick={onClick} />
        ))}
      </List>
      <Box>{Array.isArray(actions) && actions}</Box>
    </Box>
  );
}
