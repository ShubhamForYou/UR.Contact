const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
router.use(verifyToken);
const { updateUser, deleteUser } = require("../controller/user.controllers");
const uploader = require("../middleware/multer");

// @desc update-user
// @route PUT api/user/updateUser
router.put("/:id", uploader.single("profileImage"), updateUser);
// @desc delete-user
// @route DELETE api/user/deleteUser
router.delete("/:id", deleteUser);
module.exports = router;
