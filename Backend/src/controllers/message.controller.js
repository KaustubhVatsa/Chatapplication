import User from "../models/user.models.js"
import Message from "../models/message.models.js"
import cloudinary from "../libs/cloudinary.js";

export const contactListforSidebar = async(req, res)=>{
    //get in all the contact for the current user
    try {
        const currentUser = req.user._id;
        const findallUsers = await User.find({_id:{$ne:currentUser}}).select("-password");
        res.status(200).json(findallUsers)
    } catch (error) {
        console.log("Error in contactListforsidebar controller ", error.message);
        res.status(500).json({error:"Internal Server Error"})
    }
}


export const getChatMessage = async(req, res)=>{
    try {
    //get the user id 
    const myId = req.user._id;
    //get the id of the other person
    //since its dynamic i.e present in params 
    const {id:otherPersonId} = req.params
    //applying filters
    const messages = await Message.find({
        $or:[
           {senderId : myId, receiverId : otherPersonId},
           {senderId : otherPersonId, receiverId : myId}
        ]
    })
    res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getChatMessage",error.message);
        res.status(500).json({message:"Internal Server Error"})
    }

}

export const sendMessage = async(req, res)=>{
    try {
        const { image , text } = req.body;
        const senderId = req.user._id;
        const { id : receiverId} = req.params;
    
        //handling image 
        let imageUrl;
        if (image){
            //upload the image into cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl,
        })
        await newMessage.save();

        // socket io functionality goes here
        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in sendMessage",error.message);
        res.status(500).json({message:"Internal Server Error"})   
    }
}