import express from "express";
import dotenv from "dotenv";
import authroutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"
import { connectDB } from "./libs/db.js";
import cookieParser from "cookie-parser"
import cors from "cors"
import { app, server } from "./libs/socket.js";

import path from "path"
//middlewares
dotenv.config();
const __dirname = path.resolve();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(
    cors({
      origin: (origin, callback) => {
        const allowedOrigins = ["http://localhost:5002", "http://localhost:5173"];
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })
  );
//calling route
app.use("/api/auth",authroutes)
app.use("/api/message",messageRoutes)

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../Frontend/dist")));

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../Frontend","dist","index.html"));
    })

}

server.listen(process.env.PORT ,()=>{
    console.log(`Server listening on Port :${process.env.PORT}`)
    connectDB();
})