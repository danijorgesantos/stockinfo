const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DataSchema = new Schema({
    symbol: {
        type: String
    },
    bodyDB: {
        type: Object
    }
})

module.exports = Data = mongoose.model('Data', DataSchema);