const bcrypt = require('bcrypt');
const router = require('express').Router();
let User = require('../models/user.model');

router.route('/').post(async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    console.log("Someone registering");

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        res.status(409).json("Username taken");
    }
    else {

        // Generate a salt
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                res.status(500).json("Error generating salt:" + err);
            }

            // Hash the password using the generated salt
            bcrypt.hash(password, salt, (err, hashedPassword) => {
                if (err) {
                    res.status(500).json("Error hashing password: " + err);
                }
                else {
                    console.log('Hashed Password:', hashedPassword);

                    const newUser = new User({ username: username, password: hashedPassword });
                    newUser.save()
                        .then(() => res.status(200).json("Account registered"))
                        .catch(err => res.status(400).json(err));

                    // Example: Compare the hashed password with a provided password
                    // const providedPassword = 'mySecurePassword';
                    // bcrypt.compare(providedPassword, hash, (err, result) => {
                    //     if (err) {
                    //         console.error('Error comparing passwords:', err);
                    //         return;
                    //     }

                    //     console.log('Password Match:', result); // Should be true if passwords match
                    // });
                }
            });
        });
    }
});

module.exports = router;
