import asyncHandler from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerController = asyncHandler(async (req, res) => {

    const { username, email, avatar, password } = req.body

    // checking if user already exists
    const existerUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existerUser) {
        throw new ApiError(401, "User with username or email already exists")
    }

    // creating user
    const user = await User.create({
        username, email, avatar, password
    })

    // checking if user created successfully and removing some fields
    const createdUser = await User.findById(user._id).select("-password")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    // if reached till here means user created successfully
    return res.status(200).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

})

export { registerController }