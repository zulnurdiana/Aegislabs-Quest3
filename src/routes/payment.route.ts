import express from "express";
import { checkout, webhook} from "../controllers/payment.controller";
const routerPayment = express.Router();

routerPayment.post("/checkout/:idProduct", checkout);
routerPayment.post("/webhook", express.raw({ type: 'application/json' }), webhook);




export default routerPayment;