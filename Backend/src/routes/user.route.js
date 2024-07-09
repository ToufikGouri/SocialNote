import { Router } from "express"
import { followController, getFollowersController, getFollowingController, getUserController, loginController, logoutController, registerController, resetPasswordController, searchUserController, updateUserController } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(upload.single("avatar"), registerController)

router.route("/login").post(loginController)

// jwt shouldn't be applied user maybe logged out, route name is long and hard shouldn't be easily applicable to anyone
router.route("/resetuserpass").patch(resetPasswordController)

// secured routes

router.route("/logout").post(verifyJWT, logoutController)

router.route("/updateuser").patch(verifyJWT, upload.single("avatar"), updateUserController)

router.route("/").get(verifyJWT, getUserController)

router.route("/search").get(verifyJWT, searchUserController)

router.route("/follow").post(verifyJWT, followController)

router.route("/following/:id").get(verifyJWT, getFollowingController)

router.route("/followers/:id").get(verifyJWT, getFollowersController)

export default router