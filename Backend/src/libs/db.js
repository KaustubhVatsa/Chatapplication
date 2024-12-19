import mongoose from "mongoose"

export const connectDB = async ()=>{
    try {
        const conn = mongoose.connect(process.env.MONGO_URI);
        console.log(`connected to database ${(await conn).connection.host}`)
    } catch (error) {
        console.log("Database connection error -- ", error);
    }
}