const userModel = require("../model/user.model");
const cloudinary = require("cloudinary").v2;
const { v4: uuidv4 } = require("uuid");
// Function to upload images to cloudinary
const uploadToCloudinary = async (bufferFile) => {
  try {
    return await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: uuidv4(),
          resource_type: "image",
        },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      uploadStream.end(bufferFile);
    });
  } catch (err) {
    throw new Error("Cloudinary upload failed");
  }
};
// @desc update-user
// @route PUT api/user/updateUser
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(404).json({ err: "User ID not Found" });
    }
    let user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ err: "User not Found" });
    }
    if (user.id !== req.user.id) {
      return res
        .status(401)
        .json({ err: "User can perform actions only to there profile" });
    }
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ err: "these are mandatory fields" });
    }
    let userData = { name, email };
    if (req.file) {
      try {
        const cloudinaryResult = await uploadToCloudinary(req.file.buffer);
        userData.profileImage = cloudinaryResult.secure_url;
      } catch (err) {
        return res.status(500).json({ err: err.message });
      }
    }
    user = await userModel.findByIdAndUpdate(userId, userData, { new: true });
    return res.status(200).json({ msg: "User update successfully", user });
  } catch (error) {
    return res.status(500).json({ err: "server error", detail: error.message });
  }
};
// @desc delete-user
// @route DELETE api/user/deleteUser
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(404).json({ err: "User not Found" });
    }
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ err: "User not Found" });
    }
    if (userId !== req.user.id) {
      return res
        .status(401)
        .json({ err: "User can apply actions to there profile" });
    }
    await userModel.findByIdAndDelete(userId);
    return res.status(200).json({ msg: `${user.name} deleted successfully` });
  } catch (error) {
    return res.status(500).json({ err: "server error", detail: error.message });
  }
};

module.exports = { updateUser, deleteUser };
