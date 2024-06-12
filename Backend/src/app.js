import express from "express"

const app = express()

// configs
app.use(express.json({ limit: "16kb" }))                            // configure data in json 
app.use(express.urlencoded({ extended: true, limit: "16kb" }))      // configure data in url form 
app.use(express.static("public"))                                   // configure to use static data like pdf,images etc.
 

app.get("/", (req, res) => {
    res.json({
        name: "Toufik Gouri",
        hobby: "coding"
    })
})

app.get("/check", (req, res) => {
    res.send("Check Done")
})


export default app