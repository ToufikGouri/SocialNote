import { Note } from "../models/notes.model.js"
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getNotesController = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user?._id).populate("notes")

    if (!user) {
        return res.status(400).json(new ApiError(400, "User not found"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user.notes, "Notes fetched successfully"))

})

const addNoteController = asyncHandler(async (req, res) => {

    const { title, description, time, urgency, favorite } = req.body

    const owner = req.user?._id

    if (!owner) {
        return res.status(400).json(new ApiError(400, "Please login first"))
    }

    const createdNote = await Note.create({
        title,
        description,
        time,
        urgency,
        favorite,
        owner
    })

    if (!createdNote) {
        return res.status(500).json(new ApiError(500, "Something went wrong while creating note"))
    }

    // if reached till here means note created successfully 
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $push: {
                notes: createdNote._id
            }
        },
        { new: true }
    )

    return res.status(200).json(
        new ApiResponse(200, createdNote, "Note created successfully")
    )

})

const updateNoteController = asyncHandler(async (req, res) => {

    const { title, description, time, urgency, favorite } = req.body

    const note = await Note.findByIdAndUpdate(
        req.body?._id,
        {
            $set: {
                title,
                description,
                time,
                urgency,
                favorite
            }
        },
        { new: true }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, note, "Account details updated successfully"))

})

const deleteNoteController = asyncHandler(async (req, res) => {

    const note = await Note.findById(req.params.id)

    if (!note) {
        return res.status(404).json(new ApiError(404, "Note not found"))
    }

    // remove the note
    await Note.findByIdAndDelete(req.params.id)

    // remove from the user's array
    await User.findByIdAndUpdate(
        note.owner,
        {
            $pull: {
                notes: req.params.id
            }
        },
        { new: true }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Note deleted successfully"))

})

export { getNotesController, addNoteController, updateNoteController, deleteNoteController }