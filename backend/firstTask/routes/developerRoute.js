const express = require("express")
const path = require("path")
const router = express.Router()
const {
    registerDeveloper,
    loginDeveloper,
    logoutDeveloper,
    viewMyProfile,
    viewMyProjects
} = require(path.join(__dirname, "..", "controllers", "developerController.js"))
const { authMiddleware, isDeveloper } = require(path.join(__dirname, "..", "middlewares", "authMiddleware.js"))
router.post("/register-developer", registerDeveloper)
router.post("/login-developer", loginDeveloper)
router.get("/view-developer-profile", authMiddleware, isDeveloper, viewMyProfile)
router.get("/view-developer-projects", authMiddleware, isDeveloper, viewMyProjects)
router.get("/logout-developer", logoutDeveloper)
module.exports = router