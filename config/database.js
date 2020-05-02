const mysql = require("mysql");
const config = {
  host: "eu-cdbr-west-03.cleardb.net",
  user: "b6a63a654ccbae",
  password: "6a603111",
  database: "heroku_583e5ad957f54ab",
};
class Database {
  constructor(config) {
    this.connection = mysql.createPool(config);
  }
  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
  close() {
    return new Promise((resolve, reject) => {
      this.connection.end((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}

db = new Database(config);

module.exports = db;
