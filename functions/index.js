const mysql = require("mysql");
const express = require("express");


const config = {
    host: "eu-cdbr-west-03.cleardb.net",
    user: "b6a63a654ccbae",
    password: "6a603111",
    database: "heroku_583e5ad957f54ab",
    port: "3306",
};

class Database {
    constructor(config) {
        this.connection = mysql.createConnection(config);
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

const app = express();

app.get("/", (req, res) => {
    res.status(200).json({ text: "home" });
});

app.get("/users", (req, res) => {
    db.query("SELECT * FROM users")
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.json(err);
        });
});


app.listen("3306", () => {
    console.log("server started on port 3306");
});

