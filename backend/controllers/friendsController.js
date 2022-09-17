import UserModel from "../models/usermodel.js";

const error = (res, message, error) => res.status(400).json({ message, error });

const addFriend = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).orFail();
    const friend = await UserModel.findById(req.body._id).orFail();
    if (user.friends.includes(friend._id)) throw new Error("Already a friend!");
    user.friends.push(friend._id);
    await user.save();
    const current = await UserModel.findById(user._id).populate("friends", "-passwordHash");
    res.json(current.friends);
  } catch (err) {
    error(res, "Cannot add friend", err);
  }
};

const removeFriend = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).orFail();
    const friend = await UserModel.findById(req.body._id).orFail();
    user.friends.pull(friend._id);
    await user.save();
    const current = await UserModel.findById(user._id).populate("friends", "-passwordHash");
    res.json(current.friends);
  } catch (err) {
    console.log(err);
    error(res, "Cannot remove friend", err);
  }
};

const queryFriends = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).orFail().populate("friends", "-passwordHash");
    //TODO: add query options
    res.json(user.friends);
  } catch (err) {
    error(res, "Cannot query friends", err);
  }
};
// finds friends of friends that are not yet friends
const querySuggestedFriends = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).orFail().populate("friends", "-passwordHash");
    const friendsObj = {};
    for (const friend of user.friends) {
      friend.friends.forEach((fr) => (friendsObj[fr._id] = true));
    }
    user.friends.forEach((friend) => (friendsObj[friend._id] = false));
    friendsObj[user._id] = false;
    const friendsOfFriends = Object.keys(friendsObj).filter((friend_id) => friendsObj[friend_id]);
    const suggested = await UserModel.find().where("_id").in(friendsOfFriends).select("-passwordHash");
    res.json(suggested);
  } catch (err) {
    console.log(err);
    error(res, "Cannot suggest friends", err);
  }
};

const queryAvailable = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).orFail();
    const optFriendsQuery = UserModel.find()
      .where("_id")
      .nin([...user.friends, user._id]);
    // TODO: add query options
    res.json(await optFriendsQuery.select("-passwordHash"));
  } catch (err) {
    console.log(err);
    error(res, "Cannot query available friends", err);
  }
};

const friendController = {
  get: queryFriends,
  post: addFriend,
  delete: removeFriend,
  suggested: querySuggestedFriends,
  available: queryAvailable,
};

export default friendController;
