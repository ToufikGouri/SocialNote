import asyncHandler from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import getPostsWithUserInteractions from "../utils/getPostsWithUserInteractions.js"

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

const updateUserController = asyncHandler(async (req, res) => {

    const { username, email, bio, oldPassword, newPassword } = req.body

    const user = await User.findById(req.user._id)

    if (!user) {
        return res.status(400).json(new ApiError(400, "User not found"))
    }

    // if user wants to change password, then check for it first
    if (oldPassword && newPassword) {
        const isPasswordValid = await user.isPasswordCorrect(oldPassword)

        if (!isPasswordValid) {
            return res.status(400).json(new ApiError(400, "Invalid old password"))
        }
        user.password = newPassword
    }

    // if user has provided the avatar image
    const avatarLocalPath = req.file?.path
    if (avatarLocalPath) {
        const avatarURL = await uploadOnCloudinary(avatarLocalPath, "Users")

        if (!avatarURL) {
            return res.status(500).json(new ApiError(500, "Failed to upload image"))
        }
        user.avatar = avatarURL
    }

    // now updating the user with details
    // as the newPassword and avatar is handled already above, only check for the username and email
    if (username) user.username = username
    if (email) user.email = email
    if (bio) user.bio = bio

    // Don't use findByIdAndUpdate here becuase the password requires to run for save hook and then it's hasing 
    // updating it like regular will update the password as it is without hashing it
    await user.save()

    // removing some fields 
    user.password = null
    user.refreshToken = null

    return res.status(200).json(
        new ApiResponse(200, user, "User details updated successfully")
    )

})

const resetPasswordController = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        return res.status(400).json(new ApiError(400, "User not found"))
    }

    // get the logic for if owner of account only try to reset password
    // till then it's only for admin

    // Don't use findByIdAndUpdate here becuase the password requires to run for save hook and then it's hasing 
    // updating it like regular will update the password as it is without hashing it
    user.password = password
    await user.save()

    // removing some fields
    user.password = null
    user.refreshToken = null

    return res.status(200).json(
        new ApiResponse(200, user, "Password reset successfully")
    )

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

const searchUserController = asyncHandler(async (req, res) => {

    const { searchUser, usernameOnly } = req.query // usernameOnly: Boolean

    // $regex: Specifies the regex pattern as a string.
    // The ^ anchor forces the match to start from the beginning of the string.
    // $options: Specifies regex options(flags) as a string, for eg i for case-insensitivity.(We don't actually need it here because we have already lowercase usernames, used just for knowledge)

    // If have to return usernames only
    if (usernameOnly) {
        const result = await User.find({ username: { $regex: `^${searchUser}`, $options: "i" } })

        if (result.length === 0) {
            return res.status(400).json(new ApiError(400, "User does not exist"))
        }

        // return only specific values only
        const allUsernames = result.map(val => { return { _id: val._id, username: val.username } })

        return res.status(200).json(
            new ApiResponse(200, allUsernames, "Usernames fetched successfully")
        )
    }

    // If have to return whole user data
    let user = await User.findOne({ username: searchUser })
        .populate({
            path: "following",
            select: "_id username avatar isVerified"
        })
        .populate({
            path: "followers",
            select: "_id username avatar isVerified"
        })

    if (!user) {
        return res.status(400).json(new ApiError(400, "User does not exist"))
    }

    const userPosts = (await getPostsWithUserInteractions(user._id, { "owner._id": user._id })).reverse()
    user = { ...user._doc, posts: userPosts }
    // we can't overwrite the posts directly because here we got the populated posts and in 
    // post model we storing them in _id, so they will be stored in _id form again because of mongoose 
    // so to avoid this use created a new plain object then overwrite the posts

    // removing some fields
    user.email = null
    user.email = null
    user.password = null
    user.refreshToken = null
    user.notes = null
    user.savedPosts = null

    return res.status(200).json(
        new ApiResponse(200, user, "User details fetched successfully")
    )

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
    updateUserController,
    resetPasswordController,
    getUserController,
    searchUserController,
    followController,
    getFollowingController,
    getFollowersController
}