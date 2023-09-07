import express from "express";
import { Product } from "../entity/Product";
import { Manager } from "../utils/Manager";

const routerEJS = express.Router();

routerEJS.get("/",async (req, res) => {
  res.render("login.ejs");
})

routerEJS.get("/success",async (req, res) => {
  res.render("success.ejs");
})
routerEJS.get("/failed",async (req, res) => {
  res.render("failed.ejs");
})

routerEJS.get("/dashboard",async (req, res) => {
  const products = await Manager.find(Product);
  res.render("dashboard.ejs", {products})
})

routerEJS.get("/register",async (req, res) => {
  res.render("register.ejs");
})

routerEJS.get("/verify_otp",async (req, res) => {
    const idUser = req.session['idUser'];
    res.render("verify_otp", {idUser})
})


export default routerEJS;