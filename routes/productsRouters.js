const express = require("express");

const router = express.Router();

const productModel = require("../models/product-model");
const upload = require("../config/multer-config");

router.post("/create", upload.single("image"), async (req, res) => {
    if (!req.file) {
        req.flash("error", "Image is required or invalid image format");

        return res.redirect("/owners/admin");
    }

    let productData = {
        ...req.body,
        price: parseFloat(req.body.price),
        discount: parseFloat(req.body.discount) || 0,
        image: {
            data: req.file.buffer,
            contentType: req.file.mimetype,
        },
    };

    if (isNaN(productData.price) || productData.price <= 0) {
        req.flash("error", "Price must be a positive number");

        return res.redirect("/owners/admin");
    }

    if (isNaN(productData.discount) || productData.discount < 0) {
        req.flash("error", "Discount must be a positive number");

        return res.redirect("/owners/admin");
    }

    if (productData.discount > productData.price) {
        req.flash("error", "Discount cannot be greater than price");

        return res.redirect("/owners/admin");
    }

    if (productData.discount > 100) {
        req.flash("error", "Discount cannot be greater than 100");

        return res.redirect("/owners/admin");
    }

    try {
        const validation = productModel.validateProduct(productData);
        if (validation.error) {
            req.flash("error", validation.error.details[0].message);

            return res.redirect("/owners/admin");
        }

        let { productName, bgColor, panelColor, textColor, price, discount, image } = productData;

        let product = await productModel.findOne({ productName });
        if (product) {
            req.flash("error", "Product with this name already exists.");

            return res.redirect("/owners/admin");
        }

        let createdProduct = await productModel.create({
            productName,
            bgColor,
            panelColor,
            textColor,
            price,
            discount,
            image,
        });

        req.flash("success", "Product created successfully");

        return res.redirect("/owners/admin");
    } catch (err) {
        req.flash("error", err.message);

        return res.redirect("/owners/admin");
    }
})

module.exports = router;