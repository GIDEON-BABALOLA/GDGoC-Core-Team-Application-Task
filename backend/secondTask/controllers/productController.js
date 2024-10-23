const path = require("path")
const { logEvents } = require(path.join(__dirname, "..", "middlewares", "logEvents.js"))
const Product = require(path.join(__dirname, "..", "models", "productModel"))
const slugify = require("slugify")
const createProduct = async (req, res) => {
    const { title, description, price, category, brand, quantity, color } = req.body;
    if(!title || !description || !price || !category || !brand || !quantity || !color){
        return res.status(200).json({message : "Pls Enter The Full Description Of The Product"})
    }
    if(req.body.title){
        req.body.slug = slugify(req.body.title)
    }
    try{
        const foundProduct = await Product.findOne({slug : slugify(title)})
        if(foundProduct){
            return res.status(400).json({message : "Pls choose another title for your product"})
        }
    const newProduct = await Product.create(req.body)
    res.status(201).json(newProduct)
    }
    catch(error){
        console.log(error)
        logEvents(`${error.name}:${error.message}`, "createProductError.txt", "product")
        res.status(500).json({message : "Internal Server Error"})
    }
    }
    const updateProduct = async (req, res) => {
        const {id} = req.params;
        console.log(id)
        if(req.body.title){
            req.body.slug = slugify(req.body.title)
        }
        try{
    const updateProduct = await Product.findByIdAndUpdate(id, req.body, {new : true});
    console.log(updateProduct)
    res.status(201).json(updateProduct)
        }
        catch(error){
            console.log(error)
            logEvents(`${error.name}:${error.message}`, "updateProductError.txt", "product")
            res.status(500).json({message : "Internal Server Error"})
        }
    
    }
    const deleteProduct = async (req, res) => {
        const {id} = req.params;
        try{
    const deleteProduct = await Product.findOneAndDelete(id);
    res.status(204).json(deleteProduct)
        }
        catch(error){
            console.log(error)
            logEvents(`${error.name}:${error.message}`, "deleteProductError.txt", "product")
            res.status(500).json({message : "Internal Server Error"})
        }
    
    }
    const getaProduct = async(req, res)=> {
        const { id } = req.params;
    try{
    const foundProduct = await Product.findById(id)
    res.status(200).json(foundProduct)
    }catch(error){
        logEvents(`${error.name}:${error.message}`, "getaProductError.txt", "product")  
        res.status(500).json({message : "Internal Server Error"})
    }
    }
    const getAllProduct = async (req, res) => {
        try{
            //filtering
    const queryObj = {...req.query}
    const excludeFields = ["page", "sort", "limit", "fields"]
    excludeFields.forEach((el) => delete queryObj[el])
    let queryString = JSON.stringify(queryObj)
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    console.log(JSON.parse(queryString))
    let query = Product.find(JSON.parse(queryString))
    //Sorting
    if(req.query.sort){
        const sortBy = req.query.sort.split(",").join(" ")
        query = query.sort(sortBy)
    }else{
    query = query.sort("-createdAt")
    }
    // Limiting
    if(req.query.fields){
        const fields = req.query.fields.split(",").join(" ")
        console.log(fields)
        query = query.select(fields)
    
    }else{
    query = query.select("-__v")
    }
    //Pagination
    const page = req.query.page;
    const limit = req.query.limit
    const skip = (page -1) * limit
    query = query.skip(skip).limit(limit)
    if(req.query.page){
        const productCount = await Product.countDocuments();
        if(skip >= productCount){
            return res.json({"message": "This page does not exist", "success" : false})
        }
    }
    const allProducts = await query //filtering by price, brand, and category
    res.status(200).json(allProducts)
    }catch(error){
        console.log(error)
        logEvents(`${error.name}:${error.stack}`, "getAllProductError.txt", "product")
        res.status(500).json({message : "Internal Server Error"})
    }
    }
module.exports = {
    createProduct,
    getaProduct,
    updateProduct,
    deleteProduct,
    getAllProduct
}