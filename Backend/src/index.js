import dotenv from "dotenv"
import app from "./app.js";
import connectDB from "./db/index.js"

dotenv.config({
    path: './.env'
})

const port = process.env.PORT || 5000

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port: ${port} \nSite is live on https://socialnote.onrender.com`);
        })
    })
    .catch((error) => {
        console.log(`MongoDB connection failed`, error);
    })