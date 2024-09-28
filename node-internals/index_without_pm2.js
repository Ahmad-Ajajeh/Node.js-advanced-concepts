const cluster = require("cluster");
cluster.schedulingPolicy = cluster.SCHED_RR;

const crypto = require("crypto");

// is the file being executed in master mode ?
if (cluster.isMaster) {
  // Cause index.js to be executed again but
  // in child mode .
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
} else {
  // I am a child, act as a server and do nothing else .
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
}
