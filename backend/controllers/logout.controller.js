var User = require('../models/user.model');

require('dotenv').config();

const handleLogout = async (req, res) => {

    console.log("Website logout");
    const cookies = req.cookies;
    if (!cookies?.jwt) // if no cookies (or jwts) => doesnt need to clear cookie
        return res.sendStatus(204);

    const refreshToken = cookies.jwt;

    // clearing user's refresh token in db since user logging out
    const existingUser = await User.findOne({ refreshToken: refreshToken });
    if (!existingUser) // ok if no user with specified token
    {
        // but still need to clear jwt cookies on client side
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
        return res.sendStatus(204);
    } else { // if user exists
        try {
            existingUser.refreshToken = null;
            await existingUser.save();
        } catch (error) {
            console.log(error);
            return res.status(500).send("Error removing user's refresh token");
        }
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
        return res.status(204).send("User's refresh token removed");
    }
}
const handleMobileLogout = async (req, res) => {

    console.log("Mobile logout");
    const refreshToken = req.body.refreshToken;
    if (!refreshToken)
        return res.sendStatus(204);

    // clearing user's refresh token in db since user logging out
    const existingUser = await User.findOne({ mobileRefreshToken: refreshToken });
    if (!existingUser) // ok if no user with specified token
    {
        return res.sendStatus(204);
    } else { // if user exists
        // console.log(existingUser);
        try {
            existingUser.mobileRefreshToken = null;
            await existingUser.save();
        } catch (error) {
            return res.status(500).send("Error removing user's refresh token");
        }
        return res.status(204).send("User's refresh token removed");
    }
}

module.exports = { handleLogout, handleMobileLogout }