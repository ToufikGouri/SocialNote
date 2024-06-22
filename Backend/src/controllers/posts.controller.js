import asyncHandler from "../utils/asyncHandler.js";
import { Post } from "../models/post.model.js"
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const getAllPostsController = asyncHandler(async (req, res) => {

    // get all the posts by calling via Post schema and populate them
    // const posts = await Post.find()
    // .populate("owner", "username email")  // Populate owner field with username and email
    // .populate({
    //     path: "likes",
    //     populate: {
    //         path: "likedBy",
    //         select: "username"  // Populate likedBy field with username
    //     }
    // })
    // .populate({
    //     path: "comments",
    //     populate: {
    //         path: "owner",
    //         select: "username"  // Populate comments' owner field with username
    //     }
    // });

    const posts = await Post.find()

    if (!posts) {
        return res.status(500).json(new ApiError(500, "Error loading posts"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, posts, "Posts fetched successfully"))
})

const getUserPostsController = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user?._id).populate("posts")

    if (!user) {
        return res.status(400).json(new ApiError(400, "User not found"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user.posts, "Posts fetched successfully"))
})

const addPostController = asyncHandler(async (req, res) => {

    const { caption } = req.body
    const { _id, username, avatar } = req.user
    const imageLocalPath = req.file?.path

    if (!caption || !imageLocalPath) {
        return res.status(401).json(new ApiError(401, "Caption or Image is missing"))
    }

    // uploading on cloudinary
    const image = await uploadOnCloudinary(imageLocalPath, "Posts")

    if (!image) {
        return res.status(500).json(new ApiError(500, "Something went wrong while uploading the image"))
    }

    // creating post
    const createdPost = await Post.create({
        caption,
        image,
        owner: { _id, username, avatar }
    })

    if (!createdPost) {
        return res.status(500).json(new ApiError(500, "Something went wrong while creating the post"))
    }

    // if reached till here means post created successfully 
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $push: {
                posts: createdPost._id
            }
        },
        { new: true }
    )

    return res.status(200).json(
        new ApiResponse(200, createdPost, "Post created successfully")
    )

})

const updatePostController = asyncHandler(async (req, res) => {

    // get the required fields from the req.body
    // update them

    const { caption, _id } = req.body

    const post = await Post.findByIdAndUpdate(_id, {
        $set: {
            caption
        },
    },
        { new: true }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, post, "Post updated successfully"))
})

const deletePostController = asyncHandler(async (req, res) => {

    const post = await Post.findById(req.params.id)

    if (!post) {
        return res.status(404).json(new ApiError(404, "Post not found"))
    }

    // remove the post    
    await Post.findByIdAndDelete(req.params.id)

    await User.findByIdAndUpdate(
        post.owner._id,
        {
            $pull: {
                posts: req.params.id
            }
        },
        { new: true }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Post deleted successfully"))

})

export {
    getAllPostsController,
    getUserPostsController,
    addPostController,
    updatePostController,
    deletePostController
}