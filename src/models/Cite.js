const mongoose = require('mongoose');
const { Schema } = mongoose;

const citeSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    cnt: {type:String},
})

module.exports = mongoose.model('Cite', citeSchema)