import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { addNoteController, deleteNoteController, getNotesController, updateNoteController } from "../controllers/notes.controller.js"

const router = Router()

router.use(verifyJWT)   // Apply verifyJWT middleware to all routes defined after this point

router.route("/").get(getNotesController)

router.route("/addnote").post(addNoteController)

router.route("/updatenote").patch(updateNoteController)

router.route("/deletenote/:id").delete(deleteNoteController)

export default router

