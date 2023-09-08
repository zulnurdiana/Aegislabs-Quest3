import { Request, Response } from "express";
import { Product } from "../entity/Product";
import { Manager } from "../utils/Manager";
import { ObjectId } from "mongodb";
import dotenv from "dotenv"
dotenv.config();


import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-08-16',
});


export const checkout = async (req : Request, res : Response) => {
    const {quantity} = req.body;
    const {idProduct} = req.params;
    const product = await Manager.findOneBy(Product, {_id : new ObjectId(idProduct)})
    if(!product) return res.status(404).json({msg : `Product with id ${idProduct} not found`});
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
        success_url: "http://localhost:3001/success", 
        cancel_url: "http://localhost:3001/failed", 
    }); 
   

    res.json({ id: session.id, message: "Pembayaran berhasil. Terima kasih atas pesanan Anda!", url : session.url }); 
}




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
        console.log("berhasil charge");
      }
      break;
      case 'checkout.session.completed':
      const checkoutSessionCompleted = event.data.object;
      if(checkoutSessionCompleted){
        console.log("berhasil checkout");
      }
      break;
      case 'payment_intent.created':
      const paymentIntentCreated = event.data.object;
      if(paymentIntentCreated){
       console.log("berhasil payment created");
      }
      break;
      case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      if(paymentIntentSucceeded){
        console.log("berhasil payment success");
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

}
