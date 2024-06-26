import mongoose from "mongoose";

const saveSchema = new mongoose.Schema({
    owner: {    // who saved
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    post: {     // the post user saved
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },

}, { timestamps: true })

export const Save = mongoose.model("Save", saveSchema)