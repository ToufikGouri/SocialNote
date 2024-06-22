import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        trim: true
    },
    totalLikes: {
        type: Number,
        default: 0
    },
    totalComments: {
        type: Number,
        default: 0
    },
    owner: {        // will give the necessary details directly through req.user to save unncessary operation cost
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        username: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            required: true,
        },
    },

    // to get the like/comment by which user 
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Like"
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],

}, { timestamps: true })

// Indexes on fields like owner are useful when you frequently query posts by a specific user. For example, if you want to
// find all posts created by a particular user, having an index on the owner field will significantly speed up these queries.
postSchema.index({ owner: 1 })

export const Post = mongoose.model("Post", postSchema)