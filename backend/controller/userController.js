import bcrypt from "bcrypt";
import User from "../model/userSchema.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      newUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const isMatch = await bcrypt.compare(password, user.password);

    if (!user) {
      return res.status(404).json({
        message: "User not Found",
      });
    }
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }
    

    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" },
    );
    const refreshToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 15 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login Successfull",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getProfile=async(req,res)=>{
    res.status(200).json({
        message:"Profile Fetched",
        user:req.user,
    })
}
