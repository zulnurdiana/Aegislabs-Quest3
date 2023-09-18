import { Request, Response } from "express";
import { Product } from "../entity/Product";
import { Cart } from "../entity/Cart";
import { Manager } from "../utils/Manager";
import { ObjectId } from "mongodb";


export const getAllCartById = async (req: Request, res: Response) => {
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

    

    res.status(200).json(products)
  } catch (error) {
    if(error){
      res.status(500).json({msg : error.message})
    }
  }
}

export const createCartByUserId = async (req: Request, res: Response) => {
  const user_id = req.session['userId'];
  if(!user_id) return res.status(403).json({msg : 'Harap login terlebih dahulu.'})
  const {product_id} = req.params;
  const product = await Manager.findOneBy(Product,{_id : new ObjectId(product_id)})
  product.stock -= 1;
  await Manager.save(Product,product)

  try {
    const cart = new Cart({
      user_id : user_id,
      product_id : new ObjectId(product_id) 
    })
    await Manager.save(Cart,cart)
    res.status(200).json({msg : "Berhasil menambahkan ke keranjang"})
  } catch (error) {
    if(error)return res.status(500).json({msg : error.message})
  }
}