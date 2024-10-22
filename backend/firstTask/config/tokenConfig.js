const jwt = require("jsonwebtoken")
const generateRefreshToken = (id, role) => {
    return jwt.sign({id  : id, role : role}, process.env.FIRST_TASK_JWT_SECRET, {expiresIn : "7d"})
}
const generateAccessToken = (id, role) => {
    return jwt.sign({id: id, role : role}, process.env.FIRST_TASK_JWT_SECRET, {expiresIn : "7d"})
}
module.exports = { generateAccessToken, generateRefreshToken}