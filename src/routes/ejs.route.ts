import express from "express";
import { Product } from "../entity/Product";
import { Manager } from "../utils/Manager";
import { Cart } from "../entity/Cart";

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

routerEJS.get("/keranjang",async (req, res) => {
  const user_id = req.session['userId'];
  if(!user_id) return res.status(403).json({msg : 'Harap login terlebih dahulu.'})

  try {
    const carts = await Manager.find(Cart,{where : {
      user_id : user_id
    }})

    const  userIdsInCarts = carts.map((cart)=> cart.product_id)

    const products = await Promise.all(
    userIdsInCarts.map(async (userId) => {
      const product = await Manager.find(Product, { where: { _id: userId } });
      return product;
      })
    );

    res.render("cart.ejs",{products})
  } catch (error) {
    if(error){
      res.status(500).json({msg : error.message})
    }
  }
})


export default routerEJS;