import express from "express"
import { getAllCartById,createCartByUserId } from "../controllers/cart.controller"
import { AppDataSource } from "../data-source";
const routerCart = express.Router();

AppDataSource.initialize().then(async () => {

routerCart.get("/api/cart",getAllCartById)
routerCart.post("/api/cart/:product_id",createCartByUserId)

}).catch(error => console.log(error))


export default routerCart