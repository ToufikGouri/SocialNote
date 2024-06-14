import { Router } from "express"
import { loginController, registerController } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

router.route("/register").post(upload.single("avatar"), registerController)

router.route("/login").post(loginController)

export default router