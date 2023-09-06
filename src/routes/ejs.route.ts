import express from "express";

const routerEJS = express.Router();

routerEJS.get("/",async (req, res) => {
  res.render("login.ejs");
})

routerEJS.get("/register",async (req, res) => {
  res.render("register.ejs");
})

routerEJS.get("/verify_otp",async (req, res) => {
    const idUser = req.session['idUser'];
    res.render("verify_otp", {idUser})
})


export default routerEJS;