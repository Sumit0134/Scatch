const mongoose = require("mongoose");

const joi = require("joi");

const userSchema = mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    contact: String,
    cart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
        },
        quantity: {
            type: Number,
            default: 1,
        }
    }],
    orders: {
        type: Array,
        default: [],
    },
    picture: String,
});

const userJoiSchema = joi.object({
    fullName: joi.string().min(3).max(50).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(50).required(),
    contact: joi.string().min(10).max(15).optional(),
    cart: joi.array().items(joi.object({
        product: joi.string().required(),
        quantity: joi.number().default(1),
    })).optional(), 
    orders: joi.array().items(joi.string()).optional(),
    picture: joi.string().uri().optional(),
});

const loginJoiSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).max(50).required(),
});

userSchema.statics.validateUser = function (data) {
    return userJoiSchema.validate(data);
}

userSchema.statics.validateLogin = function (data) {
    return loginJoiSchema.validate(data);
}

module.exports = mongoose.model("user", userSchema);