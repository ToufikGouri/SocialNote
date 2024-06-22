import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addPostController, deletePostController, getAllPostsController, getUserPostsController, updatePostController } from "../controllers/posts.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.use(verifyJWT)   // Apply verifyJWT middleware to all routes defined after this point

router.route("/").get(getAllPostsController)

router.route('/userposts').get(getUserPostsController)

router.route("/addpost").post(upload.single("image"), addPostController)

router.route('/updatepost').patch(updatePostController)

router.route("/deletepost/:id").delete(deletePostController)

export default router