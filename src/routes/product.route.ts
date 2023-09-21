import express from "express";
import { createProduct, getAllProductByUsers,deleteProductById,updateProductById,getSingleProductById } from "../controllers/product.controllers";
import upload from "../utils/Multer";
import { AppDataSource } from "../data-source";
import { verifyImage } from "../middleware/verifyImage";
const routerProduct = express.Router();

AppDataSource.initialize().then(async () => {
  routerProduct.post("/products",  upload.single("img_url"), verifyImage , createProduct);
routerProduct.get("/products",  getAllProductByUsers );
routerProduct.delete("/products/:id",  deleteProductById );
routerProduct.put("/products/:id",  updateProductById );
routerProduct.get("/products/:id",  getSingleProductById );

}).catch(error => console.log(error))



export default routerProduct;