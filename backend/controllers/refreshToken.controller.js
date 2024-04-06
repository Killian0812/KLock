const JWT = require('jsonwebtoken');
var User = require('../models/user.model');
require('dotenv').config();

const handleRefreshToken = async (req, res) => {

    const cookies = req.cookies;

    if (!cookies?.jwt)
    {
        console.log("No JWT cookies")
        return res.status(401).send("No JWT cookies");
    }

    const refreshToken = cookies.jwt;

    // console.log(refreshToken);

    const existingUser = await User.findOne({ refreshToken: refreshToken });
    if (!existingUser)
    {
        console.log("Invalid refresh token")
        return res.status(401).send("Invalid refresh token");
    }

    // evaluate jwt 
    JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || existingUser.username !== decoded.username)
                return res.status(403).send("Token expired");
        
            const roles = existingUser.roles;
            const newAccessToken = JWT.sign(
                {
                    "UserInfo": {
                        "username": existingUser.username,
                        "roles": existingUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '8h' }
            );
            res.json({ username: existingUser.username, roles: roles, accessToken: newAccessToken });
        }
    );
}

module.exports = { handleRefreshToken }