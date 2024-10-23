const express = require("express")
const path = require("path")
const router = express.Router()
const {
    createProduct,
    getaProduct,
    updateProduct,
    getAllProduct,
    deleteProduct,
} = require(path.join(__dirname, "..", "controllers", "productController.js"))
router.post("/create-a-product", createProduct)
router.get("/get-a-product/:id", getaProduct)
router.get("/get-all-product", getAllProduct)
router.put("/update-a-product/:id", updateProduct)
router.delete("/delete-a-product/:id", deleteProduct)
module.exports = router