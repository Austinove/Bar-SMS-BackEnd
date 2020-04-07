const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const auth = require("./middleware");

//Register user
router.post("/register", (req, res) => {
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

router.put("/password/:userId", auth, (req, res) => {
  const { password } = req.body;
  const userId = req.params.userId;
  if (!password) {
    return res.status(400).json({
      msg: "Password is required"
    });
  }
  User.findById(userId, (err, user) => {
    if (err) { throw err; }
    if (!user) {
      return res.status(400).json({
        msg: "User Not Found"
      });
    }


    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) { throw err; }
        var errors = "";
        var myquery = { _id: userId };
        var newPassword = { $set: { password: hash } };
        User.findByIdAndUpdate(myquery, newPassword, { new: true }, (err, user) => {
          if (err) {
            throw err
          }
          if (!user) {
            res.send({ response: "user not found", message: false });
          } else {
            res.status(200).json({ response: "user password changed", message: true });
          }
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