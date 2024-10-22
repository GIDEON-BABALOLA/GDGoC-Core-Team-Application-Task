const path = require("path")
const bcrypt = require("bcrypt")
const _ = require("lodash")
const Developer = require(path.join(__dirname, "..",  "models", "developerModel.js"))
const { validateEmail, validatePassword } = require(path.join(__dirname, "..", "utils", "validator.js"))
const { userError, validatorError } = require(path.join(__dirname, "..", "utils", "customError.js"))
const { generateAccessToken, generateRefreshToken } = require(path.join(__dirname, "..", "config", "tokenConfig"))
const { logEvents } = require(path.join(__dirname, "..", "middlewares", "logEvents.js"))
const registerDeveloper = async (req, res) => {
    const { name, title, email, password} = req.body;
    try{
if(!name || !email || !password || !title){
throw new userError("Please Fill In All The Fields Needed For Registration", 400)
}
await validateEmail(email)
await validatePassword(password)
const foundDeveloper = await Developer.findOne({email : email})
if(foundDeveloper) {
    throw new userError("Your Account Already Exists", 400)
}
const hashedPassword = await bcrypt.hash(password, 10);
const newDeveloper = await Developer.create({
name : name,
title : title,
email : email,
password :  hashedPassword,
})
res.status(201).json(newDeveloper)
    }
catch(error){
logEvents(`${error.name}: ${error.message}`, "registerDeveloperError.txt", "developerError")
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

const loginDeveloper = async (req, res) => {
const { email, password } = req.body;
try{
if(!email || !password){
throw new userError("Please Provide An Email And A Password", 400)
}
await validateEmail(email)
await validatePassword(password)
 const foundDeveloper = await Developer.findOne({email : email})
 if(!foundDeveloper){
    throw new userError("Your Account Does Not Exist", 404)
}
const match = await bcrypt.compare(password, foundDeveloper.password)
if(foundDeveloper && match){
    const id = foundDeveloper?._id.toString()
    const refreshToken = generateRefreshToken(id, foundDeveloper.role)
    await Developer.findByIdAndUpdate(id, {refreshToken : refreshToken}, { new : true})
    res.cookie("refreshToken", refreshToken, { httpOnly : true, maxAge: 60 * 60 * 1000 * 24 * 3, sameSite : "None", /* secure : true */})
    res.status(201).json({
        id : foundDeveloper?._id,
        name : foundDeveloper?.name,
        title : foundDeveloper?.title,
        email : foundDeveloper?.email,
        accessToken : generateAccessToken(id, foundDeveloper.role),
        password : foundDeveloper?.password,
        role : foundDeveloper?.role
    })
}
else{
    throw new userError("Your Credentials Are Invalid", 401)
}
    }catch(error){
        console.log(error)
        logEvents(`${error.name}: ${error.message}`, "loginDeveloperError.txt", "developerError")
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
const logoutDeveloper = async (req, res) => {
    const cookies = req.cookies
    try{
        if(!cookies?.refreshToken){
            throw new userError("You Are Not Logged In", 401)
        }
        const refreshToken = cookies.refreshToken;
        const developer = await Developer.findOne({refreshToken : refreshToken})
        if(!developer){
            res.clearCookie("refreshToken", {httpOnly: true, sameSite : "None" /*secure  : true */})
            return res.status(204).json({message : "Successfully Logged Out", "success" : true})
        }
        developer.refreshToken = ""
        await developer.save();      
        res.clearCookie("refreshToken", {httpOnly: true, sameSite : "None" /*secure : true */})
        return res.status(204).json({message : "Successfully Logged Out now", "success" : true})
    }catch(error){
        logEvents(`${error.name}: ${error.message}`, "logoutDeveloperError.txt", "developerError")
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
        const foundDeveloper = await Developer.findOne( { _id : req.user._id })
        if(!foundDeveloper){
            throw new userError("Your Account Does Not Exist", 400)
        }
        const developerDetailsToBeSent = _.omit(foundDeveloper.toObject(), "refreshToken")
        res.status(200).json(developerDetailsToBeSent);
    }catch(error){
        console.log(error)
        logEvents(`${error.name}: ${error.message}`, "viewDeveloperProfileError.txt", "developerError")
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
            const foundProject = await Developer.findOne({ _id : req.user._id}).populate("projects");
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
    registerDeveloper,
    loginDeveloper,
    logoutDeveloper,
    viewMyProfile,
    viewMyProjects
}