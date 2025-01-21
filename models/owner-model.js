const mongoose = require("mongoose");

const joi=require("joi");

const ownerSchema = mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    product: {
        type: Array,
        default: [],
    },
    gstin: String,
    picture: String,
    role: {
        type: String,
        enum: ["owner", "admin"],
        default: "owner",
    },
});

const ownerJoiSchema=joi.object({
    fullName: joi.string().min(3).max(50).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(50).required(),
    product: joi.array().items(joi.string()).optional(),
    gstin: joi.string().length(15).optional(),
    picture: joi.string().uri().optional(),
    role: joi.string().valid("owner", "admin").default("owner"),
});

ownerSchema.statics.validateOwner=function(data){
    return ownerJoiSchema.validate(data);
};

module.exports = mongoose.model("owner", ownerSchema);