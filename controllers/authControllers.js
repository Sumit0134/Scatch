const bcrypt = require("bcrypt");

const userModel = require("../models/user-model");

const generateToken = require("../utils/generateToken");

const registerUser = async (req, res) => {
    try {
        const validation = userModel.validateUser(req.body);
        if (validation.error) {
            req.flash("error", validation.error.details[0].message);

            return res.redirect("/");
        }

        let { fullName, email, password } = req.body;

        let user = await userModel.findOne({ email });
        if (user) {
            req.flash("error", "User with this email already exists.");

            return res.redirect("/");
        }

        bcrypt.genSalt(10, async (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) {
                    req.flash("error", err.message);

                    return res.redirect("/");
                }
                else {
                    let createdUser = await userModel.create({
                        fullName,
                        email,
                        password: hash,
                    });

                    let token = generateToken(createdUser);
                    res.cookie("token", token);

                    res.status(201).redirect("/shop");
                }
            })
        })

    } catch (err) {
        req.flash("error", err.message);

        return res.redirect("/");
    }
}

const loginUser = async (req, res) => {
    try {
        const validation = userModel.validateLogin(req.body);
        if (validation.error) {
            req.flash("error", validation.error.details[0].message);

            return res.redirect("/");
        }

        let { email, password } = req.body;

        let user = await userModel.findOne({ email });
        if (!user) {
            req.flash("error", "Email or Password is incorrect.");

            return res.redirect("/");
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                req.flash("error", err.message);

                return res.redirect("/");
            }

            if (result) {
                let token = generateToken(user);
                res.cookie("token", token);

                res.status(200).redirect("/shop");
            }
            else {
                req.flash("error", "Email or Password is incorrect.");

                return res.redirect("/");
            }
        })
    } catch (err) {
        req.flash("error", err.message);

        return res.redirect("/");
    }
}

const logoutUser=async (req, res)=>{
    res.cookie("token", "");

    res.status(200).redirect("/");
}

module.exports = { registerUser, loginUser, logoutUser };