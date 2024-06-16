import { Router } from "express"
import { loginController, logoutController, registerController } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(upload.single("avatar"), registerController)

router.route("/login").post(loginController)

// secured routes

router.route("/logout").post(verifyJWT, logoutController)

export default router