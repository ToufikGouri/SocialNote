import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { addNoteController, deleteNoteController, getNotesController, updateNoteController } from "../controllers/notes.controller.js"

const router = Router()

router.route("/").get(verifyJWT, getNotesController)

router.route("/addnote").post(verifyJWT, addNoteController)

router.route("/updatenote").patch(verifyJWT, updateNoteController)

router.route("/deletenote/:id").delete(verifyJWT, deleteNoteController)

export default router

