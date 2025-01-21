const mongoose = require("mongoose");

const joi=require("joi");

const productSchema = mongoose.Schema({
    productName: String,
    bgColor: String,
    panelColor: String,
    textColor: String,
    price: Number,
    discount: {
        type: Number,
        default: 0,
    },
    image: {
        data: Buffer,
        contentType: String,
    },
});

const productJoiSchema=joi.object({
    productName: joi.string().min(3).max(50).required(),
    bgColor: joi.string().required(),
    panelColor: joi.string().required(),
    textColor: joi.string().required(),
    price: joi.number().min(1).max(10000).required(),
    discount: joi.number().min(0).max(100).optional(),
    image: joi.object({
        data: joi.binary().required(),
        contentType: joi.string().valid("image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp").required(),
    }).required(),
});

productSchema.statics.validateProduct=function(data){
    return productJoiSchema.validate(data)
}

module.exports = mongoose.model("product", productSchema);