import mongoose from "mongoose"

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.MONGODB_DB_NAME}`)
        console.log(`MongoDB connection successfull DB Host: ${connectionInstance.connection.host}`);

    } catch (error) {
        console.log("MongoDB connection error: ", error);
        process.exit(1)     // NodeJs function to exit process
    }
}

export default connectDB