const User = require('../models/User');
const UserSession = require('../models/UserSession');

const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const express = require('express');
const accountRouter = express.Router();

accountRouter.post('/signup', (req, res) => {
    const { username,
        password,
        confirmPassword } = req.body;
    let { email } = req.body;

    if (!username) {
        return res.status(400).send({
            success: false,
            message: 'Error: Username cannot be blank.'
        });
    }
    if (username.length > 25) {
        return res.status(400).send({
            success: false,
            message: 'Error: Username should be less than 25 characters'
        });
    }
    if (!email) {
        return res.status(400).send({
            success: false,
            message: 'Error: Email cannot be blank.'
        });
    }
    if (!password) {
        return res.status(400).send({
            success: false,
            message: 'Error: Password cannot be blank.'
        });
    }
    if (!confirmPassword || password !== confirmPassword) {
        return res.status(400).send({
            success: false,
            message: 'Error: Passwords must match.'
        });
    }
    email = email.toLowerCase();

    if (!email.endsWith('@nu.edu.kz')) {
        return res.status(400).send({
            success: false,
            message: 'Error: Provide a valid university email'
        });
    }

    if (password.length < 8) {
        return res.status(400).send({
            success: false,
            message: 'Error: Password should contain at least 8 characters'
        });
    }

    User.find({ email }, (err, previousUsers) => {
        if (err) {
            return res.status(500).send({
                success: false,
                message: 'Error: Server error'
            });
        } else if (previousUsers.length > 0) {
            return res.status(400).send({
                success: false,
                message: 'Error: Email already exists'
            });
        }

        User.find({ username }, (err, previousUsers) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: 'Error: Server error'
                });
            } else if (previousUsers.length > 0) {
                return res.status(400).send({
                    success: false,
                    message: 'Error: Username already exists'
                });
            }
            const newUser = new User();

            newUser.email = email;
            newUser.username = username
            newUser.password = newUser.generateHash(password);
            newUser.save((err, user) => {
                if (err) {
                    return res.status(500).send({
                        success: false,
                        message: 'Error: Server error'
                    });
                }
                const token = jwt.sign({ email, password, username }, process.env.JWT_ACC_ACTIVATE, { expiresIn: '7d' });
                const transporter = nodemailer.createTransport({
                    service: 'Sendgrid',
                    auth: {
                        user: process.env.SENDGRID_USERNAME,
                        pass: process.env.SENDGRID_PASSWORD
                    }
                });
                const mailOptions = {
                    from: 'ev.psychologists@gmail.com',
                    to: user.email,
                    subject: 'Account Verification Token',
                    text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttps:\/\/' + 'ev-psychologists.com' + '\/signin\/' + token + '.\n'
                }
                transporter.sendMail(mailOptions, function (err) {
                    if (err) {
                        return res.status(500).send({
                            success: false,
                            message: 'Error: Mailing error'
                        });
                    }
                    return res.status(200).send({
                        success: true,
                        message: 'Verification email was sent to your email. Proceed to your email to continue your registration.'
                    });
                });
            });
        });
    });
});

accountRouter.post('/signin', (req, res, next) => {
    const { password } = req.body;
    let { email } = req.body;

    if (!email) {
        return res.status(400).send({
            success: false,
            message: 'Error: Email cannot be blank.'
        });
    }
    if (!password) {
        return res.status(400).send({
            success: false,
            message: 'Error: Password cannot be blank.'
        });
    }
    email = email.toLowerCase();

    User.find({ email }, (err, users) => {
        if (err) {
            return res.status(500).send({
                success: false,
                message: 'Error: Server error'
            });
        }
        if (users.length != 1) {
            return res.status(400).send({
                success: false,
                message: 'Error: Invalid username or password'
            });
        }

        const user = users[0];
        if (!user.validPassword(password)) {
            return res.status(400).send({
                success: false,
                message: 'Error: Invalid username or password'
            });
        }

        if (!user.verified) {
            return res.status(400).send({
                success: false,
                message: 'Error: Confirm email'
            });
        }

        const userSession = new UserSession();
        userSession.userId = user._id;
        userSession.username = user.username;
        userSession.save((err, doc) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: 'Error: Server error'
                });
            }
            return res.status(200).send({
                success: true,
                message: 'Valid sign in',
                token: doc._id
            });
        });
    });
});

accountRouter.get('/verify', (req, res, next) => {
    const { token } = req.query;

    UserSession.find({
        _id: token,
        isDeleted: false
    }, (err, sessions) => {
        if (err) {
            return res.status(500).send({
                success: false,
                message: 'Error: Server error'
            });
        }
        if (sessions.length != 1) {
            return res.status(404).send({
                success: false,
                message: 'Error: Session not found'
            });
        }
        return res.status(200).send({
            success: true,
            username: sessions[0].username,
            message: 'Good'
        });
    });
});

accountRouter.get('/logout', (req, res, next) => {
    const { token } = req.query;

    UserSession.findOneAndUpdate({
        _id: token,
        isDeleted: false,
    }, { $set: { isDeleted: true } }, null, (err, sessions) => {
        if (err) {
            return res.status(500).send({
                success: false,
                message: 'Error: Server error'
            });
        }
        return res.status(200).send({
            success: true,
            message: 'Good'
        });
    });
});

accountRouter.post('/verify-email', (req, res, next) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).send({
            success: false,
            message: 'Token required'
        });
    }
    jwt.verify(token, process.env.JWT_ACC_ACTIVATE, function (err, decodedToken) {
        if (err) {
            return res.status(400).send({
                success: false,
                message: 'Incorrect or expired link'
            });
        }
        const { email, password } = decodedToken;
        User.findOne({ email: email }, function (err, user) {
            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: 'Unable to find a user for this token'
                });
            }
            if (user.verified) {
                return res.status(400).send({
                    success: false,
                    message: 'Already verified'
                });
            }
            user.verified = true;
            user.save(function (err) {
                if (err) {
                    return res.status(400).send({
                        success: false,
                        message: 'Server error'
                    });
                }
                res.status(200).send({
                    success: true,
                    message: 'User has been verified',
                    email: email,
                    password: password
                });
            });
        });
    });
});

accountRouter.put('/forgot-password', (req, res, next) => {
    const { email } = req.body;

    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(404).send({
                success: false,
                message: 'User with this email does not exist'
            });
        }
        const token = jwt.sign({ _id: user._id }, process.env.RESET_PASSWORD_KEY, { expiresIn: '7d' });
        const transporter = nodemailer.createTransport({
            service: 'Sendgrid',
            auth: {
                user: process.env.SENDGRID_USERNAME,
                pass: process.env.SENDGRID_PASSWORD
            }
        });
        const mailOptions = {
            from: 'ev.psychologists@gmail.com',
            to: user.email,
            subject: 'Reset password',
            text: 'Hello,\n\n' + 'Please click on the link to reset your password: \nhttps:\/\/' + 'ev-psychologists.com' + '\/forgot-password\/' + token + '.\n'
        }
        return user.updateOne({ resetLink: token }, function (err, success) {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: 'Reset password link error'
                });
            }
            transporter.sendMail(mailOptions, function (err) {
                if (err) {
                    return res.status(500).send({
                        success: false,
                        message: 'Error: Mailing error'
                    });
                }
                return res.status(200).send({
                    success: true,
                    message: 'Email has been sent, kindly follow the instructions.'
                });
            });
        });
    });
});

accountRouter.put('/reset-password', (req, res, next) => {
    const { resetLink, newPassword, confirmPassword } = req.body;
    if (!resetLink) {
        return res.status(400).send({
            success: false,
            message: 'Reset link required'
        });
    }
    if (!newPassword) {
        return res.status(400).send({
            success: false,
            message: 'Password required'
        });
    }
    if (!confirmPassword || newPassword !== confirmPassword) {
        return res.status(400).send({
            success: false,
            message: 'Passwords must match'
        });
    }
    if (newPassword.length < 8) {
        return res.status(400).send({
            success: false,
            message: 'Password should have at least 8 characters'
        });
    }
    jwt.verify(resetLink, process.env.RESET_PASSWORD_KEY, function (err, decodedData) {
        if (err) {
            return res.status(400).send({
                success: false,
                message: 'Incorrect or expired link'
            });
        }
        User.findOne({ resetLink }, (err, user) => {
            if (err || !user) {
                return res.status(404).send({
                    success: false,
                    message: 'User with the same link does not exist'
                });
            }
            const newUser = new User;
            const obj = {
                password: newUser.generateHash(newPassword),
                resetLink: ''
            };
            user = _.extend(user, obj);
            user.save((err, result) => {
                if (err) {
                    return res.status(400).send({
                        success: false,
                        message: 'Reset password error'
                    });
                }
                return res.status(200).send({
                    success: true,
                    message: 'Your password has been updated'
                });
            });
        });
    });
});

module.exports = accountRouter;