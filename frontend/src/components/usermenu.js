import { useState } from "react";
import { useLogin } from "../models/logincontext.js";
import { Box, Menu, MenuItem, Tooltip, IconButton } from "@mui/material";
import { Person, PersonOff, AccountCircleOutlined, NoAccountsOutlined } from "@mui/icons-material";
import LoginPrompt from "./loginprompt.js";

function MenuOptions({ hasLogin, selectOption }) {
  if (!hasLogin) return <MenuItem onClick={() => selectOption("login")}>Login/Register</MenuItem>;
  const handleClick = (opt) => selectOption(opt);
  return (
    <>
      <MenuItem onClick={() => selectOption("mybooks")}>My Books</MenuItem>
      <MenuItem onClick={() => selectOption("friends")}>My Friends</MenuItem>
      <MenuItem onClick={() => selectOption("myloans")}>My Loans</MenuItem>
      <MenuItem onClick={() => selectOption("logout")}>Logout</MenuItem>
    </>
  );
}

export default function UserMenu({ makeSelection }) {
  const user = useLogin();
  const [menuElement, setMenuElement] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const handleOpenMenu = (e) => setMenuElement(e.currentTarget);
  const handleCloseMenu = (e) => setMenuElement(null);
  const handleLoginClose = (ok) => {
    setShowLogin(false);
  };
  const handleSelectOption = (opt) => {
    handleCloseMenu();
    switch (opt) {
      case "login":
        return setShowLogin(true);
      case "logout":
        user.logout();
        return makeSelection("");
      default:
        return makeSelection(opt);
    }
  };
  const hasLogin = user.authorized;

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="User">
        <IconButton onClick={handleOpenMenu} sx={{ p: 0, color: "white" }}>
          {hasLogin ? <AccountCircleOutlined /> : <NoAccountsOutlined />}
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: "45px" }}
        id="usermenu"
        anchorEl={menuElement}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(menuElement)}
        onClose={handleCloseMenu}
      >
        <MenuOptions hasLogin={hasLogin} selectOption={handleSelectOption} />
      </Menu>
      <LoginPrompt show={showLogin} close={handleLoginClose} />
    </Box>
  );
}
