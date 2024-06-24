import { Post } from "../models/post.model.js"

const getPostsWithUserInteractions = async (userId, matchCondtion = {}) => {
    return await Post.aggregate([
        { $match: matchCondtion },  // Match posts based on the provided condition, empty=blank, cond for eg specific user posts so
        {
            $lookup: {
                from: "likes",
                let: { postId: "$_id" },  // id of the current post
                pipeline: [
                    {
                        $match: {         // match will carry only those who satisfy condn.
                            $expr: {
                                $and: [
                                    { $eq: ["$owner", userId] }, { $eq: ["$post", "$$postId"] }      // true AND true will give true if matched right (eq-> equal, expr-> expression)
                                ]
                            }
                        }
                    }
                ],
                as: "matchedLikes"
            },
        },
        {
            $lookup: {
                from: "comments",
                let: { postId: "$_id" },  // id of the current post
                pipeline: [
                    {
                        $match: {         // match will carry only those who satisfy condn.
                            $expr: {
                                $and: [
                                    { $eq: ["$owner", userId] }, { $eq: ["$post", "$$postId"] }      // true AND true will give true if matched right (eq-> equal, expr-> expression)
                                ]
                            }
                        }
                    }
                ],
                as: "matchedComments"
            },
        },
        {
            $lookup: {
                from: "saves",
                let: { postId: "$_id" },  // id of the current post
                pipeline: [
                    {
                        $match: {         // match will carry only those who satisfy condn.
                            $expr: {
                                $and: [
                                    { $eq: ["$owner", userId] }, { $eq: ["$post", "$$postId"] }      // true AND true will give true if matched right (eq-> equal, expr-> expression)
                                ]
                            }
                        }
                    }
                ],
                as: "matchedSaves"
            },
        },
        {
            $addFields: {    // gt-> greater then, returns true if left value is gt right value
                isLiked: { $gt: [{ $size: "$matchedLikes" }, 0] },
                isCommented: { $gt: [{ $size: "$matchedComments" }, 0] },
                isSaved: { $gt: [{ $size: "$matchedSaves" }, 0] },
            }
        },
        {
            $project: {
                matchedLikes: 0,     // removing the field becuase we don't want it
                matchedComments: 0,
                matchedSaves: 0,
                likes: 0,
                comments: 0
            }
        }
    ])
}

export default getPostsWithUserInteractions