import { useState, useEffect, useCallback } from "react";
import { useLogin } from "../models/logincontext.js";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function LoginPrompt({ show, close }) {
  const user = useLogin();
  const [loginInProgress, setLoginInProgress] = useState(false);
  const [message, setMessage] = useState("");
  const [options, setOptions] = useState({
    username: "",
    password: "",
    showPassword: false,
  });

  const toggleShowPassword = useCallback(() => setOptions((opt) => ({ ...opt, showPassword: !opt.showPassword })), []);
  const handleUsername = useCallback((e) => setOptions((opt) => ({ ...opt, username: e.target.value })), []);
  const handlePassword = useCallback((e) => setOptions((opt) => ({ ...opt, password: e.target.value })), []);
  const clearClose = (ok) => {
    setMessage("");
    setOptions({ username: "", password: "", showPassword: false });
    close(ok);
  };
  const handleLogin = async (e) => {
    setLoginInProgress(true);
    setMessage("Login in progress...");
    const result = await user.login(options.username, options.password);
    if (result) {
      clearClose(true);
    } else {
      setMessage("Failed to login! Check username and password!");
    }
    setLoginInProgress(false);
  };
  const handleRegister = async (e) => {
    setLoginInProgress(true);
    setMessage("Registering new user...");
    const result = await user.registerAndLogin(options.username, options.password);
    if (result) {
      clearClose(true);
    } else {
      setMessage("Registering failed! Check username!");
    }
    setLoginInProgress(false);
  };

  const disableButtons = loginInProgress || (!options.username && !options.password);

  return (
    <Dialog open={show} disabled={loginInProgress}>
      <DialogTitle>Authorization needed</DialogTitle>
      <DialogContent>
        <TextField
          required
          id="username"
          label="Username"
          type="text"
          placeholder="your username"
          fullWidth
          value={options.username}
          onChange={handleUsername}
        ></TextField>
        <TextField
          required
          id="password"
          label="Password"
          type={options.showPassword ? "text" : "password"}
          placeholder="your password"
          fullWidth
          value={options.password}
          onChange={handlePassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={toggleShowPassword}>
                  {options.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        ></TextField>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => clearClose(false)}>Cancel</Button>
        <Button disabled={disableButtons} onClick={handleLogin}>
          Login
        </Button>
        <Button disabled={disableButtons} onClick={handleRegister}>
          Register
        </Button>
      </DialogActions>
    </Dialog>
  );
}
