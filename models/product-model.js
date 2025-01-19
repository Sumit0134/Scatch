const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    productName: String,
    bgColor: String,
    panelColor: String,
    textColor: String,
    price: Number,
    dicount: {
        type: Number,
        default: 0,
    },
    image: String,
}); 

module.exports = mongoose.model("product", productSchema);