const express = require("express")
const path = require("path")
const router = express.Router()
const {
    registerAdministrator,
    loginAdministrator,
    logoutAdministrator,
    viewMyProfile
} = require(path.join(__dirname, "..", "controllers", "adminController.js"))
const { authMiddleware, isAdministrator } = require(path.join(__dirname, "..", "middlewares", "authMiddleware.js"))
router.post("/register-admin", registerAdministrator)
router.post("/login-admin", loginAdministrator)
router.get("/view-admin-profile", authMiddleware, isAdministrator, viewMyProfile)
router.get("/logout-admin", logoutAdministrator)
module.exports = router
