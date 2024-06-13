import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        index: true             // index is used to make it bettwe accessible on search
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/duj7aqdfc/image/upload/v1718254501/Users/ljpp6sg94ehdlu1q54ju.jpg"
    },
    password: {
        type: String,
        required: true
    },
    notes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Note"
        }
    ],
    refreshToken: {
        type: String
    }


}, { timestamps: true })

export const User = mongoose.model("User", userSchema)