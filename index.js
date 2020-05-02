require("dotenv").config();
const express = require("express");
const PORT = process.env.PORT || 5000;
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const {
  getUserDetails,
  getLoggedUserData,
  updateUserDetails,
  updateUserAvatar,
} = require("./handlers/users");
const {
  getAllPosts,
  getPostDetails,
  deletePost,
  addPost,
  updatePost,
} = require("./handlers/posts");
const {
  addNotification,
  deleteNotification,
  markReadNotification,
} = require("./handlers/notifcations");
const { like, unlike } = require("./handlers/likes");
const {
  addComment,
  deleteComment,
  updateComment,
} = require("./handlers/comments");
const { authenticateToken, login, signUp } = require("./utils/auth");

// USER ROUTES
app.get("/user", authenticateToken, getLoggedUserData);
app.post("/user", signUp);
app.post("/login", login);
app.get("/user/:nickName", authenticateToken, getUserDetails);
app.put("/user", authenticateToken, updateUserDetails);
app.put("/user/avatar", authenticateToken, updateUserAvatar);

// POSTS ROUTES
app.get("/posts", getAllPosts);
app.post("/post", authenticateToken, addPost);
app.delete("/post/:post_id", authenticateToken, deletePost);
app.get("/post/:post_id", authenticateToken, getPostDetails);
app.put("/post/:post_id", authenticateToken, updatePost);
// LIKES ROUTES
app.get("/like/:post_id", authenticateToken, like, addNotification);
app.get("/unlike/:post_id", authenticateToken, unlike, deleteNotification);
// COMMENTS ROUTES
app.post("/comment/:post_id", authenticateToken, addComment, addNotification);
app.put("/comment/:comment_id", authenticateToken, updateComment);
app.delete(
  "/comment/:comment_id",
  authenticateToken,
  deleteComment,
  deleteNotification
);
// NOTIFICATIONS
app.put(
  "/notification/:notification_id",
  authenticateToken,
  markReadNotification
);

app.listen(PORT, () => {
  console.log("server started on port", PORT);
});
