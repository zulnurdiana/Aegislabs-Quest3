import express from "express";
import { verifyToken } from "../middleware/verifyToken";
import { getAllUsers,getUsersById,Register,Login,Logout, refreshToken} from "../controllers/user.controller";
import { AppDataSource } from "../data-source";
const routerUser = express.Router();

AppDataSource.initialize().then(async () => {
     routerUser.get("/users",verifyToken,getAllUsers)
   routerUser.get("/users/:id",getUsersById)
   routerUser.post("/register",Register)
   routerUser.post("/login", Login)
   routerUser.get("/token", refreshToken)
   routerUser.delete("/logout",Logout)

}).catch(error => console.log(error))




export default routerUser;