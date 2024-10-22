const path = require("path")
const bcrypt = require("bcrypt")
const _ = require("lodash")
const Designer = require(path.join(__dirname, "..", "models", "designerModel.js"))
const { validateEmail, validatePassword } = require(path.join(__dirname, "..", "utils", "validator.js"))
const { generateAccessToken, generateRefreshToken } = require(path.join(__dirname, "..", "config", "tokenConfig"))
const { userError } = require(path.join(__dirname, "..", "utils", "customError.js"))
const { logEvents } = require(path.join(__dirname, "..", "middlewares", "logEvents.js"))
const registerDesigner = async (req, res) => {
    const { name, title, email, password } = req.body;
    try{
if(!name || !email || !password || !title){
throw new userError("Please Fill In All The Fields Needed For Registration", 400)
}
await validateEmail(email)
await validatePassword(password)
const foundDesigner = await Designer.findOne({email : email})
if(foundDesigner) {
    throw new userError("Your Account Already Exists", 400)
}
const hashedPassword = await bcrypt.hash(password, 10);
const newDesigner = await Designer.create({
name : name,
title : title,
email : email,
password :  hashedPassword,
})
res.status(201).json(newDesigner)
    }
catch(error){
logEvents(`${error.name}: ${error.message}`, "registerDesignerError.txt", "designerError")
if (error instanceof userError) {
return res.status(error.statusCode).json({ error : error.message})
}
else if(error instanceof validatorError){
return  res.status(error.statusCode).json({ error : error.message})  
}
else{
return res.status(500).json({error : "Internal Server Error"})
}
    }
}

const loginDesigner = async (req, res) => {
const { email, password } = req.body;
try{
if(!email || !password){
throw new userError("Please Provide An Email And A Password", 400)
}
await validateEmail(email)
await validatePassword(password)
 const foundDesigner = await Designer.findOne({email : email})
 if(!foundDesigner){
    throw new userError("Your Account Does Not Exist", 404)
}
const match = await bcrypt.compare(password, foundDesigner.password)
if(foundDesigner && match){
    const id = foundDesigner?._id.toString()
    const refreshToken = generateRefreshToken(id, foundDesigner.role)
    await Designer.findByIdAndUpdate(id, {refreshToken : refreshToken}, { new : true})
    res.cookie("refreshToken", refreshToken, { httpOnly : true, maxAge: 60 * 60 * 1000 * 24 * 3, sameSite : "None", /* secure : true */})
    res.status(201).json({
        id : foundDesigner?._id,
        name : foundDesigner?.name,
        title : foundDesigner?.title,
        email : foundDesigner?.email,
        accessToken : generateAccessToken(id, foundDesigner.role),
        password : foundDesigner?.password,
        role : foundDesigner?.role
    })
}
else{
    throw new userError("Your Credentials Are Invalid", 401)
}
    }catch(error){
        logEvents(`${error.name}: ${error.message}`, "loginDesignerError.txt", "designerError")
if (error instanceof userError) {
return res.status(error.statusCode).json({ error : error.message})
        }
else if(error instanceof validatorError){
return  res.status(error.statusCode).json({ error : error.message})  
        }
else{
return res.status(500).json({error : "Internal Server Error"})
        }   
    }
}
const logoutDesigner = async (req, res) => {
    const cookies = req.cookies
    try{
        if(!cookies?.refreshToken){
            throw new userError("You Are Not Logged In", 401)
        }
        const refreshToken = cookies.refreshToken;
        const designer = await Designer.findOne({refreshToken : refreshToken})
        if(!designer){
            res.clearCookie("refreshToken", {httpOnly: true, sameSite : "None", /*secure  : true */})
            return res.status(204).json({message : "Successfully Logged Out", "success" : true})
        }
        designer.refreshToken = ""
        await designer.save();      
        res.clearCookie("refreshToken", {httpOnly: true, sameSite : "None", /*secure : true */})
        return res.status(204).json({message : "Successfully Logged Out now", "success" : true})
    }catch(error){
        logEvents(`${error.name}: ${error.message}`, "logoutDesignerError.txt", "designerError")
        if (error instanceof userError) {
            return res.status(error.statusCode).json({ error : error.message})
        }
        else{
            return res.status(500).json({error : "Internal Server Error"})
            }
    }
}
const viewMyProfile = async(req, res) => {
    try{
        const foundDesigner = await Designer.findOne( { _id : req.user._id })
        if(!foundDesigner){
            throw new userError("Your Account Does Not Exist", 400)
        }
        const designerDetailsToBeSent = _.omit(foundDesigner.toObject(), "refreshToken")
        res.status(200).json(designerDetailsToBeSent);
    }catch(error){
        logEvents(`${error.name}: ${error.message}`, "viewDesignerProfileError.txt", "designerError")
        if (error instanceof userError) {
            return res.status(error.statusCode).json({ error : error.message})
        }
        else{
            return res.status(500).json({error : "Internal Server Error"})
            }  
    }  
}
const viewMyProjects = async(req, res) => {
    try{
        const foundProject = await Designer.findOne({ _id : req.user._id}).populate("projects");
      const projectsToBeSent = foundProject["projects"]
        res.status(200).json(projectsToBeSent);
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
module.exports = {
    registerDesigner,
    loginDesigner,
    logoutDesigner,
    viewMyProfile,
    viewMyProjects
}