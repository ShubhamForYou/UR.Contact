const cloudinary = require("cloudinary").v2;
const userModel = require("../model/user.model");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
// Function to upload image to cloudinary
const uploadToCloudinary = async (bufferFile) => {
  try {
    return await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { public_id: uuidv4(), resource_type: "image" },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      uploadStream.end(bufferFile);
    });
  } catch (err) {
    throw new Error("Cloudinary upload failed");
  }
};

// @desc user-signin
// @route POST /api/auth/signin
const signin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ err: "These fields are mandatory" });
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already registered" });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      name: name,
      email: email,
      password: hashPassword,
    });
    if (req.file) {
      try {
        const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
        user.profileImage = cloudinaryResult.secure_url;
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }
    await user.save();
    return res
      .status(201)
      .json({ msg: `${user.name} profile registered successfully`, user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: "server error" });
  }
};

// @desc user-login
// @route POST /api/auth/login

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ err: "Enter Email and Password to Login" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ err: "User not registered Signin First" });
    }
    if (await bcrypt.compare(password, user.password)) {
      const token = await jwt.sign(
        {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "2m" }
      );
      res.cookie("auth", token);
      return res
        .status(200)
        .json({ msg: `welcome ${user.name}`, token: token });
    } else {
      return res.status(401).json({ err: "Enter valid Email and Password" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: "server error" });
  }
};
// @desc user-logout
// @route GET /api/auth/logout
const logout = async (req, res) => {
  try {
    await res.clearCookie("auth");
    return res.status(200).json({ msg: "user log-out" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: "server error" });
  }
};

module.exports = { signin, login, logout };
