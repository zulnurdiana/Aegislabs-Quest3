import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { OTP } from "../entity/OTP";
import { User } from "../entity/User";
import { Manager } from "../utils/Manager";
import { ObjectId } from "mongodb";
import { Request, Response } from "express";
import env from "dotenv";

env.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.USER_EMAIL, pass: process.env.USER_PASSWORD },
});

export const sendOTPVerificationEmail = async ({ id, email }, req: any, res: any) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 90000)}`;

    // Email option
    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Verify your Email",
      html: `<p>Enter <b>${otp}</b> to verify your gmail registration </p><p>This code <b>expires in 1 Hours</b></p>`,
    };

    // Hash OTP
    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otp, saltRounds);
    await Manager.save(OTP, {
      otp : hashedOTP,
      user_id: id,
      expiresAt: new Date(Date.now() + 3600000),
    })


    await transporter.sendMail(mailOptions);

    res.json({
      msg: "Verification code has been sent please check your email",
      data: {
        userId: id,
        email,
      },
    })

    // if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    //   res.json({
    //   msg: "Verification code has been sent please check your email",
    //   data: {
    //     userId: id,
    //     email,
    //   },
    // });
    // } else {
    //  res.redirect("/verify_otp");
    // }
    
    
   
  } catch (error) {
    res.json({
      status: "FAILED",
      msg: error.message,
    });
  }
};


export const verifyOTP = async (req: Request, res: Response) => {
  const {  idUser, otp } = req.body;

  try {
    if (!idUser || !otp) {
      throw new Error("Empty OTP is not allowed");
    } else {
      const user = await Manager.findOneBy(User, { _id: new ObjectId(idUser) });

      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      const otpToken = await Manager.findOneBy(OTP, { user_id: new ObjectId(idUser) });

      if (!otpToken) {
        throw new Error("User doesn't have an OTP token");
      }

      const expiresAt = otpToken.expiresAt;
      const hashedOTP = otpToken.otp;

      if (expiresAt < new Date()) {
        // The code has expired
        await Manager.delete(OTP, { idUser: new ObjectId(idUser) });
        throw new Error("The code has expired, please request a new one");
      }

      const validOTP = await bcrypt.compare(otp, hashedOTP);

      if (!validOTP) {
        return res.status(400).json({ msg: "OTP is wrong" });
      }

      user.verified = true;
      await Manager.save(User, user);


      // Remove OTP token
      await Manager.delete(OTP, { idUser: new ObjectId(idUser) });

       res.json({
        status: "VERIFIED",
        msg: "User email has been verified",
     
       })
       
      // if (req.xhr || req.headers.accept.indexOf('json') > -1) {
       
      // });
      // } else {
      // res.redirect("/login");
      // }

      
    }
  } catch (error) {
    res.json({
      status: "FAILED",
      msg: error.message,
    });
  }
};

export const resendOTPVerification = async (req: Request, res: Response) => {
  const {email} = req.body;
  const idUser = await Manager.findOneBy(User, { email: email });
  try {
    if(!idUser || !email) {
      throw new Error("User tidak ada atau belum");
    }

    await Manager.delete(OTP, { userId: new ObjectId(idUser._id) });
    await sendOTPVerificationEmail({ id: idUser._id, email }, req, res);
  } catch (error) {
    res.json({
      status : "FAILED",
      msg : error.message
    })
  }
}