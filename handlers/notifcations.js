const db = require("../config/database");

exports.addNotification = async (req, res) => {
  const post_id = req.params.post_id;
  const user_id_sender = req.user.user_id;
  const type = req.type;
  const comment_id = parseInt(req.comment_id);
  const like_id = parseInt(req.like_id);
  let field;
  if (type === "comment") field = "comment_id";
  else if (type === "like") field = "like_id";
  try {
    // TODO 1) FIND USER_ID WHO IS AUTHOR OF THE POST 2) INSERT INTO NOTIFICATIONS
    let query = `SELECT posts.user_id FROM posts where posts.post_id=${post_id}`;
    const user_id_recipient = (await db.query(query))[0].user_id;
    // prevent create notification from yourself
    if (user_id_recipient !== user_id_sender) {
      query = `INSERT INTO notifications (user_id,type,post_id,sender,${field})
      VALUES (${user_id_recipient},'${type}',${post_id},${user_id_sender},${
        comment_id || like_id
      })`;
      await db.query(query);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};
exports.deleteNotification = async (req, res) => {
  const comment_id = req.comment_id;
  const like_id = req.like_id;
  const type = req.type;
  let field;
  if (type === "comment") field = "comment_id";
  else if (type === "like") field = "like_id";
  try {
    let query = `DELETE FROM notifications where ${field}=${
      comment_id || like_id
    }`;
    await db.query(query);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};

exports.markReadNotification = async (req, res) => {
  const notification_id = req.params.notification_id;
  try {
    let query = `UPDATE notifications SET seen=true
    WHERE notification_id = ${notification_id}`;
    await db.query(query);
    return res.status(200).json({ message: `notification mark as read` });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};
