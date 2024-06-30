import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Like } from "../models/likes.model.js"
import { Comment } from "../models/comments.model.js"
import { Save } from "../models/save.model.js"
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const likeController = asyncHandler(async (req, res) => {

    const userId = req.user._id
    const { postId, isLiked } = req.body

    const existingLike = await Like.findOne({ owner: userId, post: postId })    // we aren't using $or because we want to match exact these params

    // if user liked the post
    if (isLiked) {

        if (existingLike) { // if like already exists
            return res.status(400).json(new ApiError(400, "Post liked already"))
        }

        // UPDATING THE LIKE
        // creating a new like instance
        const newLike = new Like({ owner: userId, post: postId })
        // saving the new like values in the database
        await newLike.save()

        // UPDATING THE POST
        const post = await Post.findByIdAndUpdate(
            postId,
            {
                $inc: { totalLikes: 1 },
                $push: { likes: newLike._id }
            },
            { new: true }
        )

        return res
            .status(200)
            .json(new ApiResponse(200, post, "Post liked successfully"))
    } else {
        // if user removes like

        // if like doesn't exists
        if (!existingLike) {
            return res.status(400).json(new ApiError(400, "Post unliked already"))
        }

        // DELETING THE LIKE
        await Like.findByIdAndDelete(existingLike._id)

        // UPDATING THE POST
        const post = await Post.findByIdAndUpdate(
            postId,
            {
                $inc: { totalLikes: -1 },
                $pull: { likes: existingLike._id }
            },
            { new: true }
        )

        return res
            .status(200)
            .json(new ApiResponse(200, post, "Post unliked successfully"))
    }
})

const getLikeController = asyncHandler(async (req, res) => {

    const data = await Post.findById(req.params.id)
        .populate({
            path: "likes",
            populate: {
                path: "owner",
                select: "username avatar isVerified"
            }
        }).select("likes")

    if (!data) {
        return res.status(500).json(new ApiError(500, "Can't load likes"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, data, "Likes fetched successfully"))
})

const getCommentController = asyncHandler(async (req, res) => {

    const data = await Post.findById(req.params.id)
        .populate({
            path: "comments",
            populate: {
                path: "owner",
                select: "username avatar isVerified"
            }
        }).select("comments")

    if (!data) {
        return res.status(500).json(new ApiError(500, "Can't load comments"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, data, "Comments fetched successfully"))
})

const addCommentController = asyncHandler(async (req, res) => {

    const userId = req.user._id
    const { postId, content } = req.body

    if (!content) {
        return res.status(400).json(new ApiError(400, "Can not add comment without content"))
    }

    // creating a new comment instance
    const newComment = await Comment.create({
        content,
        owner: userId,
        post: postId
    })

    // UPDATING THE POST
    const post = await Post.findByIdAndUpdate(
        postId,
        {
            $inc: { totalComments: 1 },
            $push: { comments: newComment._id }
        },
        { new: true }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, { post, newComment }, "Comment added successfully"))
})

const deleteCommentController = asyncHandler(async (req, res) => {

    const commentId = req.params?.id
    const comment = await Comment.findById(commentId)

    if (!comment) {
        return res.status(400).json(new ApiError(400, "Comment not found"))
    }

    // DELETING THE COMMENT
    await Comment.findByIdAndDelete(commentId)

    // UPDATING THE POST
    await Post.findByIdAndUpdate(
        comment.post,     // getting the post id     
        {
            $inc: { totalComments: -1 },
            $pull: { comments: commentId }
        },
        { new: true }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Comment deleted successfully"))
})

const saveController = asyncHandler(async (req, res) => {

    const userId = req.user._id
    const { postId, isSaved } = req.body

    const existingSave = await Save.findOne({ owner: userId, post: postId })    // we aren't using $or because we want to match exact these params

    // if user saved the post
    if (isSaved) {

        if (existingSave) { // if already saved
            return res.status(400).json(new ApiError(400, "Post saved already"))
        }

        // UPDATING THE SAVE
        // creating a new save instance
        const newSave = new Save({ owner: userId, post: postId })
        // saving the new save values in the database
        await newSave.save()

        // UPDATING THE USER'S SAVED POSTS
        await User.findByIdAndUpdate(
            req.user?._id,
            {
                $push: { savedPosts: newSave._id }
            },
            { new: true }
        )

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Post saved successfully"))
    } else {
        // if user unsave

        // if save doesn't exists
        if (!existingSave) {
            return res.status(400).json(new ApiError(400, "Post unsaved already"))
        }

        // DELETING THE SAVE
        await Save.findByIdAndDelete(existingSave._id)

        // UPDATING THE USER'S SAVED POSTS
        await User.findByIdAndUpdate(
            req.user?._id,
            {
                $pull: { savedPosts: existingSave._id }
            },
            { new: true }
        )

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Post unsaved successfully"))
    }
})

export { likeController, getLikeController, getCommentController, addCommentController, deleteCommentController, saveController }