const users = {
  user_id: "12",
  firstName: "aaa",
  lastName: "aaa",
  email: "test@gmail.com",
  bio: "null| blah blah",
  website: "null | http://google.com",
  password: "!@$#RFASD!RFWSA!RTsdghy34hfd!@",
  createdAt: "2020-04-18 11:46:40",
};

const posts = {
  post_id: "144",
  user_id: "12",
  body: "fafas9 asf9jg afsgsa",
  createdAt: "2020-04-18 11:46:40",
  likesCount: 12,
  commentsCount: 6,
};

const likes = {
  like_id: "1241",
  user_id: "12r",
  post_id: "12",
  createdAt: "2020-04-18 11:46:40",
};

const comments = {
  comment_id: "12rfas",
  post_id: "144",
  user_id: "12",
  body: "fafas9 asf9jg afsgsa",
  createdAt: "2020-04-18 11:46:40",
};

const notifications = {
  notification_id: "1241",
  user_id: "12",
  post_id: "11",
  type: "like|comment",
  comment_id: "12", // its not foreign key !
  like_id: "12", // its not foreign key !
  sender: "(user_id) e.g. 1243",
  seen: false | true,
  createdAt: "2020-04-18 11:46:40",
};

// USER DETAILS
const data = {
  userInfo: {
    nickName: "afasf2",
    firstName: "fasfsa",
    lastName: "afsfasf",
  },
  posts: [
    {
      body: "fafas9 asf9jg afsgsa",
      createdAt: "2020-04-18 11:46:40",
      likesCount: 12,
      commentsCount: 6,
    },
  ],
  likes: [
    {
      like_id: "1241",
      user_id: "12r",
      post_id: "12",
      createdAt: "2020-04-18 11:46:40",
    },
  ],
};
// POST DETAILS
const data = {
  comments: [
    {
      body: "fafas9 asf9jg afsgsa",
      createdAt: "2020-04-18 11:46:40",
      nickName: "nick99",
    },
  ],
  likes: {
    nickName: "nick99",
    createdAt: "2020-04-18 11:46:40",
  },
};
