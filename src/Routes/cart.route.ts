import { Router } from "express";
import { deleteCart, getCart } from "../Controller/cart.controller";

const route = Router();

route.get("/get-cart", getCart);
route.delete("/delete-cart", deleteCart);

export default route;
