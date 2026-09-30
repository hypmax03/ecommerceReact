import bcrypt from "bcrypt"
import User from "../model/userSchema.js";


export const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({
            message: "User registered successfully",
            newUser
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};

export const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;
         const user=await User.findOne({email});

        if(!user){
            return res.status(404).json({
                message:"User not Found"
            })
        }
        const isMatch=await bcrypt.compare(
            password,
            user.password
            );
            res.status(200).json({
                message:"Login Successfull",
                user:{
                    id:user._id,
                    name:user.name,
                    email:user.email
                }
            });
    }
    catch(error){
        res.status(500).json({
            message:"Server error",
            error:error.message
        })
    }
}