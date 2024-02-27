const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const router = require('express').Router();
let User = require('../models/user.model');

router.route('/').post(async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    console.log("Someone loging in");

    const existingUser = await User.findOne({ username });
    if (!existingUser) {
        res.status(400).json("User Not Found");
    }
    else {
        try {
            const correctPassword = await bcrypt.compare(password, existingUser.password);
            if (correctPassword) {
                // create JWTs
                const accessToken = JWT.sign({ "username": existingUser.username },
                    process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
                const refreshToken = JWT.sign({ "username": existingUser.username },
                    process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

                // Saving refreshToken with current user
                // mongo here

                console.log(refreshToken);
                // sent refresh token as http cookie, last for 1d
                res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
                res.status(200).json({ accessToken });
            }
            else {
                res.status(400).json("Wrong Password");
            }
        } catch (error) {
            res.status(500).json("Error Authenticating User");
        }
    }
});

module.exports = router;
