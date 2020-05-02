const db = require("../config/database");

module.exports.like = async (req, res, next) => {
  const post_id = parseInt(req.params.post_id);
  const user_id = req.user.user_id;
  try {
    let query = `SELECT * FROM likes WHERE (post_id , user_id) IN ((${post_id} , ${user_id}))`;
    const likes = await db.query(query);
    if (likes.length !== 0)
      return res.json({ error: "You already liked this post" });
    query = `INSERT INTO likes (user_id,post_id)
          values(${user_id},${post_id})`;
    const insertedLikeId = (await db.query(query)).insertId;
    query = `SELECT likes.createdAt,likes.like_id,likes.post_id,users.nickName,users.avatar
        FROM likes join users
        ON likes.user_id = users.user_id
        WHERE likes.like_id=${insertedLikeId}
        `;
    const newLike = (await db.query(query))[0];
    query = `UPDATE posts SET likesCount = likesCount+1 WHERE post_id =${post_id}`;
    await db.query(query);
    req.type = "like";
    req.like_id = insertedLikeId;
    next();
    return res.status(201).json({ message: "Post liked", newLike });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};

module.exports.unlike = async (req, res, next) => {
  const post_id = parseInt(req.params.post_id);
  const user_id = req.user.user_id;
  try {
    let query = `SELECT * FROM likes WHERE (post_id , user_id) IN ((${post_id} , ${user_id}))`;
    const likes = await db.query(query);
    if (likes.length === 0)
      return res.status(404).json({ error: "This post is not liked from you" });
    const like_id = likes[0].like_id;
    query = `DELETE FROM likes 
        WHERE (post_id , user_id) IN ((${post_id} , ${user_id}))`;
    await db.query(query);
    query = `UPDATE posts SET likesCount = likesCount-1 WHERE post_id =${post_id}`;
    await db.query(query);
    req.type = "like";
    req.like_id = like_id;
    next();
    return res.status(200).json({ message: "post unliked", like_id });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};
