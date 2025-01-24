const express = require("express");

const router = express.Router();

const isLoggedIn = require("../middlewares/isLoggedIn");

const productModel = require("../models/product-model");
const userModel = require("../models/user-model");

router.get("/", (req, res) => {
    let error = req.flash("error");

    res.render("index", { error, logged: false });
})

router.get("/shop", isLoggedIn, async (req, res) => {
    let products = await productModel.find();

    let success = req.flash("success");
    let error = req.flash("error");

    res.render("shop", { products, success, error });
})

router.get("/addtocart/:id", isLoggedIn, async (req, res) => {
    try {
        let product = await productModel.findOne({ _id: req.params.id });

        if (!product) {
            req.flash("error", "Product not found");

            return res.redirect("/shop");
        }

        let user = await userModel.findOne({ email: req.user.email });

        if (!user) {
            req.flash("error", "User not found");

            return res.redirect("/shop");
        }

        let cartProduct = user.cart.find(item => item.product.toString() === req.params.id);

        if (cartProduct) {
            cartProduct.quantity++;
        }
        else {
            user.cart.push({
                product: req.params.id,
                quantity: 1,
            });
        }

        await user.save();

        req.flash("success", "Product added to cart");

        res.status(200).redirect("/shop");
    } catch (err) {
        req.flash("error", err.message);

        res.status(500).redirect("/shop");
    }
})

router.get("/cart", isLoggedIn, async (req, res) => {
    let error = req.flash("error");
    let success = req.flash("success");

    try {
        let user = await userModel.findOne({ email: req.user.email }).populate("cart.product");

        if (!user) {
            req.flash("error", "User not found");

            return res.redirect("/shop");
        }

        if (user.cart.length === 0) {
            req.flash("error", "Cart is empty");

            return res.render("cart", { user, error, success });
        }

        res.render("cart", { user, error, success });
    } catch (err) {
        req.flash("error", err.message);

        res.status(500).redirect("/shop");
    }
})

router.get("/logout", (req, res) => {
    res.cookie("token", "");

    res.status(200).redirect("/");
});

module.exports = router;