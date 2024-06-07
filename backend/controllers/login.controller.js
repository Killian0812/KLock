const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const nodemailer = require('nodemailer');
var User = require('../models/user.model');

const handleLogin = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log("Website login");

    const existingUser = await User.findOne({ username });
    if (!existingUser) {
        return res.status(400).json("User Not Found");
    }
    else {
        if (!existingUser.active)
            return res.status(403).json({ error: 'Your account is blocked. Please contact the administrator.' });
        else
            try {
                const correctPassword = await bcrypt.compare(password, existingUser.password);
                if (correctPassword) {
                    // create JWTs
                    const accessToken = JWT.sign(
                        {
                            "UserInfo": {
                                "username": existingUser.username,
                                "email": existingUser.email,
                                "roles": existingUser.roles
                            }
                        },
                        process.env.ACCESS_TOKEN_SECRET,
                        { expiresIn: '8h' }
                    );
                    const refreshToken = JWT.sign(
                        { "username": existingUser.username },
                        process.env.REFRESH_TOKEN_SECRET,
                        { expiresIn: '7d' }
                    );

                    // Saving refreshToken with current user
                    try {
                        existingUser.refreshToken = refreshToken;
                        await existingUser.save();
                    } catch (error) {
                        console.log("Error saving refreshToken to DB");
                        console.log(error);
                    }

                    console.log("Login successful");
                    // sent refresh token as http cookie, last for 1d
                    res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
                    return res.status(200).json({
                        accessToken, fullname: existingUser.fullname,
                        email: existingUser.email, roles: existingUser.roles
                    });
                }
                else {
                    return res.status(400).json("Wrong Password");
                }
            } catch (error) {
                return res.status(500).json("Error Authenticating User");
            }
    }
}

const handleMobileLogin = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log("Mobile login");

    const existingUser = await User.findOne({ username });
    if (!existingUser) {
        res.status(400).json("User Not Found");
    }
    else {
        try {
            const correctPassword = await bcrypt.compare(password, existingUser.password);
            if (correctPassword) {
                // create JWTs
                const accessToken = JWT.sign(
                    {
                        "UserInfo": {
                            "username": existingUser.username,
                            "email": existingUser.email,
                            "roles": existingUser.roles
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '8h' }
                );
                const refreshToken = JWT.sign(
                    { "username": existingUser.username },
                    process.env.REFRESH_TOKEN_SECRET,
                    { expiresIn: '7d' }
                );

                // Saving refreshToken with current user
                try {
                    existingUser.mobileRefreshToken = refreshToken;
                    await existingUser.save();
                } catch (error) {
                    console.log("Error saving refreshToken to DB");
                }

                console.log("Login successful");
                // sent refresh token as http cookie, last for 1d
                res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
                res.cookie('isMobile', true, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
                
                res.status(200).json({
                    accessToken, fullname: existingUser.fullname,
                    email: existingUser.email, roles: existingUser.roles
                });
            }
            else {
                res.status(400).json("Wrong Password");
            }
        } catch (error) {
            res.status(500).json("Error Authenticating User");
        }
    }
}

const handleVerifyToken = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token || typeof token !== 'string') {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        JWT.verify(token, process.env.ACCESS_TOKEN_SECRET,
            (err, decoded) => {
                if (err) {
                    console.log(err);
                    return res.status(403).send("Error verifying JWTs");
                }
                // console.log(decoded);
                return res.status(200).json({
                    username: decoded.username,
                    email: decoded.email,
                });
            }
        );
    } catch (error) {
        // Handle errors
        console.error('Error processing forget password request:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const handleForget = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || typeof email !== 'string') {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        const user = await User.findOne({ email: email });
        if (!user)
            return res.status(400).json({ error: 'Email not registered' });

        // Generate a unique token with expiration time (e.g., 1 hour)
        const token = JWT.sign({ email, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

        // Construct the reset password URL with the token
        const resetPasswordUrl = `http://ngcuong0812.id.vn/reset-password?token=${token}`;

        // Send email containing the reset password link
        await sendResetPasswordEmail(email, resetPasswordUrl);

        // Return success response
        return res.status(200).json({ message: 'Forget password email sent successfully' });
    } catch (error) {
        // Handle errors
        console.error('Error processing forget password request:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const handleResetPassword = async (req, res) => {
    try {
        const { password, username } = req.body;
        console.log(username);

        const user = await User.findOne({ username: username });
        if (!user)
            return res.status(400).json({ error: 'User not registered' });

        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return res.status(500).json("Error generating salt:" + err);
            }

            // Hash the password using the generated salt
            bcrypt.hash(password, salt, (err, hashedPassword) => {
                if (err) {
                    return res.status(500).json("Error hashing password: " + err);
                }
                else {
                    // console.log('Hashed Password:', hashedPassword);

                    user.password = hashedPassword;
                    user.save()
                        .then(() => {
                            console.log("Registered");
                            return res.sendStatus(200);
                        })
                        .catch(err => {
                            console.log(err);
                            return res.sendStatus(500);
                        });
                }
            });
        });
    } catch (error) {
        // Handle errors
        console.error('Error processing forget password request:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const sendResetPasswordEmail = async (email, resetPasswordUrl) => {
    // Create a nodemailer transporter (replace with your email provider's settings)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'klockhust@gmail.com',
            pass: 'sapb cbfb ecvg fwok'
        }
    });

    // Define email options
    const mailOptions = {
        from: 'klockhust@gmail.com',
        to: email,
        subject: 'KLock | Reset Your Password',
        text: `Click the link below to reset your password:\n${resetPasswordUrl}`
    };

    // Send email
    await transporter.sendMail(mailOptions);
};

module.exports = { handleLogin, handleMobileLogin, handleForget, handleVerifyToken, handleResetPassword };