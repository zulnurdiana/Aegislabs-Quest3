import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Product } from "./entity/Product"
import { OTP } from "./entity/OTP"
import { Order } from "./entity/Order"
import { Cart } from "./entity/Cart"


export const AppDataSource = new DataSource({
    type: "mongodb",
    database: "quest3",
    synchronize: true,
    logging: false,
    entities: [User,Product,OTP,Order,Cart],
    migrations: [],
    subscribers: [],
})