import express from "express"
import { getAllCartById,createCartByUserId } from "../controllers/cart.controller"

const routerCart = express.Router();

routerCart.get("/api/cart",getAllCartById)
routerCart.post("/api/cart/:product_id",createCartByUserId)

export default routerCart