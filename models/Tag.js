const mongoose = require('mongoose');

const tagsSchema = mongoose.Schema({
    categoryName: String,
    category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }]
})

module.exports = mongoose.model('Tag', tagsSchema)