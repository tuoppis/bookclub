import { createContext, useCallback, useState, useEffect, useContext } from "react";
import { useApp } from "./appcontext.js";
import Api from "../util/api.js";

const LoginContext = createContext("");

const LoginProvider = (props) => {
  const [app] = useApp();
  const [token, setToken] = useState("");
  const [refreshInterval, setRefreshInterval] = useState(1000 * 60 * 15);
  const logout = useCallback(async () => {
    setToken("");
    localStorage.removeItem(app.storedToken);
    return true;
  }, [app]);
  const refreshToken = useCallback(
    async (token) => {
      try {
        const data = await Api.get(app.authUrl, {}, token);
        if (!data.token) throw new Error("No token!");
        setToken(data.token);
        return true;
      } catch (err) {}
      logout();
      return false;
    },
    [app]
  );

  const login = useCallback(
    async (username, password) => {
      try {
        const data = await Api.post(app.loginUrl, { username, password });
        if (!data.token) throw new Error("No token!");
        setToken(data.token);
        localStorage.setItem(app.storedToken, data.token);
        return true;
      } catch (err) {
        logout();
      }
      return false;
    },
    [app]
  );

  const registerAndLogin = useCallback(
    async (username, password) => {
      try {
        const msg = await Api.post(app.registerUrl, { username, password });
        if (msg !== "Ok") throw new Error("Registering user failed!");
        return await login(username, password);
      } catch (err) {
        await logout();
      }
      return false;
    },
    [app]
  );

  useEffect(() => {
    const savedToken = localStorage.getItem(app.storedToken);
    if (savedToken) {
      const checkToken = async () => {
        try {
          const d = await Api.get(app.authUrl, {}, savedToken);
          if (!d) throw new Error("Server did not respond correctly!");
          setToken(savedToken);
        } catch (err) {
          logout();
        }
      };
      checkToken();
    }
  }, [Api]);

  useEffect(() => {
    let timer;
    if (token) {
      timer = setTimeout(async () => refreshToken(token), refreshInterval);
    }
    return () => clearTimeout(timer);
  }, [token, refreshToken, refreshInterval]);

  const value = {
    authorized: Boolean(token),
    login,
    logout,
    registerAndLogin,
    get: async (url, body) => Api.get(url, body, token),
    put: async (url, body) => Api.put(url, body, token),
    post: async (url, body) => Api.post(url, body, token),
    delete: async (url, body) => Api.delete(url, body, token),
  };

  return <LoginContext.Provider value={value}>{props.children}</LoginContext.Provider>;
};

export const useLogin = () => {
  const user = useContext(LoginContext);
  if (!user) throw new Error("Not inside LoginProvider");
  return user;
};

export default LoginProvider;
