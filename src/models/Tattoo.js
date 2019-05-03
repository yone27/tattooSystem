const mongoose = require('mongoose');
const { Schema } = mongoose;

const tattoSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    path: { type: String, required: true},
    originalname: { type: String },
    created_at: { type: Date, default: Date.now },
    cnt: {type:String}
})

module.exports = mongoose.model('Tattoo', tattoSchema)