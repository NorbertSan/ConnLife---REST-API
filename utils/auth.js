const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validateSignUp } = require("../utils/validators");

exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ message: "Request without authorization header" });
  else {
    try {
      const user = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (user.exp * 1000 < Date.now())
        return res.status(403).json({ error: "Token expired" });
      req.user = user;
      next();
    } catch (err) {
      console.error(err);
      res.status(403).json(err);
    }
  }
};
exports.login = async (req, res) => {
  const credentials = {
    email: req.body.email,
    password: req.body.password,
  };
  try {
    let query = `SELECT * FROM users WHERE email='${credentials.email}'`;
    const usersWithProvidedEmail = await db.query(query);
    if (usersWithProvidedEmail.length === 0)
      return res
        .status(404)
        .json({ general: "Provided user with that email doesnt exist" });
    const auth = await bcrypt.compare(
      credentials.password,
      usersWithProvidedEmail[0].password
    );
    if (!auth) return res.status(404).json({ general: "Wrong credentials" });
    credentials.nickName = usersWithProvidedEmail[0].nickName;
    credentials.user_id = usersWithProvidedEmail[0].user_id;
    credentials.password = "******";
    const accessToken = jwt.sign(credentials, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "60m",
    });
    return res.status(200).json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};
exports.signUp = async (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    firstName: req.body.firstName,
    nickName: req.body.nickName,
    lastName: req.body.lastName,
  };
  const errors = validateSignUp(newUser);
  if (Object.keys(errors).length !== 0) return res.status(400).json(errors);
  else {
    try {
      let query = `SELECT * FROM USERS WHERE users.EMAIL = '${newUser.email}'`;

      const usersWithSameEmail = await db.query(query);
      if (usersWithSameEmail.length > 0)
        return res.status(404).json({ email: "Provided email is taken" });

      query = `SELECT * FROM USERS WHERE users.NICKNAME = '${newUser.nickName}'`;
      const usersWithSameNickname = await db.query(query);

      if (usersWithSameNickname.length > 0)
        return res.status(404).json({ nickName: "Provided nickName is taken" });
      const hashedPassword = await bcrypt.hash(newUser.password, 10);

      query = `INSERT INTO users (firstName,lastName,email,password,nickName)
      VALUES ('${newUser.firstName}','${newUser.lastName}','${newUser.email}','${hashedPassword}','${newUser.nickName}')`;

      await db.query(query);
      res.status(201).json({ general: "account created successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  }
};
