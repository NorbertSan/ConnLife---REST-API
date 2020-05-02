const db = require("../config/database");
const { validateUserDetails } = require("../utils/validators");

exports.getUserDetails = async (req, res) => {
  const nickName = req.params.nickName;
  const data = {};
  try {
    //  GET USER DETAILS
    let query = `SELECT users.user_id,users.bio,users.website,users.avatar,users.nickName,users.firstName,users.lastName,users.createdAt 
    from users
    where users.nickName = '${nickName}'`;
    const usersWithID = await db.query(query);
    if (usersWithID.length === 0)
      return res.status(404).json({ general: "User not found" });
    data.userInfo = usersWithID[0];

    // GET USERS POSTS
    query = `select posts.post_id,posts.createdAt,posts.body,posts.likesCount,posts.commentsCount,users.nickName,users.avatar
    from posts join users
    on posts.user_id = users.user_id
    where posts.user_id = ${data.userInfo.user_id}
    order by posts.createdAt desc
    `;
    data.posts = await db.query(query);
    // GET USERS POSTS WHICH LIKE
    query = `select likes.like_id,posts.post_id,posts.body,posts.createdAt,users.nickName,posts.commentsCount,posts.likesCount,users.avatar from
    posts join likes
    on likes.post_id = posts.post_id
    join users
    on posts.user_id = users.user_id
    where likes.user_id=${data.userInfo.user_id}`;
    data.likes = await db.query(query);
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};
exports.getLoggedUserData = async (req, res) => {
  const nickName = req.user.nickName;
  const data = {};
  try {
    let query = `SELECT users.user_id,users.bio,users.website,users.avatar,users.nickName,users.firstName,users.lastName,users.createdAt 
    from users
    WHERE users.nickName = '${nickName}'`;
    data.userInfo = (await db.query(query))[0];

    query = `SELECT * FROM posts
    where posts.user_id = ${data.userInfo.user_id}
    ORDER BY posts.createdAt DESC
    `;
    data.posts = await db.query(query);
    query = `SELECT likes.like_id,posts.post_id,posts.body,posts.createdAt,users.nickName,posts.commentsCount,posts.likesCount
    FROM likes JOIN posts
    ON likes.post_id = posts.post_id
    JOIN users
    ON likes.user_id = users.user_id
    WHERE likes.user_id = ${data.userInfo.user_id}`;
    data.likes = await db.query(query);

    query = `SELECT * FROM comments WHERE comments.user_id = ${data.userInfo.user_id}`;
    data.comments = await db.query(query);

    query = `SELECT 
    notifications.notification_id,
    notifications.post_id,
    notifications.type,
    notifications.seen,
    notifications.createdAt,
    users.avatar,
    users.nickName AS sender
        FROM
    notifications
        JOIN
    users ON (notifications.sender = users.user_id)
        WHERE
    notifications.user_id = ${data.userInfo.user_id}
    ORDER BY notifications.createdAt DESC`;
    data.notifications = await db.query(query);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};
exports.updateUserDetails = async (req, res) => {
  const user_id = req.user.user_id;
  let detailsInfo = {
    website: req.body.website.includes("http")
      ? req.body.website.split("//")[1]
      : req.body.website,
    bio: req.body.bio,
  };
  const errors = validateUserDetails(detailsInfo);
  if (Object.keys(errors).length !== 0) return res.status(400).json(errors);
  try {
    let query = `UPDATE users SET bio='${detailsInfo.bio}', website='${detailsInfo.website}'
    WHERE user_id=${user_id}`;
    await db.query(query);
    return res
      .status(200)
      .json({ message: "User details updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};

exports.updateUserAvatar = async (req, res) => {
  const user_id = req.user.user_id;
  let avatar = req.body.avatar;
  try {
    let query = `UPDATE users SET avatar='${avatar}'
    WHERE user_id=${user_id}`;
    await db.query(query);
    return res
      .status(200)
      .json({ message: "User avatar updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};
