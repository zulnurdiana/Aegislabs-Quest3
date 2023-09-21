import express from "express";
import { verifyOTP,resendOTPVerification} from "../controllers/otp.controller";
import { AppDataSource } from "../data-source";
const routerOTP = express.Router();

AppDataSource.initialize().then(async () => {
  
routerOTP.post("/otp",verifyOTP);
routerOTP.post("/otp/resend",resendOTPVerification);

}).catch(error => console.log(error))




export default routerOTP;