import { Request, Response } from "express";
import { User } from "../entity/User";
import { Product } from "../entity/Product";
import { Manager } from "../utils/Manager";
import fs from "fs"
import { ObjectId } from "mongodb";
import Joi from "joi";




export const getAllProductByUsers = async (req : Request, res : Response) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.status(400).json({msg: "Harap login terlebih dahulu"});
    const user = await Manager.findOneBy(User, {refresh_token : refreshToken});
    try {
    const Products = await Manager.find(Product, {where : {user_id : user._id}});
         res.json(Products)
    } catch (error) {
        console.log(error);
        
    }
   

}

export const getSingleProductById = async (req : Request, res : Response) => {
    const {id} = req.params;
    try {
    const Products = await Manager.findOneBy(Product, {_id : new ObjectId(id)});
    if(!Products) return res.status(404).json({msg : `Product with id ${id} not found`});
    res.status(200).json(Products);
    } catch (error) {
        
    }
   
}


export const createProduct = async (req : Request, res : Response) => {
    const schema = Joi.object({
        nama_produk : Joi.string().required(),
        price : Joi.number().required(),
    })
    const {error} = schema.validate(req.body);
    if(error){ 
        return res.status(400).json({msg : error.details[0].message});
    }
    const {nama_produk, price} = req.body;
    if(!nama_produk) return res.status(400).json({msg: "Nama produk tidak boleh kosong"});
    if(!price) return res.status(400).json({msg: "Harga tidak boleh kosong"});

    const domain = process.env.DOMAIN || 'http://localhost:3001';
    const path = req.file.path;
    const cleanedPath = path.replace(/upload[\/\\]/i, "");
    const fullURL = `${domain}/upload/${cleanedPath}`;
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken) return res.status(400).json({msg: "Harap login terlebih dahulu"});
    const Users = await Manager.findOneBy(User, {refresh_token : refreshToken});
    if(!Users) return res.sendStatus(403);

    try {   
        const product = new Product({
                nama_produk: nama_produk,
                price: price,
                img_url: fullURL,
                user_id: Users._id
            });

        await Manager.save(product);

        res.json({
            message : "Berhasil membuat product baru"
        });
    } catch (error) {
       console.log(error.message);
       
    }

};

export const deleteProductById = async (req : Request, res : Response) => {
    const {id}= req.params;
    const Products = await Manager.findOneBy(Product, {_id : new ObjectId(id) });
    const pathDeleted = "upload/"+ Products.img_url;
    if(!Products) return res.status(404).json({msg : `Product with id ${id} not found`});
    try {
        await Manager.delete(Product, { _id : new ObjectId(Products._id)});
        fs.unlink(pathDeleted, (err) => {
            if(err) throw err;
        })
        res.status(200).json({msg : `Product with nama ${Products.nama_produk} has been deleted`});
    } catch (error) {
        console.log(error.message);
        
    }
}

export const updateProductById = async (req : Request, res : Response) => {
    const {id} = req.params;
    const product = await Manager.findOneBy(Product, {_id : new ObjectId(id)});
    if(!product) return res.status(404).json({msg : `Product with id ${id} not found`});

    let {nama_produk} = req.body;
    let {price} = req.body;
    
    if(!nama_produk) {
        nama_produk = product.nama_produk
    }
    if(!price) {
        price = product.price
    }

    let data = {
        nama_produk : nama_produk,
        price : price
    }
  
    try {
        await Manager.update(Product, { _id : new ObjectId(product._id)}, data);
        res.status(200).json({msg : `Product with nama ${product.nama_produk} has been updated`});
    } catch (error) {
        console.log(error.message);
        
    }
}