const express = require("express")
const path = require("path")
const router = express.Router()
const {
    registerDesigner,
    loginDesigner,
    logoutDesigner,
    viewMyProfile,
    viewMyProjects
} = require(path.join(__dirname, "..", "controllers", "designerController.js"))
const { authMiddleware, isDesigner } = require(path.join(__dirname, "..", "middlewares", "authMiddleware.js"))
router.post("/register-designer", registerDesigner)
router.post("/login-designer", loginDesigner)
router.get("/view-designer-profile", authMiddleware, isDesigner, viewMyProfile)
router.get("/view-designer-projects", authMiddleware, isDesigner, viewMyProjects)
router.get("/logout-designer", logoutDesigner)
module.exports = router