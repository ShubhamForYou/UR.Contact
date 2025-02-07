const express = require("express");
const { signin, login, logout } = require("../controller/auth.controller");
const router = express.Router();
const uploader = require("../middleware/multer");

// @desc user-signin
// @route POST /api/user/signin
router.post("/signin", uploader.single("profileImage"), signin);

// @desc user-login
// @route POST /api/user/login

router.post("/login", login);
module.exports = router;

// @desc user-logout
// @route GET /api/user/logout
router.get("/logout", logout);
