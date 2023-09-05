import { Request,Response } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = async (req: Request, res: Response, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: any, decode: any) => {
    if (err) return res.sendStatus(403);
    (req as any).email = decode.email;
    next();
  });
}
