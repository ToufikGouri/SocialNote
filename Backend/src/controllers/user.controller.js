import asyncHandler from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import uploadOnCloudinary from "../utils/cloudinary.js"

const generateAccessAndRefreshToken = async (userId) => {
    try {

        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        // update the refresh token with the generated one
        user.refreshToken = refreshToken

        // now save the user
        await user.save({ validateBeforeSave: false })
        // to avoid for checking password field here unncesserily we use validateBeforeSave option

        return { accessToken, refreshToken }

    } catch (error) {
        throw new Error("Something went wrong while generating refresh and access token");
    }
}

const registerController = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body

    // checking if user already exists
    const existerUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existerUser) {
        return res.status(401).json(new ApiError(401, "User with username or email already exists"))
    }

    // if user has provided the avatar image
    const avatarLocalPath = req.file?.path
    let avatarURL;
    if (avatarLocalPath) {
        avatarURL = await uploadOnCloudinary(avatarLocalPath, "Users")
    }

    // creating user
    const user = await User.create({
        username, email, avatar: avatarURL, password
    })

    // checking if user created successfully and removing some fields
    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        return res.status(500).json(new ApiError(500, "Something went wrong while registering the user"))
    }

    // if reached till here means user created successfully
    // generating the tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(createdUser._id)

    // options for cookie-parser
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 30 * 60 * 60 * 24 * 1000
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200,
            { user: createdUser, accessToken, refreshToken },
            "User registered successfully")
        )
})

const loginController = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body

    if (!username && !email) {
        return res.status(400).json(new ApiError(400, "Username or email is required"))
    }

    if (!password) {
        return res.status(400).json(new ApiError(400, "Password is required"))
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        return res.status(400).json(new ApiError(400, "User does not exist"))
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        return res.status(400).json(new ApiError(400, "Invalid user credentials"))
    }

    // reached till here means the credentials are right so generate the tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id)
        .select("-password -refreshToken")

    // options for cookie-parser
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 30 * 60 * 60 * 24 * 1000
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200,
            { user: loggedInUser, accessToken, refreshToken },
            "User logged in successfully")
        )

})

const logoutController = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    // options for cookie-parser
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"))

})

const getUserController = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user?._id)

    if (!user) {
        return res.status(404).json(new ApiError(404, "User not found"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User details fetched successfully"))

})

const followController = asyncHandler(async (req, res) => {

    // followTo -> target profile, currentUser -> user profile, isFollow -> Boolean

    const { isFollow, followTo } = req.body
    const currentUser = req.user._id

    const existingFollow = await User.findOne({ _id: currentUser, following: followTo })

    if (isFollow) {
        // user wants to follow

        if (existingFollow) {
            return res.status(400).json(new ApiError(400, "Profile already following"))
        }

        // updating current user's following list
        await User.findByIdAndUpdate(currentUser, { $push: { following: followTo } })

        // updating targeted user's followers list
        await User.findByIdAndUpdate(followTo, { $push: { followers: currentUser } })

        return res.status(200)
            .json(new ApiResponse(200, {}, "Profile followed successfully"))

    } else {
        // user wants to unfollow

        if (!existingFollow) {
            return res.status(400).json(new ApiError(400, "Profile already not following"))
        }

        // updating current user's following list
        await User.findByIdAndUpdate(currentUser, { $pull: { following: followTo } })

        // updating targeted user's followers list
        await User.findByIdAndUpdate(followTo, { $pull: { followers: currentUser } })

        return res.status(200)
            .json(new ApiResponse(200, {}, "Profile unfollowed successfully"))
    }// if else ends here

})

const getFollowingController = asyncHandler(async (req, res) => {

    const userId = req.params.id

    const userFollowing = await User.findById(userId)
        .populate({
            path: "following",
            select: "_id username avatar isVerified"
        })
        .select("following")

    // we'll get following even if they are 0, and if not found means the user itself not exist
    if (!userFollowing) {
        return res.status(400).json(new ApiError(400, "User not found"))
    }

    return res.status(200).json(
        new ApiResponse(200, userFollowing, "User following fetched successfully")
    )
})

const getFollowersController = asyncHandler(async (req, res) => {

    const userId = req.params.id

    const userFollowers = await User.findById(userId)
        .populate({
            path: "followers",
            select: "_id username avatar isVerified"
        })
        .select("followers")

    // we'll get followers even if they are 0, and if not found means the user itself not exist
    if (!userFollowers) {
        return res.status(400).json(new ApiError(400, "User not found"))
    }

    return res.status(200).json(
        new ApiResponse(200, userFollowers, "User followers fetched successfully")
    )
})


export {
    registerController,
    loginController,
    logoutController,
    getUserController,
    followController,
    getFollowingController,
    getFollowersController
}