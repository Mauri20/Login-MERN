//MERN- MongoDB, Express, React, Node

// Importing the express module
const express = require("express");

// Creating an express app
const app = express();

// Importing the mongoose module
const mongoose = require("mongoose");

// Importing the CORS module
const cors = require("cors");

// Importing mongoose models
const User = require("./models/user.model");

// Importing jsonwebtoken module
const jwt = require("jsonwebtoken");

// Importing bcrypt module
const bcrypt = require("bcryptjs");

// Middleware
app.use(cors());
app.use(express.json());

// Connecting to the database

////routes
app.get("/hello", (req, res) => {
  res.send("Hello World");
});
// route to create a new user
app.post("/api/saveUser", async (req, res) => {
  console.log(req.body);
  try {
    const newPass = await bcrypt.hash(req.body.password, 10);
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: newPass,
    }).then((user) => {
      res.status(200).json({ user, status: "ok" });
      console.log("User created successfully");
    });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "Invalid data or Duplicated Email" });
  }
});

//route to get one user
app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    return res.json({ status: "error", error: "User not found" });
  }
  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (isPasswordValid) {
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      "secret"
    );
    res.json({ status: "ok", token: token });

    console.log("Login Successful");
  } else {
    res.json({ status: "error", error: "User not found" });
  }
});

// creating a new route to populate quotes
app.get("/api/populateQuotes", async (req, res) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    res.json({ status: "error", error: "No token provided" });
  } else {
    try {
      const decoded = jwt.verify(token, "secret");
      const user = await User.findOne({
        email: decoded.email,
      });
      if (user) {
        res.json({ status: "ok", quotes: user.quote });
      } else {
        res.json({ status: "error", error: "User not found" });
      }
    } catch (error) {
      res.json({ status: "error", error: "Invalid token" });
    }
  }
});

// creating a new route to add quotes
app.post("/api/addQuotes", async (req, res) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    res.json({ status: "error", error: "No token provided" });
  } else {
    try {
      const decoded = jwt.verify(token, "secret");
      const user = await User.findOne({
        email: decoded.email,
      });
      if (user) {
        user.quote = req.body.quote;
        await user.save();
        res.json({ status: "ok", quotes: user.quote });
      } else {
        res.json({ status: "error", error: "User not found" });
      }
    } catch (error) {
      res.json({ status: "error", error: "Invalid token" });
    }
  }
});

// Listening to the server
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
