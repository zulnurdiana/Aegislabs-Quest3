import express from "express";
import { verifyOTP,resendOTPVerification} from "../controllers/otp.controller";

const routerOTP = express.Router();

routerOTP.post("/otp",verifyOTP);
routerOTP.post("/otp/resend",resendOTPVerification);



export default routerOTP;