import { Request, Response } from "express";
import { Product } from "../entity/Product";
import { Manager } from "../utils/Manager";
import { ObjectId } from "mongodb";
import { Cart } from "../entity/Cart";
import dotenv from "dotenv"
import { Order } from "../entity/Order";
dotenv.config();


import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-08-16',
});




export const checkout = async (req: Request, res: Response) => {
  const userId = req.session['userId'];

  if (!userId) {
    return res.status(403).json({ message: 'Harap login terlebih dahulu.' });
  }

  try {
    const carts = await Manager.find(Cart, {
      where: {
        user_id: userId,
      },
    });

    if (!carts || carts.length === 0) {
      return res.status(400).json({ message: 'Keranjang belanja Anda kosong.' });
    }

    const selectedProducts = carts.map((cart) => cart.product_id.toString());

    const lineItems = [];

    for (const productId of selectedProducts) {
      const product = await Manager.findOneBy(Product, { _id: new ObjectId(productId) });

      if (!product) {
        return res.status(404).json({ message: `Product with id ${productId} not found` });
      }

      const lineItem = {
        price_data: {
          currency: 'sgd',
          product_data: {
            name: product.nama_produk,
          },
          unit_amount: product.price * 100,
        },
        quantity: 1, // Anda bisa menyesuaikan jumlah sesuai kebutuhan
      };

      lineItems.push(lineItem);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3001/success', // Anda bisa menyesuaikan URL sukses
      cancel_url: 'http://localhost:3001/failed', // Anda bisa menyesuaikan URL batal
    });

    for (const [index, productId] of selectedProducts.entries()) {
      const product = await Manager.findOneBy(Product, { _id: new ObjectId(productId) });

      if (!product) {
        return res.status(404).json({ message: `Product with id ${productId} not found` });
      }

      const order = new Order({
        user_id: userId,
        product_id: new ObjectId(productId),
        session_id: session.id,
        status: 'Pending',
        quantity: 1, // Jumlah produk dalam satu pesanan
        totalAmount: product.price * 100, // Hitung total amount per produk
        createdAt: new Date(),
      });

      await Manager.save(Order, order);
    }

    // Hapus produk dari keranjang setelah checkout
    await Manager.delete(Cart, { user_id: userId });

    res.status(200).json({ message: 'Checkout berhasil', url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan saat melakukan checkout.' });
  }
};





//  Menggunakan queue FIFO (first in first out)
export const processOrderQueue = async () => {
  const orderQueue = await Manager.find(Order, {
    where: {
      status: "Pending",
    },
  });

  for (const order of orderQueue) {
    const product = await Manager.findOneBy(Product, { _id: new ObjectId(order.product_id) });

    if (product.stock < order.quantity) {
      console.log(`🔔 Stok produk ${product.nama_produk} tidak mencukupi. Pesanan dibatalkan.`);
      order.status = "Stock habis";
      order.totalAmount = 0;
      await Manager.save(Order, order);
    } else {
      console.log(`✅ Pesanan ${product.nama_produk} berhasil dibeli dengan jumlah ${order.quantity}`);
      product.stock -= order.quantity;
      await Manager.save(Product, product);
      order.status = "Success";
      await Manager.save(Order, order);
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
        await processOrderQueue();
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
