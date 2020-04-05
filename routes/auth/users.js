const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

//Register user
router.post("/", (req, res) => {
  const { username, password } = req.body;

  //undefined validation
  if (!username || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  //check for existing user
  User.findOne({ username }).then((user) => {
    if (user) {
      res.status(400).json({ msg: "User already exists" });
    }
    const newUser = new User({
      username,
      password,
    });

    //create salt and hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) {
          throw err;
        }
        newUser.password = hash;

        newUser.save().then((user) => {
          jwt.sign(
            { id: user.id },
            config.get("jwtSecret"),
            { expiresIn: 36000 },
            (err, token) => {
              if (err) {
                throw err;
              }
              res.json({
                token: token,
                user: {
                  id: user._id,
                  username: user.username,
                }
              });
            }
          );
        });
      });
    });
  });
});

router.get("/", (req, res) => {
    User.find().then(users => {
        res.json(users)
    });
});

module.exports = router;