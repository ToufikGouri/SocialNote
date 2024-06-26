import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    owner: {    // who liked
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    post: {     // the post user liked
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },

}, { timestamps: true })

export const Like = mongoose.model("Like", likeSchema)