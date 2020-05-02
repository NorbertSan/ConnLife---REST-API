const db = require("../config/database");
const { validateAddComment } = require("../utils/validators");

exports.addComment = async (req, res, next) => {
  const post_id = req.params.post_id;
  const user_id = req.user.user_id;
  const body = req.body.body;
  const errors = validateAddComment(body);
  if (Object.keys(errors).length !== 0) return res.status(400).json(errors);
  try {
    let query = `SELECT * FROM posts where post_id=${post_id}`;
    const post = await db.query(query);
    if (post.length === 0) {
      // POST DOESNT EXIST
      res.status(404).json({ error: "Post not found" });
    }
    query = `INSERT INTO comments (body,post_id,user_id) VALUES ('${body}',${post_id},${user_id})`;
    const insertedCommentId = (await db.query(query)).insertId;
    query = `SELECT 
        comments.body, comments.createdAt, users.nickName,comments.comment_id,users.avatar
        FROM
        comments
          JOIN
      users ON comments.user_id = users.user_id
      WHERE comments.comment_id=${insertedCommentId}`;
    const newComment = (await db.query(query))[0];
    query = `UPDATE posts SET commentsCount = commentsCount+1 WHERE post_id =${post_id}`;
    await db.query(query);
    req.comment_id = insertedCommentId;
    req.type = "comment";
    next();
    return res.status(200).json(newComment);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};
exports.deleteComment = async (req, res, next) => {
  const comment_id = req.params.comment_id;
  const user_id = req.user.user_id;
  try {
    // MAKE SURE THAT LOGGED USER IS AUTHOR OF DELETING COMMENT
    let query = `SELECT * FROM comments where comment_id=${comment_id}`;
    const commentToDelete = await db.query(query);
    if (commentToDelete.length === 0)
      return res.status(404).json({ error: "Comment not found" });
    if (commentToDelete[0].user_id !== user_id)
      return res
        .status(403)
        .json({ error: "Logged user is not author of the comment" });
    const post_id = commentToDelete[0].post_id;
    query = `DELETE FROM comments where comment_id=${comment_id}`;
    await db.query(query);
    query = `UPDATE posts SET commentsCount = commentsCount-1 WHERE post_id =${post_id}`;
    await db.query(query);
    req.type = "comment";
    req.comment_id = comment_id;
    next();
    return res.status(200).json({ message: "Comment deleted", comment_id });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};

exports.updateComment = async (req, res) => {
  const comment_id = req.params.comment_id;
  const body = req.body.body;
  const errors = validateAddComment(body);
  if (Object.keys(errors).length !== 0) return res.status(400).json(errors);
  try {
    let query = `SELECT * FROM comments where comment_id=${comment_id}`;
    const commentWithID = await db.query(query);
    if (commentWithID.length === 0)
      return res.status(404).json({ error: "Comment not found" });
    query = `UPDATE comments SET body="${body}"
    WHERE comment_id = ${comment_id}`;
    await db.query(query);
    return res.status(200).json({ message: "comment body updated" });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};
