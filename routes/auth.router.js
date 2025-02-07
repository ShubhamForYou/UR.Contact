const express = require("express");
const { signin, login, logout } = require("../controller/auth.controller");
const router = express.Router();
const uploader = require("../middleware/multer");

// @desc user-signin
// @route POST /api/auth/signin
router.post("/signin", uploader.single("profileImage"), signin);

// @desc user-login
// @route POST /api/auth/login

router.post("/login", login);
module.exports = router;

// @desc user-logout
// @route GET /api/auth/logout
router.get("/logout", logout);
