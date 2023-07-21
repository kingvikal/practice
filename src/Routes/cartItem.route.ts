import { Router } from "express";
import {
  createCartItem,
  getAllCartItem,
} from "../Controller/cartItem.controller";
import { IsAuth } from "../middleware/auth";

const route = Router();

route.post("/create", IsAuth, createCartItem);
route.get("/get-all", getAllCartItem);

export default route;
