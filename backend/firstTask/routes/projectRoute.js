const express = require("express")
const path = require("path")
const router = express.Router()
const {
    createAProject,
    viewAProject,
    viewAllProjects,
    viewProjectStatus,
    viewProjectDeadline,
    addProjectMember,
    removeProjectMember,
    getMembersOfAProject,
    deleteAProject
} = require(path.join(__dirname, "..", "controllers", "projectController.js"))
const { authMiddleware, isAdministrator } = require(path.join(__dirname, "..", "middlewares", "authMiddleware.js"))
router.post("/create-a-project", authMiddleware, isAdministrator, createAProject)
router.put("/add-project-member/:projectId", authMiddleware, isAdministrator, addProjectMember)
router.put("/remove-project-member/:projectId", authMiddleware, isAdministrator, removeProjectMember)
router.get("/view-project-members/:projectId", authMiddleware, getMembersOfAProject)
router.get("/view-a-project/:projectId", authMiddleware, isAdministrator, viewAProject)
router.get("/view-project-status/:projectId", authMiddleware, isAdministrator, viewProjectStatus)
router.get("/view-project-deadline/:projectId", authMiddleware, isAdministrator, viewProjectDeadline)
router.get("/view-all-projects", authMiddleware, isAdministrator, viewAllProjects)
router.delete("/delete-a-project/:projectId", authMiddleware, isAdministrator, deleteAProject)
module.exports = router