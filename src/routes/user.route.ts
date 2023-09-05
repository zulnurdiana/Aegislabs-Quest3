import express from "express";
import { verifyToken } from "../middleware/verifyToken";
import { getAllUsers,getUsersById,Register,Login,Logout, refreshToken} from "../controllers/user.controller";

const routerUser = express.Router();


   routerUser.get("/users",verifyToken,getAllUsers)
   routerUser.get("/users/:id",getUsersById)
   routerUser.post("/users",Register)
   routerUser.post("/login", Login)
   routerUser.get("/token", refreshToken)
   routerUser.delete("/logout",Logout)

export default routerUser;