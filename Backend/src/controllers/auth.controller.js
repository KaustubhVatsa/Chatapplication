import { generateTokenandSendCookie } from "../libs/utils.js";
import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import cloudinary from "../libs/cloudinary.js";
export const signup = async(req,res)=>{
    const { fullname , email , password} = req.body;
    try {
        if (password.length<6){
            return res.status(400).json({success:false ,message:"Password shd be at least 6 characters"});
        }
        const user = await User.findOne({email});
        if(user){
            //user already exists
            return res.status(400).json({message:"User with this email already exists. Please Login!!"});
        }
        //if user doesnt exist.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const newUser = new User({
            fullname,
            email,
            password:hashedPassword
        })
        //generate a jwt token and send it
        if (newUser){
            generateTokenandSendCookie(newUser._id,res);
            await newUser.save();
            res.status(201).json({
                _id:newUser._id,
                fullname:newUser.fullname,
                email:newUser.email,
                ProfilePic:newUser.profilePic
            })
        }else {
            return res.status(400).json({success:false, message:"Invalid User Data"})
        }
    } catch (error) {
        console.log("Error in signup Controller ",error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}
export const login = async (req,res)=>{
    const {email , password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"No user found"})
        }
        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if (!isPasswordCorrect){
            //wrong password entered 
            return res.status(400).json({message:"No user found"})
        }
        generateTokenandSendCookie(user._id,res);
        res.status(201).json({
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            ProfilePic:user.profilePic
        })
    } catch (error) {
        console.log("Error in login Controller ",error.message)
        res.status(500).json({message:"Internal Server Error"})
    }
}
export const logout = (req, res) => {
    try {
        // Set the cookie with an expired date (set it to the past)
        res.cookie("jwt", "", {
            maxAge: 0, // Clear the cookie by setting maxAge to 0
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production", // Secure for production
            expires: new Date(0), // Expiry date in the past to remove the cookie
        });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateProfile = async(req, res)=>{
    try {
        const{ profilePic } = req.body;
        const userId = req.user._id;
        if(!profilePic){
            return res.status(400).json({message:"Profile pic required"});
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {profilePic:uploadResponse.secure_url},
            {new:true}
        );
        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in updated Profile controller ", error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const checkAuth = (req, res) => {
    try {
      res.status(200).json(req.user);
    } catch (error) {
      console.log("Error in checkAuth controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };