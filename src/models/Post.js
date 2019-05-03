const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    summary: { type: String, required: true },
    path: { type: String, required: true},
    originalname: { type: String },
    created_at: { type: Date, default: Date.now },
    cnt: {type:String},
})

module.exports = mongoose.model('Post', postSchema)