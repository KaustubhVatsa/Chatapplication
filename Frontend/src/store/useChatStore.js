import {create} from "zustand"
import { axiosInstance } from "../Lib/axiosInstance"
import toast from "react-hot-toast"
import { useAuthStore } from "./useAuthStore";


export const useChatStore = create((set,get)=>({
    messages:[],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading:false,

    getUsers: async()=>{
        set({isUserLoading:true});
        try {
            const res = await axiosInstance.get("/message/contactList");
            set({users: res.data})
        } catch (error) {
            console.log("error in getting users",error.message)
            toast.error(error.response.data.message);
        }finally{
            set({isUserLoading:false});
        }
    },
    getMessages: async(userId)=>{
        set({isMessageLoading:true});
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            set({messages:res.data});
        } catch (error) {
            console.log("error in getting message",error.message)
            toast.error(error.response.data.message);
        }finally{
            set({isMessageLoading:false});
        }
    },
    sendMessage: async(messageData)=>{
        const {selectedUser ,messages} = get();
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`,messageData);
            set({messages:[...messages,res.data]});
        } catch (error) {
            console.log("error in sending message",error.message)
            toast.error(error.response.data.message);
        }
    },
    subscribeToMessages:()=>{
        const { selectedUser} = get()
        if(!selectedUser) return;
        const socket = useAuthStore.getState().socket;

        socket.on("newMessage",(newMessage)=>{
            if(newMessage.senderId!==selectedUser._id) return;
            set({
                messages: [...get().messages, newMessage],
            })
        })
    },
    unsubscribeFromMessages:()=>{
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage")
    },
    //todo :optimise later
    setSelectedUser: (selectedUser)=> set({selectedUser}),
}))
