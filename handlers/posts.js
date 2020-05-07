const db = require("../config/database");
const { validateAddPost } = require("../utils/validators");

exports.getAllPosts = async (req, res) => {
  const postsAmount = 5;
  const startPosition = req.params.startPosition;
  let query = `SELECT
    posts.body,
        posts.commentsCount,
        posts.likesCount,
        posts.createdAt,
        posts.post_id,
        users.nickName,
        users.avatar
    FROM
    posts
    JOIN
    users ON posts.user_id = users.user_id
    ORDER BY posts.createdAt DESC
    LIMIT ${startPosition},${postsAmount}`;
  try {
    const posts = await db.query(query);
    return res.status(200).json(posts);
  } catch {
    console.error(err);
    return res.status(500).json(err);
  }
};
exports.getPostDetails = async (req, res) => {
  const postId = req.params.post_id;
  const data = {};
  try {
    let query = `SELECT posts.post_id,posts.body,posts.createdAt,posts.likesCount,posts.commentsCount,users.nickName,users.firstName,users.lastName,users.avatar
    FROM posts join users
    ON posts.user_id=users.user_id
    WHERE posts.post_id=${postId}`;
    const postsWithID = await db.query(query);
    if (postsWithID.length === 0)
      return res.status(404).json({ general: "Post not found" });
    const postDetails = postsWithID[0];
    data.postDetails = postDetails;
    query = `SELECT 
    comments.body, comments.createdAt, users.nickName,comments.comment_id,users.avatar
    FROM
    comments
        JOIN
    users ON comments.user_id = users.user_id
    WHERE comments.post_id=${postId}
    ORDER BY comments.createdAt DESC
`;
    const comments = await db.query(query);
    data.comments = comments;
    query = `SELECT likes.createdAt,users.nickName,users.avatar
    FROM likes join users
    ON likes.user_id = users.user_id
    WHERE likes.post_id=${postId};
    `;
    const likes = await db.query(query);
    data.likes = likes;
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};
exports.deletePost = async (req, res) => {
  const post_id = req.params.post_id;
  const user_id = req.user.user_id;
  try {
    // MAKE SURE THAT LOGGED USER IS AN AUTHOR OF THE POST
    let query = `SELECT * FROM posts where post_id=${post_id}`;
    const postToDelete = await db.query(query);
    if (postToDelete[0].user_id !== user_id)
      res.status(403).json({ error: "Logged user is not author of the post" });
    query = `DELETE FROM posts where post_id=${post_id}`;
    await db.query(query);
    return res.status(200).json({ post_id });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};
exports.addPost = async (req, res) => {
  const body = req.body.body;
  const user_id = req.user.user_id;
  const errors = validateAddPost(body);
  if (Object.keys(errors).length !== 0) return res.status(400).json(errors);
  try {
    let query = `INSERT INTO posts (user_id,body) VALUES (${user_id},'${body}')`;
    const insertedPostId = (await db.query(query)).insertId;
    query = `SELECT
    posts.body,
        posts.commentsCount,
        posts.likesCount,
        posts.createdAt,
        posts.post_id,
        users.nickName,
        users.avatar
    FROM
    posts
    JOIN
    users ON posts.user_id = users.user_id
    WHERE posts.post_id=${insertedPostId}`;
    const insertedPost = (await db.query(query))[0];
    return res.status(201).json(insertedPost);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};

exports.updatePost = async (req, res) => {
  const post_id = req.params.post_id;
  const body = req.body.body;
  const errors = validateAddPost(body);
  if (Object.keys(errors).length !== 0) return res.status(400).json(errors);
  try {
    let query = `SELECT * FROM posts where post_id=${post_id}`;
    const postsWithID = await db.query(query);
    if (postsWithID.length === 0)
      return res.status(404).json({ error: "Post not found" });
    query = `UPDATE posts SET body="${body}"
    WHERE post_id = ${post_id}`;
    await db.query(query);
    return res.status(200).json({ message: "comment body updated" });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};
