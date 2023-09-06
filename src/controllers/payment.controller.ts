import { Request, Response } from "express";
import { Product } from "../entity/Product";
import { Manager } from "../utils/Manager";
import { ObjectId } from "mongodb";
import dotenv from "dotenv"
import { sendNotificationToClients } from "..";
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
            currency: "usd", 
            product_data: { 
                name: product.nama_produk, 
              
            }, 
            unit_amount: product.price * 100, 
            }, 
            quantity: quantity, 
        }, 
        ], 
        mode: "payment", 
        success_url: "http://localhost:3001/order/success", 
        cancel_url: "http://localhost:3000/cancel", 
    }); 
     // Mengirim notifikasi ke semua klien terhubung
    sendNotificationToClients({ message: 'Pembayaran berhasil' });

    res.json({ id: session.id, message: "Pembayaran berhasil. Terima kasih atas pesanan Anda!", url : session.url }); 
}

export const orderSuccess = async (req : Request, res : Response) => {
  res.send(`<html><body><h1>Thanks for your order,!</h1></body></html>`)
  
}



export const webhook = async (request: Request, response: Response) => {
  const sig = request.headers['stripe-signature'];

  let event: any;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_KEY);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
        const checkoutSessionCompleted = event.data.object;
        console.log('Checkout berhasil selesai:', checkoutSessionCompleted);
        sendNotificationToClients({ type: 'checkout_completed', data: checkoutSessionCompleted });
        break;
    case 'checkout.session.expired':
        const checkoutSessionExpired = event.data.object;
        console.log('Checkout telah kedaluwarsa:', checkoutSessionExpired);
        sendNotificationToClients({ type: 'checkout_expired', data: checkoutSessionExpired });
        break;
    case 'payment_intent.succeeded':
        const paymentIntentSucceeded = event.data.object;
        console.log('Payment Intent berhasil:', paymentIntentSucceeded);
        sendNotificationToClients({ type: 'payment_intent_succeeded', data: paymentIntentSucceeded });
        break;
    case 'payment_intent.payment_failed':
        const paymentIntentPaymentFailed = event.data.object;
        console.log('Payment Intent gagal:', paymentIntentPaymentFailed);
        sendNotificationToClients({ type: 'payment_intent_payment_failed', data: paymentIntentPaymentFailed });
        break;
    // ... Anda dapat menambahkan penanganan untuk jenis peristiwa lainnya di sini
    default:
        console.log(`Tipe peristiwa yang tidak ditangani: ${event.type}`);
}


  // Kirim respons 200 untuk mengakui penerimaan peristiwa
  response.send();
}
