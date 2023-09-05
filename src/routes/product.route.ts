import express from "express";
import { createProduct, getAllProductByUsers,deleteProductById,updateProductById,getSingleProductById } from "../controllers/product.controllers";
import upload from "../utils/Multer";
import { verifyImage } from "../middleware/verifyImage";
const routerProduct = express.Router();

routerProduct.post("/products",  upload.single("img_url"), verifyImage , createProduct);
routerProduct.get("/products",  getAllProductByUsers );
routerProduct.delete("/products/:id",  deleteProductById );
routerProduct.put("/products/:id",  updateProductById );
routerProduct.get("/products/:id",  getSingleProductById );

export default routerProduct;