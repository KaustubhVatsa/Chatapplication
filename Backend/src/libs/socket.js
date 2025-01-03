import {Server} from "socket.io"
import http from "http"
import express from "express"

const app = express();
const server = http.createServer(app);

const io = new Server(server , {
    cors:{
        origin:["http://localhost:5173"]
    }
});
//used to implement online users 
const userSocketMap = {}; // storing like key pair user_id and socketid

export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}
io.on("connection",(socket)=>{
    console.log("User Connected" , socket.id);

    const userId = socket.handshake.query.userId;
    if(userId) userSocketMap[userId] = socket.id

    //let everone know send events to all the clients
    io.emit("getOnlineUsers",Object.keys(userSocketMap));
    socket.on("disconnect",()=>{
        console.log("User disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    });
});
export { io , server , app }
