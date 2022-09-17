import express from "express";
import tokenVerify, { refreshToken } from "../controllers/appcontroller.js";
import friendController from "../controllers/friendsController.js";
import myBookController from "../controllers/mybookscontroller.js";
import myLoanController from "../controllers/myloanscontroller.js";
import bookController from "../controllers/bookscontroller.js";

const appRoute = express.Router();
appRoute.use(tokenVerify);

// Books owned by the user
appRoute.get("/mybooks", myBookController.get); // query my owned books
appRoute.get("/mybooks/available", myBookController.available); // query available books (books without an owner)
appRoute.get("/mybooks/loaned", myBookController.loaned); // query my books loaned to someone.
appRoute.put("/mybooks", myBookController.put); // modify owned book
appRoute.post("/mybooks", myBookController.post); // create new owned book
appRoute.delete("/mybooks", myBookController.delete); // remove owned book
// Books loaned from friends
appRoute.get("/myloans", myLoanController.get); // query books borrowed (from owned books with my id)
appRoute.get("/myloans/available", myLoanController.available); // query books available for loan
appRoute.post("/myloans", myLoanController.post); // adds a loan (have to be from a friend)
appRoute.delete("/myloans", myLoanController.delete); // removes/returns a loan (don't have to be friends)
//
appRoute.get("/friends", friendController.get); // query friends
appRoute.post("/friends", friendController.post); // adds a friend
appRoute.delete("/friends", friendController.delete); // removes a friend
appRoute.get("/friends/suggested", friendController.suggested); // shows friends of friends that are not yet friends
appRoute.get("/friends/available", friendController.available); // shows all users that are not friends
// Books in the 'store'
appRoute.get("/books", bookController.get); // query
appRoute.post("/books", bookController.post);

// refresh token
appRoute.get("/", refreshToken);

export default appRoute;
