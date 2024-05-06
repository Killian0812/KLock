const User = require('../models/user.model');

const verifyActive = (req, res, next) => {
    const username = req.username;
    if (!username)
        return res.status(500).json({ error: 'Internal Server Error' });

    User.findOne({ username: username }).then(user => {
        if (!user.active) {
            return res.status(403).json({ error: 'Your account is blocked. Please contact the administrator.' });
        }
        else
            next();
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    })
}

module.exports = verifyActive;