import express from "express"
import cors from "cors"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// configs
app.use(express.json({ limit: "16kb" }))                            // configure data in json 
app.use(express.urlencoded({ extended: true, limit: "16kb" }))      // configure data in url form 
app.use(express.static("public"))                                   // configure to use static data like pdf,images etc.



// routes import
import userRouter from "./routes/user.route.js"

// routes declaration
app.use("/api/v1/users", userRouter)

export default app