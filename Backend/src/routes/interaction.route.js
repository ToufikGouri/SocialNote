import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { addCommentController, deleteCommentController, getCommentController, getLikeController, likeController, saveController } from "../controllers/interaction.controller.js"

const router = Router()

router.use(verifyJWT)   // Apply verifyJWT middleware to all routes defined after this point

router.route("/like").post(likeController)

router.route("/getlike/:id").get(getLikeController)

router.route("/getcomment/:id").get(getCommentController)

router.route("/addcomment").post(addCommentController)

router.route("/deletecomment/:id").delete(deleteCommentController)

router.route("/save").post(saveController)

export default router
