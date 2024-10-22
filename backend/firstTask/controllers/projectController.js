const path = require("path")
const slugify = require("slugify")
const Project = require(path.join(__dirname, "..", "models", "projectModel.js"))
const Developer = require(path.join(__dirname, "..",  "models", "developerModel.js"))
const Designer = require(path.join(__dirname, "..", "models", "designerModel.js"))
const { logEvents } = require(path.join(__dirname, "..", "middlewares", "logEvents.js"))
const { userError, projectError } = require(path.join(__dirname, "..", "utils", "customError.js"))
const createAProject = async (req, res) => {
    const { title, description, year, month, date, hours, minutes, seconds } = req.body;
    console.log(req.body)
try{
    if(!title || !description || !year || !month || !date || !hours || !minutes || !seconds){
        throw new userError("Pls Enter The Full Details Of The Project To Be Created", 400)
    }
    const foundProject = await Project.findOne({slug : slugify(req.body.title)})
    const ourdate = new Date()
    ourdate.setFullYear(year, month - 1, date)
    ourdate.setHours(hours, minutes, seconds)
    console.log(ourdate)
    if(foundProject){
        throw new userError("This Project Already Exists", 400)
    }
    const newProject = await Project.create({
        title : title,
        description : description,
        slug : slugify(title),
        status : "pending", 
        deadline :  ourdate,
        })
        res.status(201).json(newProject)
}catch(error){
    console.log(error)
    logEvents(`${error.name}: ${error.message}`, "createProjectError.txt", "projectError")
    if (error instanceof userError) {
        return res.status(error.statusCode).json({ error : error.message})
}
else if(error instanceof projectError){
       return  res.status(error.statusCode).json({ error : error.message})  
}
else{
     return res.status(500).json({error : "Internal Server Error"})
}
}
}
const viewAProject = async (req, res) => {
    const { projectId } = req.params
   try{
    if(!projectId){
        throw new userError("Pls Enter The Id Of The Project You Want To Check", 400)
    }
const foundProject = await Project.findOne({_id : projectId})
if(!foundProject){
    throw new projectError("This Project Does Not Exist", 400)
}
res.status(200).json(foundProject)
}catch(error){
    logEvents(`${error.name}: ${error.message}`, "viewAProjectError.txt", "projectError")
    if (error instanceof userError) {
        return res.status(error.statusCode).json({ error : error.message})
}
else if(error instanceof projectError){
       return  res.status(error.statusCode).json({ error : error.message})  
}
else{
     return res.status(500).json({error : "Internal Server Error"})
}
} 
}
const viewAllProjects = async (req, res) => {
const { page, limit } = req.query;
let allProjects;
    try{
        if(!page || !limit){
            throw new userError("Pls Enter The Page And The Limit Of The Projects You Are Looking For", 400)
        }
        allProjects =  Project.find();
        const skip = (page - 1) * limit
        allProjects = allProjects.skip(skip).limit(limit)
        if(req.query.page){
            const projectCount = await Project.countDocuments();
            if(skip >= projectCount){
                throw new userError( "This page does not exist",404)
            }
        }
        const dataToBeSent = await allProjects;
        res.status(200).json(dataToBeSent)
    }catch(error){
        logEvents(`${error.name}: ${error.message}`, "viewAllProjectsError.txt", "projectError")
        if (error instanceof userError) {
            return res.status(error.statusCode).json({ error : error.message})
    }
    else if(error instanceof projectError){
           return  res.status(error.statusCode).json({ error : error.message})  
    }
    else{
         return res.status(500).json({error : "Internal Server Error"})
    } 
    } 
}
const viewProjectStatus = async (req, res) => {
    const { projectId } = req.params;
    try{
        if(!projectId){
            throw new userError("Pls Enter The Id Of The Project You Want To Check", 400)
        }
        const foundProject = await Project.findOne({_id : projectId})
        if(!foundProject){
            throw new userError("This Project Does Not Exist", 400)
        }
        res.status(200).json({status : foundProject.toObject().status})
    }catch(error){
        logEvents(`${error.name}: ${error.message}`, "viewProjectStatusError.txt", "projectError")
        if (error instanceof userError) {
            return res.status(error.statusCode).json({ error : error.message})
    }
    else if(error instanceof projectError){
           return  res.status(error.statusCode).json({ error : error.message})  
    }
    else{
         return res.status(500).json({error : "Internal Server Error"})
    }
    }   
}
const viewProjectDeadline = async (req, res) => {
    const { projectId } = req.params;
    try{
        if(!projectId){
            throw new userError("Pls Enter The Id Of The Project You Want To Check", 400)
        }
        const foundProject = await Project.findOne({_id : projectId})
        if(!foundProject){
            throw new userError("This Project Does Not Exist", 400)
        }
        res.status(200).json({status : foundProject.toObject().deadline})
    }catch(error){
        logEvents(`${error.name}: ${error.message}`, "viewProjectDeadlineError.txt", "projectError")
        if (error instanceof userError) {
            return res.status(error.statusCode).json({ error : error.message})
    }
    else if(error instanceof projectError){
           return  res.status(error.statusCode).json({ error : error.message})  
    }
    else{
         return res.status(500).json({error : "Internal Server Error"})
    }  
    }   
}
const addProjectMember = async (req, res) => {
    const defaultRoles = ["developer", "designer"]
    const { email, role } = req.body;
    const { projectId } = req.params;
    try{
if(!email || !projectId){
    throw new userError("Pls Enter The Email Of The Project Member, And The Role Of The Member", 400)
}
if(!role){
    throw new userError("Pls Enter The Role Of The Member In This Project", 400)
}
if(!defaultRoles.includes(role)){
    throw new userError("Pls Enter A Correct Role", 400)
}
const foundProject = await Project.findOne({_id : projectId})
if(!foundProject){
    throw new userError("This Project Does Not Exist", 400)
}
let foundDeveloperOrDesigner
switch (role) {
    case "developer":
        foundDeveloperOrDesigner = await Developer.findOne({email : email})
        if(!foundDeveloperOrDesigner){
            throw new userError("The Account Of This Developer Does Not Exist", 400)
        }
        const addedDeveloper = await foundProject.addMember(foundDeveloperOrDesigner._id, "developer")
        await foundDeveloperOrDesigner.addProject(foundProject._id)
        return  res.status(201).json(addedDeveloper)
    case "designer":
        foundDeveloperOrDesigner = await Designer.findOne({email : email})
        if(!foundDeveloperOrDesigner){
            throw new userError("The Account Of This Designer Does Not Exist", 400)
        }
        const addedDesigner = await foundProject.addMember( foundDeveloperOrDesigner._id, "designer")
        await foundDeveloperOrDesigner.addProject(foundProject._id)
        return  res.status(201).json(addedDesigner)
}

    }catch(error){
        console.log(error)
        logEvents(`${error.name}: ${error.message}`, "addProjectMemberError.txt", "projectError")
        if (error instanceof userError) {
            return res.status(error.statusCode).json({ error : error.message})
    }
    else if(error instanceof projectError){
           return  res.status(error.statusCode).json({ error : error.message})  
    }
    else{
         return res.status(500).json({error : "Internal Server Error"})
    }
    }
}
const removeProjectMember = async(req, res) => {
    const defaultRoles = ["developer", "designer"]
    const { projectId } = req.params;
    const { email, role } = req.body; 
    try{
        if(!projectId || !email){
            throw new userError("Pls Enter The Project Id And The Email Of The Member You Want To Remove From This Project")
        }
        if(!role){
            throw new userError("Pls Enter The Role Of The Project Member You Want To Remove", 400)
        }
        if(!defaultRoles.includes(role)){
            throw new userError("Pls Enter A Correct Role", 400)
        }
        const foundProject = await Project.findOne({_id : projectId})
if(!foundProject){
    throw new userError("This Project Does Not Exist", 400)
}
        let foundDeveloperOrDesigner
      switch (role) {
        case "developer":
            foundDeveloperOrDesigner = await Developer.findOne({email : email})
            if(!foundDeveloperOrDesigner){
                throw new userError("The Account Of This Developer Does Not Exist", 400)
            }
            const removedDeveloper = await foundProject.removeMember( foundDeveloperOrDesigner._id, "developer")
            await foundDeveloperOrDesigner.removeProject(foundProject._id)
            return  res.status(201).json(removedDeveloper)
            case "designer":
                foundDeveloperOrDesigner = await Designer.findOne({email : email})
                if(!foundDeveloperOrDesigner){
                    throw new userError("The Account Of This Designer Does Not Exist", 400)
                }
                const removedDesigner = await foundProject.removeMember( foundDeveloperOrDesigner._id, "designer")
                await foundDeveloperOrDesigner.removeProject(foundProject._id)
                return  res.status(201).json(removedDesigner)
      
      }

    }catch(error){
        logEvents(`${error.name}: ${error.message}`, "removeProjectMemberError.txt", "projectError")
        if (error instanceof userError) {
            return res.status(error.statusCode).json({ error : error.message})
    }
    else if(error instanceof projectError){
           return  res.status(error.statusCode).json({ error : error.message})  
    }
    else{
         return res.status(500).json({error : "Internal Server Error"})
    } 
    }
}
const getMembersOfAProject = async (req, res) => {
    const defaultRoles = ["developers", "designers"]
    const { role } = req.body;
    const { projectId } = req.params;
    try{
        if(!role){
            throw new userError("Pls Enter The Role Of The Members You Are Looking For", 400)
        }
        if(!projectId){
            throw new userError("Pls Enter The Id Of The Project", 400)
        }
        if(!defaultRoles.includes(role)){
            throw new userError("Pls Enter A Correct Role", 400)
        }
        const foundProject = await Project.findOne({ _id : projectId}).populate(role);
      const membersToBeSent = foundProject[role]
        res.status(200).json(membersToBeSent);
    }catch(error){
        console.log(error)
        logEvents(`${error.name}: ${error.message}`, "getMembersOfAProjectError.txt", "projectError")
        if (error instanceof userError) {
            return res.status(error.statusCode).json({ error : error.message})
    }
    else if(error instanceof projectError){
           return  res.status(error.statusCode).json({ error : error.message})  
    }
    else{
         return res.status(500).json({error : "Internal Server Error"})
    }  
    }
}
const deleteAProject = async(req, res) => {
    const { projectId } = req.params
    console.log(projectId)
    try{
        if(!projectId){
        throw new userError("Pls Enter The Id Of The Project You Want To Delete", 400)
        }
        const projectToBeDeleted = await Project.findByIdAndDelete(projectId)
        console.log(projectToBeDeleted)
        if(!projectToBeDeleted){
            throw new userError("The Project You Want To Delete Does Not Exist", 400)
        }
        res.status(200).json(projectToBeDeleted)
    }catch(error){
        console.log(error)
        logEvents(`${error.name}: ${error.message}`, "deleteAProjectError.txt", "projectError")
        if (error instanceof userError) {
            return res.status(error.statusCode).json({ error : error.message})
    }
    else if(error instanceof projectError){
           return  res.status(error.statusCode).json({ error : error.message})  
    }
    else{
         return res.status(500).json({error : "Internal Server Error"})
    }
    }
}
module.exports={
    createAProject,
    viewAProject,
    viewAllProjects,
    viewProjectStatus,
    viewProjectDeadline,
    addProjectMember,
    removeProjectMember,
    getMembersOfAProject,
    deleteAProject
}