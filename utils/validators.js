const isEmail = (email) => {
  const exp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return exp.test(email);
};
const arePasswordsMatch = (passwd, confirmPasswd) => passwd === confirmPasswd;
const containMin6Chars = (passwd) => passwd.trim().length >= 6;
const isEmpty = (field) => field.trim().length === 0;
const isLongerThan1000Chars = (field) => field.length > 1000;
const isLongerThan500Chars = (field) => field.length > 500;
const isURL = (website) => {
  if (website.trim().length === 0) return true;
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(website);
};

module.exports.validateSignUp = (data) => {
  let errors = {};

  if (!isEmail(data.email)) errors.email = "Bad format";
  if (!arePasswordsMatch(data.password, data.confirmPassword))
    errors.password = "Passwords don't match";
  if (!containMin6Chars(data.password))
    errors.password = "Must have at least 6 chars";
  if (isEmpty(data.email)) errors.email = "Must not be empty";
  if (isEmpty(data.firstName)) errors.firstName = "Must not be empty";
  if (isEmpty(data.lastName)) errors.lastName = "Must not be empty";
  if (isEmpty(data.nickName)) errors.nickName = "Must not be empty";

  return errors;
};
module.exports.validateAddPost = (body) => {
  let errors = {};
  if (isEmpty(body)) errors.body = "Must not be empty";
  if (isLongerThan1000Chars(body))
    errors.body = `Max length equal 1000 chars, your text have ${body.length} chars `;

  return errors;
};
module.exports.validateAddComment = (body) => {
  let errors = {};
  if (isEmpty(body)) errors.body = "Must not be empty";
  if (isLongerThan500Chars(body))
    errors.body = `Max length equal 500 chars, your text have ${body.length} chars `;

  return errors;
};
module.exports.validateUserDetails = (details) => {
  let errors = {};

  if (!isURL(details.website)) errors.website = "Not valid URL";
  if (isLongerThan1000Chars(details.bio))
    errors.bio = `Max lenght equal 1000 chars,your text have ${details.bio.length} chars`;
  return errors;
};
