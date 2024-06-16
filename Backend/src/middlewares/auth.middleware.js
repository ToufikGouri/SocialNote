import { ApiError } from "../utils/ApiError.js"
import asyncHandler from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        // return res.status(401).json(new ApiError(401, `req is ${req.cookies}`))


        if (!token) {
            return res.status(401).json(new ApiError(401, "Unauthorized request"))
        }

        // decoding the token through jwt
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        // getting the user details via decoded token's id 
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            return res.status(401).json(new ApiError(401, "Invalid Access Token"))
        }

        // adding the user in req now
        req.user = user
        next()

    } catch (error) {
        return res.status(401).json(new ApiError(401, error?.message || "Invalid Access Token"))
    }

})