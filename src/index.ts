import { AppDataSource } from "./data-source"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import express from "express"
import cors from "cors"
import routerUser from "./routes/user.route";
import routerProduct from "./routes/product.route";
import routerOTP from "./routes/otp.route";
import routerEJS from "./routes/ejs.route";
import routerPayment from "./routes/payment.route";
import routerCart from "./routes/cart.route";
import session from "express-session"
import path = require("path");
import cron from "node-cron";
import { Manager } from "./utils/Manager";
import { Order } from "./entity/Order";




dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors())

app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(session({
  secret: 'rahasia',
  resave: false,
  saveUninitialized: false,
}));
app.use("/upload", express.static("upload"))
app.use(express.static('public'));




AppDataSource.initialize().then(async () => {
  app.use(routerUser)
  app.use(routerProduct)
  app.use(routerOTP)
  app.use(routerPayment)
  app.use(routerEJS)
  app.use(routerCart)


  

  cron.schedule('* */30 * * * *', async () => {
  const expiredOrders = await Manager.find(Order, {
    where: {
      status: 'Pending',
    },
  });


  for (const order of expiredOrders) {
    console.log(`Membatalkan pesanan dengan ID ${order._id}`);
    order.status = 'Cancelled';
    await Manager.save(Order, order);
  }

  console.log('Cron job: Pesanan yang melebihi 30 menit telah dibatalkan.');
});


  app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
  })

}).catch(error => console.log(error))
