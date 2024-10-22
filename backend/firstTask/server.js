require("dotenv").config()
const express = require("express")
const app  = express()
const mongoose =require("mongoose")
const path = require("path")
const cookieParser = require("cookie-parser")
app.use(express.json())
app.use(cookieParser())
const PORT = process.env.FIRST_TASK_PORT
const adminRouter = require(path.join(__dirname,  "routes", "adminRoute.js"))
const developerRouter = require(path.join(__dirname,  "routes", "developerRoute.js"))
const designerRouter = require(path.join(__dirname,  "routes", "designerRoute.js"))
const projectRouter = require(path.join(__dirname,  "routes", "projectRoute.js"))
app.use("/api/admin", adminRouter);
app.use("/api/developer", developerRouter); 
app.use("/api/designer", designerRouter); 
app.use("/api/project", projectRouter); 
mongoose.connect(process.env.FIRST_TASK_MONGODB_URL)
.then(() => {
    app.listen(PORT, () => {
        console.log(` Connected To Database && Server is running on port ${PORT}`)
    })
})
.catch((error) => {
    console.log(error.name)
    console.log("Unable To Connect To Database")
})