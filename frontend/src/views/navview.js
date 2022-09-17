import { useState } from "react";
import { AppBar, Container, Toolbar, Box, Button } from "@mui/material";
import MyLoansView from "./myloansview.js";
import MyFriendsView from "./myfriendsview.js";
import MyBooksView from "./mybooksview.js";
import BookView from "./booksview.js";
import UserMenu from "../components/usermenu.js";

const pageHolder = {
  mybooks: <MyBooksView />,
  friends: <MyFriendsView />,
  myloans: <MyLoansView />,
  books: <BookView />,
};

export default function NavView() {
  const [selectedPage, setSelectedPage] = useState("");
  return (
    <Box>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: { xl: "flex" } }}>
              <Button sx={{ my: 2, color: "white", display: "block" }} onClick={() => setSelectedPage("books")}>
                Books
              </Button>
            </Box>
            <UserMenu makeSelection={setSelectedPage} />
          </Toolbar>
        </Container>
      </AppBar>
      {selectedPage ? pageHolder[selectedPage] : <p>Nothing</p>}
    </Box>
  );
}
