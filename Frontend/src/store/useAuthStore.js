import { create } from "zustand";
import { axiosInstance } from "../Lib/axiosInstance.js";
import toast from "react-hot-toast";
import {io} from "socket.io-client";


const BASE_URL = import.meta.env.MODE==="developement"? "http://localhost:5002":"/"
export const useAuthStore = create((set ,get)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers:[],
    socket:null,

    //whenever we reload we want to check if the user is authenticated or not . so is checkingAuth is true.. we will call the backend with Url: /api/profile which has the protected route to check auth.
    checkAuth: async()=>{
        try {
            const res = await axiosInstance.get("/auth/profile");
            set({authUser:res.data});
            get().connectSocket();
        } catch (error) {
            console.log("Error in checkAuth authStore frontend",error);
            set({authUser:null})
        }finally{
            set({isCheckingAuth:false})
        }
    },
    signup:async(data)=>{
        set({isSigningUp:true})
        try {
            const res = await axiosInstance.post("/auth/signup",data);
            set({authUser:res.data});
            toast.success("Account Created Successfully");
            get().connectSocket();
        } catch (error) {
            console.log("Error in signup frontend");
            toast.error(error.response.data.message);
        }finally{
            set({isSigningUp:false});
        }
    },
    logout:async()=>{
        try {
            axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logged Ouut Successfully");
            get().disconnectSocket();
        } catch (error) {
            console.log("Error in logout forntend",error.message);
            toast.error(error.response.data.message);
        }
    },
    login:async(data)=>{
        set({isLoggingIn:true})
        try {
            const res = await axiosInstance.post("/auth/login",data);
            set({authUser:res.data});
            toast.success("Logged in Successfully");

            get().connectSocket();
        } catch (error) {
            console.log("Error in login frontend",error.message);
            toast.error(error.response.data.message);
        }finally{
            set({isLoggingIn:false})
        }
    },
    updateProfile:async(data)=>{
        set({isUpdatingProfile:true});
        try {
            const res = await axiosInstance.put("/auth/updateProfile",data);
            set({authUser:res.data})
            toast.success("Profile Photo Updated");
        } catch (error) {
            console.log("error in updateProfile",error.message);
            toast.error(error.response.data.message)
        }finally{
            set({isUpdatingProfile:false})
        }
    },
    connectSocket:()=>{
        const {authUser} = get();
        if(!authUser||get().socket?.connected){
            return ;
        }
        const socket = io(BASE_URL,{
            query:{
                userId:authUser._id,
            }
        })
        socket.connect();
        set({socket:socket})
        socket.on("getOnlineUsers",(userIds)=>{
            set({onlineUsers:userIds})
        })

    },
    disconnectSocket:()=>{
        if(get().socket?.connected){
            get().socket.disconnect();
        }
    },
}))