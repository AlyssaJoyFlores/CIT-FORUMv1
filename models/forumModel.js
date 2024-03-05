const mongoose = require('mongoose');


const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    forum_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Forum"
    },
    comment: {
        type: String
    }
}, {
    timestamps: true
});


const forumSchema = mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    forumName: {
        type: String,
    },
    forumCategories: {
        type: String,
        enum: ['programming', 'networking', 'webdev', 'appdev', 'ai', 'general']
    },
    forumDescription: {
        type: String,
    },
    forumPublisher: {
        type: String
    },
    comments: [commentSchema]
}, {
    timestamps: true
})

module.exports = mongoose.model('Forum', forumSchema)