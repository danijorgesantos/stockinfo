const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String
    },
    keywords: {
        type: String
    },
    description: {
        type: String
    },
    detailedDescription: {
        type: String
    },
    price: {
        type: String
    },
    mainPhoto1: {
        type: String,
        trim: true
    },
    mainPhoto2: {
        type: String,
        trim: true
    },
    mainPhoto3: {
        type: String,
        trim: true
    },
    mainPhoto4: {
        type: String,
        trim: true
    },
    mainPhoto5: {
        type: String,
        trim: true
    },
    mainPhoto6: {
        type: String,
        trim: true
    },
    date: {
            type: Date,
            default: Date.now
        }
    });

module.exports = Product = mongoose.model('products', ProductSchema);