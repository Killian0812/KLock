const JWT = require('jsonwebtoken');
var User = require('../models/user.model');
require('dotenv').config();

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt)
        return res.status(401).send("No JWT cookies");

    const refreshToken = cookies.jwt;

    // console.log(refreshToken);

    const existingUser = await User.findOne({ refreshToken: refreshToken });
    if (!existingUser)
        return res.status(403).send("Invalid refresh token");

    // evaluate jwt 
    JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || existingUser.username !== decoded.username)
                return res.status(403).send("Error verifying jwt");
            const newAccessToken = JWT.sign({ "username": existingUser.username },
                process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
            res.json({ accessToken: newAccessToken });
        }
    );
}

module.exports = { handleRefreshToken }