const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("./middleware");
const config = require("config");
const User = require("../../models/User");


router.post("/", (req, res) => {
    //unidentified-validation
    if(!username || !password){
        return res.status(500).json({msg: "Please enter all fields"});
    }

    //check for existing user
    User.findOne({ username }).then(user => {
        if(!user) {
            return res.status(500).json({ msg: "User does not exist"});
        }

        //validate password
        bcrypt.compare(password, user.password).then(isMatch => {
            if(!isMatch){
                return res.status(500).json({ msg: "Invalid Credentials"});
            }

            jwt.sign(
                { id: user.id },
                config.get("jwtSecret"),
                { expiresIn: 36000 },
                (err, token)=>{
                    if(err){ throw err; }
                    res.json({
                        token: token,
                        user: {
                            id: user._id,
                            name: user.name
                        }
                    });
                }
            );
        });
    });
});

router.get("/", (req, res) => {
    User.find().then(users => {
        res.json(users)
    });
});

//private route
router.get("/user", auth, (req, res) => {
    User.findById(req.user.id)
    .Selection("-password")
    .then(user => res.json(user));
});

module.exports = router;