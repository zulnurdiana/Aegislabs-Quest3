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
    url: "mongodb://zulnurdiana:0GCkJ5UJPfuA4N8A@ac-dr9rqg0-shard-00-00.w67zqzg.mongodb.net:27017,ac-dr9rqg0-shard-00-01.w67zqzg.mongodb.net:27017,ac-dr9rqg0-shard-00-02.w67zqzg.mongodb.net:27017/?ssl=true&replicaSet=atlas-ial56o-shard-0&authSource=admin&retryWrites=true&w=majority",
    synchronize: true,
    logging: false,
    ssl: true,
    authSource: "admin",
    useNewUrlParser: true,
    entities: [User,Product,OTP,Order,Cart],
    migrations: [],
    subscribers: [],
})