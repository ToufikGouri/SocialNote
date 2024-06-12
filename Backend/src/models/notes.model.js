import mongoose from "mongoose"

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    urgency: {
        type: String,
        required: true
    },
    favorite: {
        type: Boolean,
        required: true
    }


}, { timestamps: true })

export const Note = mongoose.model("Note", noteSchema)