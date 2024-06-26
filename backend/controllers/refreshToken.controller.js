const JWT = require('jsonwebtoken');
var User = require('../models/user.model');
require('dotenv').config();

const handleRefreshToken = async (req, res) => {

    const cookies = req.cookies;

    if (!cookies?.jwt) {
        console.log("No JWT cookies")
        return res.status(401).send("No JWT cookies");
    }

    const refreshToken = cookies.jwt;
    const isMobile = cookies.isMobile;

    // console.log(refreshToken);

    let existingUser;
    if (!isMobile) {
        existingUser = await User.findOne({ refreshToken: refreshToken });
        if (!existingUser) {
            console.log("Invalid refresh token")
            return res.status(401).send("Invalid refresh token");
        }
    } else {
        existingUser = await User.findOne({ mobileRefreshToken: refreshToken });
        if (!existingUser) {
            console.log("Invalid refresh token")
            return res.status(401).send("Invalid refresh token");
        }
    }

    // evaluate jwt 
    JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err)
                return res.status(403).send("Token expired");
            else if (existingUser.username !== decoded.username)
                return res.status(401).send("Invalid refresh token");

            const username = existingUser.username;
            const fullname = existingUser.fullname;
            const email = existingUser.email;
            const roles = existingUser.roles;

            console.log(existingUser.email);

            const newAccessToken = JWT.sign(
                {
                    "UserInfo": {
                        "username": username,
                        "email": email,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '8h' }
            );

            return res.status(200).json({
                username: username, fullname: fullname, email: email,
                roles: roles, accessToken: newAccessToken
            });
        }
    );
}

module.exports = { handleRefreshToken }