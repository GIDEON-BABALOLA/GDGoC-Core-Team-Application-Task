const path = require("path")
const bcrypt = require("bcrypt")
const _ = require("lodash")
const Admin = require(path.join(__dirname, "..",  "models", "adminModel.js"))
const { validateEmail, validatePassword } = require(path.join(__dirname, "..", "utils", "validator.js"))
const { userError, validatorError } = require(path.join(__dirname, "..", "utils", "customError.js"))
const { generateAccessToken, generateRefreshToken } = require(path.join(__dirname, "..", "config", "tokenConfig"))
const { logEvents } = require(path.join(__dirname, "..", "middlewares", "logEvents.js"))
const registerAdministrator = async (req, res) => {
    const { name, title, email, password} = req.body;
    try{
if(!name || !email || !password || !title){
throw new userError("Please Fill In All The Fields Needed For Registration", 400)
}
await validateEmail(email)
await validatePassword(password)
const foundAdmin = await Admin.findOne({email : email})
if(foundAdmin) {
    throw new userError("Your Account Already Exists", 400)
}
const hashedPassword = await bcrypt.hash(password, 10);
const newAdmin = await Admin.create({
name : name,
title : title,
email : email,
password :  hashedPassword,
})
res.status(201).json(newAdmin)
    }
catch(error){
logEvents(`${error.name}: ${error.message}`, "registerAdminError.txt", "adminError")
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

const loginAdministrator = async (req, res) => {
const { email, password } = req.body;
try{
if(!email || !password){
throw new userError("Please Provide An Email And A Password", 400)
}
await validateEmail(email)
await validatePassword(password)
 const foundAdmin = await Admin.findOne({email : email})
 if(!foundAdmin){
    throw new userError("Your Account Does Not Exist", 404)
}
const match = await bcrypt.compare(password, foundAdmin.password)
if(foundAdmin && match){
    const id = foundAdmin?._id.toString()
    const refreshToken = generateRefreshToken(id, foundAdmin.role)
    await Admin.findByIdAndUpdate(id, {refreshToken : refreshToken}, { new : true})
    res.cookie("refreshToken", refreshToken, { httpOnly : true, maxAge: 60 * 60 * 1000 * 24 * 3, sameSite : "None", /* secure : true */})
    res.status(201).json({
        id : foundAdmin?._id,
        name : foundAdmin?.name,
        title : foundAdmin?.title,
        email : foundAdmin?.email,
        accessToken : generateAccessToken(id, foundAdmin.role),
        password : foundAdmin?.password,
        role : foundAdmin?.role
    })
}
else{
    throw new userError("Your Credentials Are Invalid", 401)
}
    }catch(error){
        console.log(error)
        logEvents(`${error.name}: ${error.message}`, "loginAdminError.txt", "adminError")
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
const logoutAdministrator = async (req, res) => {
    const cookies = req.cookies
    try{
        if(!cookies?.refreshToken){
            throw new userError("You Are Not Logged In", 401)
        }
        const refreshToken = cookies.refreshToken;
        const admin = await Admin.findOne({refreshToken : refreshToken})
        if(!admin){
            res.clearCookie("refreshToken", {httpOnly: true, sameSite : "None",   /*secure  : true */})
            return res.status(204).json({message : "Successfully Logged Out", "success" : true})
        }
        admin.refreshToken = ""
        await admin.save();      
        res.clearCookie("refreshToken", {httpOnly: true, sameSite : "None",  /*secure : true */})
        return res.status(204).json({message : "Successfully Logged Out now", "success" : true})
    }catch(error){
        logEvents(`${error.name}: ${error.message}`, "logoutAdminError.txt", "adminError")
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
        const foundAdmin = await Admin.findOne( { _id : req.user._id })
        if(!foundAdmin){
            throw new userError("Your Account Does Not Exist", 400)
        }
        const adminDetailsToBeSent = _.omit(foundAdmin.toObject(), "refreshToken")
        res.status(200).json(adminDetailsToBeSent);
    }catch(error){
        console.log(error)
        logEvents(`${error.name}: ${error.message}`, "viewAdminProfileError.txt", "adminError")
        if (error instanceof userError) {
            return res.status(error.statusCode).json({ error : error.message})
        }
        else{
            return res.status(500).json({error : "Internal Server Error"})
            }  
    }  
}
module.exports = {
    registerAdministrator,
    loginAdministrator,
    logoutAdministrator,
    viewMyProfile
}