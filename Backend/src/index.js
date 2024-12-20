import express from "express";
import dotenv from "dotenv";
import authroutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"
import { connectDB } from "./libs/db.js";
import cookieParser from "cookie-parser"
//middlewares
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
//calling route
app.use("/api",authroutes)
app.use("/message",messageRoutes)
app.listen(process.env.PORT ,()=>{
    console.log(`Server listening on Port :${process.env.PORT}`)
    connectDB();
})