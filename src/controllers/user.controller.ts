import { Response,Request } from "express"
import {  User } from "../entity/User"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { Manager } from "../utils/Manager";
import { ObjectId } from "mongodb";
import Joi from "joi";
import { sendOTPVerificationEmail } from "./otp.controller";

export const getAllUsers = async(req : Request,res : Response) => { 
       const Users = await Manager.find(User,{
        select : ["_id","nama","email"]
       })
       if(!Users) return res.status(404).json({msg : "User Not Found"})
       res.status(200).json(Users)
   }
   

export const getUsersById = async(req : Request,res : Response) => {
        const {id} = req.params;
        const Users = await Manager.findOneBy(User, {_id : new ObjectId(id)})
        if(!Users) return res.status(404).json({msg : `User with id ${id} not found`})
        res.status(200).json(Users);
}

export const Register = async(req : Request,res : Response) => {
        const schema = Joi.object({
            nama: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(3).required(),
            confPassword: Joi.string().valid(Joi.ref('password')).required(),
        });

        const { error } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({ msg: error.details[0].message });
        }

        const { nama, email, password, confPassword } = req.body;


        if (confPassword !== password) {
            return res.status(400).json({ msg: 'Password tidak cocok' });
        }

        const salt = await bcrypt.genSalt();
        const encryptPassword = await bcrypt.hash(password, salt);

        const user = new User({
            nama: nama,
            email: email,
            password : encryptPassword
        });

        try {
            await Manager.save(user);
            let data = {
                id: user._id,
                email: user.email,
                };

            await sendOTPVerificationEmail(data,req,res);

           
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ msg: 'Gagal melakukan registrasi' });
        }
}

export const Login = async(req : Request,res : Response) => {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(3).required(),
        })

        const {error} = schema.validate(req.body);

        if (error) {
            return res.status(400).json({ msg: error.details[0].message });
        }

        const {email, password} = req.body;

        const Users = await Manager.findOneBy(User, {email : email})
        if(!Users) return res.status(404).json({msg : `User with email ${email} not found`})

        const checkPassword = await bcrypt.compare(password, Users.password)
        if(!checkPassword) return res.status(400).json({msg : "Password not match"})

        const payload = {id : Users._id, nama : Users.nama, email : Users.email}

        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn : "30m"
        })

        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn : "1d"
        })
        try {
            await Manager.update(User, {_id : Users._id}, {refresh_token : refreshToken})
            res.cookie("refreshToken", refreshToken, {
                httpOnly : true,
                maxAge : 24 * 60 * 60 * 1000
            })
            res.json({accessToken})
        } catch (error) {
            console.log(error.message);
            
        }
}

export const Logout = async(req : Request,res : Response) => {
    const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(403);
        
        const Users = await Manager.findOneBy(User, {refresh_token : refreshToken});
        if(!Users) return res.sendStatus(403);
        let userId = Users._id;
        try {
            await Manager.update(User, {_id : userId}, {refresh_token : null})
            res.clearCookie("refreshToken");
            return res.status(200).json({msg : "Berhasil logout"})
        } catch (error) {
            console.log(error.message);
            
        }
}

export const refreshToken = async (req: Request, res: Response) => {
   const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(401);
        const Users = await Manager.findOneBy(User, {refresh_token : refreshToken});
        const payload = {
            id : Users._id,
            nama : Users.nama,
            email : Users.email
        }
        try {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err : any, decode : any) => {
            if(err) return res.sendStatus(403);
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET,{
                expiresIn : "30m"
            })
            res.json({accessToken})
        })
        } catch (error) {
            console.log(error.message);
            
        }
}