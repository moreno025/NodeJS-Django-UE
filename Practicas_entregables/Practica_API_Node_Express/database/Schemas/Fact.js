const mongoose = require('mongoose');

const FactsSchema = new mongoose.Schema({
    number: {
        type: mongoose.SchemaTypes.Number,
        required: true,
        unique: true,
    },
    fact: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    createdAt: {
        type: mongoose.SchemaTypes.Date,
        required: true,
        default: new Date()
    }
})

module.exports = mongoose.model('facts', FactsSchema)
