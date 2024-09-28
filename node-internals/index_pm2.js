const crypto = require("crypto");

const express = require("express");
const app = express();

app.get("/", (req, res, next) => {
  crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
    res.send("Hi There !");
  });
});

app.get("/fast", (req, res) => {
  res.send("This was fast");
});

app.listen(3000);

// pm2 commands :
// pm2 start index.js -i 0 : (the number of clusters will be
// the cpu logical cores )
// pm2 delete index.js
// pm2 list
// pm2 index
// pm2 monit
