const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Build helper func to generate the token
function generateAccessToken(id) {
    return jwt.sign({ id: id },
        process.env.TOKEN_SECRET,
        { expiresIn: parseInt(process.env.EXPIREDTIME) }); //Get time expired in .env files
}

// Login Logic
exports.login = (req, res) => {
    // Mongodb look up exactly 1 user by email
    User.findOne({
        email: req.body.email
    }).then(
        (user) => {
            // If no user then return User not found
            if (!user) {
                return res.status(401).json({
                    error: new Error('User not found!')
                })
            }

            // Using bcrypt to compare (validate) user pwd from user with user pwd hash found from DB
            bcrypt.compare(req.body.password, user.password).then(
                (valid) => {
                    if (!valid) {
                        return res.status(401).json({
                            error: 'Incorrect password!'
                        });
                    }
                    res.status(200).json({
                        message: 'Thing created successfully!',
                        userId: user._id,
                        token: generateAccessToken(user._id)
                    });
                }
            ).catch(
                (error) => {
                    res.status(500).json({
                        error: error
                    });
                }
            );
        }
    ).catch(
        (error) => {
            res.status(500).json({
                error: error
            });
        }
    );
};

exports.signUp = (req, res) => {
    console.log(req.body);
    // using bcrypt library to hash user pwd with 10
    bcrypt.hash(req.body.password, 10).then(
        (hash) => {
            const user = new User({
                email: req.body.email,
                password: hash   //Store the hash into user object pwd
            })

            // Make a call mongodb to save the user
            user.save().then(
                () => {
                    res.status(201).json({
                        message: 'Thing created successfully!'
                    });
                }
            ).catch(
                (error) => {
                    res.status(400).json({
                        error: "Duplicate User"
                    });
                }
            )
        }
    )

}
