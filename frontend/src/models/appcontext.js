import { createContext, useContext, useReducer } from "react";

const AppContext = createContext(undefined);
const changeables = ["server", "port", "app", "theme"];
const appReducer = (state, payload) => {
  const altState = { ...state };
  changeables.forEach((item) => {
    const value = payload[item];
    if (value) altState[item] = value;
  });
  return altState;
};

const AppProvider = (props) => {
  const [app, dispatch] = useReducer(appReducer, {
    server: "http://localhost",
    port: 3008,
    app: "/app",
    storedToken: "LIB_TOKEN",
    theme: "light",
    get authUrl() {
      return `${this.server}:${this.port}${this.app}`;
    },
    get friendsUrl() {
      return this.authUrl + "/friends";
    },
    get myBooksUrl() {
      return this.authUrl + "/mybooks";
    },
    get myLoansUrl() {
      return this.authUrl + "/myloans";
    },
    get loginUrl() {
      return `${this.server}:${this.port}/login`;
    },
    get registerUrl() {
      return `${this.server}:${this.port}/register`;
    },
  });

  return <AppContext.Provider value={[app, dispatch]}>{props.children}</AppContext.Provider>;
};

export const useApp = () => {
  const app = useContext(AppContext);
  if (!app) throw new Error("Not inside App provider");
  return app;
};

export default AppProvider;
