import express from "express"
import { deleteProduct, getProduct, getProductById, productController, seedFashionProducts, updateProduct } from "../controller/productController.js"
import upload from "../middleware/uploadMiddleware.js"
const route = express.Router()

route.post('/seed', seedFashionProducts)
route.get('/seed', seedFashionProducts)
route.post('/add',upload.single("images"),productController)
route.get('/', getProduct)
route.get('/:id', getProductById)
route.put('/update/:id', updateProduct)     
route.delete('/delete/:id', deleteProduct)

export default route 