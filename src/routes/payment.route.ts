import express from "express";
import { checkout, orderSuccess, webhook } from "../controllers/payment.controller";
const routerPayment = express.Router();

routerPayment.post("/checkout/:idProduct", checkout);
routerPayment.get("/order/success", orderSuccess);
routerPayment.post("/webhook", express.raw({ type: 'application/json' }), webhook);



export default routerPayment;