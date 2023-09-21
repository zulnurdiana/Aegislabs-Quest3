import express from "express";
import { checkout, webhook} from "../controllers/payment.controller";
import { AppDataSource } from "../data-source";
const routerPayment = express.Router();

AppDataSource.initialize().then(async () => {
routerPayment.post("/checkout", checkout);
routerPayment.post("/webhook", express.raw({ type: 'application/json' }), webhook);

}).catch(error => console.log(error))






export default routerPayment;