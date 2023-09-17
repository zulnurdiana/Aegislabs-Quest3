import { Request, Response } from "express";
import { Product } from "../entity/Product";
import { Manager } from "../utils/Manager";
import { ObjectId } from "mongodb";
import dotenv from "dotenv"
import { Order } from "../entity/Order";
dotenv.config();


import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-08-16',
});





export const checkout = async (req : Request, res : Response) => {
    const {quantity} = req.body;
    const {idProduct} = req.params;
    const userId = req.session['userId'];
    if(!userId) return res.status(404).json({msg : `login first`});

    const product = await Manager.findOneBy(Product, {_id : new ObjectId(idProduct)})
    if(!product) return res.status(404).json({msg : `Product with id ${idProduct} not found`});

    if(product.stock < quantity) return res.status(404).json({msg : `product dengan nama ${product.nama_produk} hanya tersisa ${product.stock} pcs`});

    const session = await stripe.checkout.sessions.create({ 
        payment_method_types: ["card"], 
        line_items: [ 
        { 
            price_data: { 
            currency: "sgd", 
            product_data: { 
                name: product.nama_produk, 
              
            }, 
            unit_amount: product.price * 100, 
            }, 
            quantity: quantity, 
        }, 
        ], 
        mode: "payment", 
       success_url: product.stock >= quantity ? "http://localhost:3001/success" : "http://localhost:3001/failed",
        cancel_url: "http://localhost:3001/failed", 
    }); 

    const totalAmount = product.price * quantity;
    const order = new Order({
        user_id : userId,
        product_id : new ObjectId(idProduct),
        session_id : session.id,
        status : "Pending",
        quantity : quantity,
        totalAmount : totalAmount,
        createdAt : new Date(),

    });


    await Manager.save(Order, order);
   

    res.json({ id: session.id, message: "Pembayaran berhasil. Terima kasih atas pesanan Anda!", url : session.url }); 
}



//  Menggunakan queue FIFO (first in first out)
export const processOrderQueue = async () => {
    const orderQueue = await Manager.find(Order,{
      where : {
        status : "Pending"
      }
    })


 if (orderQueue.length > 0) {
    const order = orderQueue[0];
    const product = await Manager.findOneBy(Product, { _id: new ObjectId(order.product_id )});
    if (product.stock < order.quantity) {
      console.log(`🔔 Stok produk ${product.nama_produk} tidak mencukupi. Pesanan dibatalkan.`);
      order.status = "Stock habis"
      order.totalAmount = 0;
      await Manager.save(Order, order);
      orderQueue.shift();
      return;
    } else {
      console.log(`✅ Pesanan ${product.nama_produk} berhasil dibeli dengan jumlah ${order.quantity}`);
      product.stock -= order.quantity;
      await Manager.save(Product, product);
      order.status = "Success";
      await Manager.save(Order, order);
      orderQueue.shift();
      return;
    }
  }
};



export const webhook = async (request: Request, response: Response) => {
  const sig = request.headers['stripe-signature'];
  let event: any;

  const rawBody = request.body.toString()
 
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_KEY);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  switch (event.type) {
      case 'charge.succeeded':
      const chargeSucceeded = event.data.object;
      if(chargeSucceeded){

      }
      break;
      case 'checkout.session.completed':
      const checkoutSessionCompleted = event.data.object;
      if(checkoutSessionCompleted){
        // ubah ke checkout
         processOrderQueue();
      }
      break;
      case 'payment_intent.created':
      const paymentIntentCreated = event.data.object;
      if(paymentIntentCreated){

      }
      break;
      case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      if(paymentIntentSucceeded){

      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

   response.send();
}
