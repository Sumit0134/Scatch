const express=require("express");

const router=express.Router();

const isLoggedIn=require("../middlewares/isLoggedIn");

const productModel=require("../models/product-model");

router.get("/", (req, res)=>{
    let error=req.flash("error");

    res.render("index", {error, logged: false});
})

router.get("/shop", isLoggedIn, async (req, res)=>{
    let products=await productModel.find();

    res.render("shop", {products});
})

router.get("/logout", (req, res)=>{
    res.cookie("token", "");

    res.status(200).redirect("/");
});

module.exports=router;