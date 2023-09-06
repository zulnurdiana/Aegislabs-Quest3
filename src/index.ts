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
import session from "express-session"
import http from "http"
import socketIo from "socket.io";
import path = require("path");


dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(session({
  secret: 'rahasia', 
  resave: false,
  saveUninitialized: false,
}));
app.use("/upload",express.static("upload"))
app.use(express.static('public'));

AppDataSource.initialize().then(async () => {
    app.use(routerUser)
    app.use(routerProduct)
    app.use(routerOTP)
    app.use(routerPayment)
    app.use(routerEJS)


    app.listen(port, () => {
        console.log(`server running at http://localhost:${port}`);
    })
   
}).catch(error => console.log(error))
