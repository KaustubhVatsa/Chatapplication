import express from "express";
import dotenv from "dotenv";
import authroutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"
import { connectDB } from "./libs/db.js";
import cookieParser from "cookie-parser"
import cors from "cors"
import { app, server } from "./libs/socket.js";
//middlewares
dotenv.config();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
//calling route
app.use("/api/auth",authroutes)
app.use("/api/message",messageRoutes)
server.listen(process.env.PORT ,()=>{
    console.log(`Server listening on Port :${process.env.PORT}`)
    connectDB();
})