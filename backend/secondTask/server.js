require("dotenv").config()
const mongoose =require("mongoose")
const express = require("express")
const app = express()
const path = require("path")
const cookieParser = require("cookie-parser")
app.use(express.json())
app.use(cookieParser())
const productRouter = require(path.join(__dirname,  "routes", "productRoute.js"))
const PORT = process.env.SECOND_TASK_PORT
app.use("/api/product", productRouter)
mongoose.connect(process.env.SECOND_TASK_MONGODB_URL)
.then(() => {
    app.listen(PORT, () => {
        console.log(` Connected To Database && Server is running on port ${PORT}`)
    })
})
.catch((error) => {
    console.log(error.name)
    console.log("Unable To Connect To Database")
})