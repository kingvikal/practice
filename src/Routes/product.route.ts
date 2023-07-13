import { Router } from "express";
import { createProduct, getProduct } from "../Controller/product.controller";
import { IsAdmin, IsAuth } from "../middleware/auth";
import upload from "../middleware/multer";

const route = Router();

route.post("/create", IsAuth, IsAdmin, upload.single("photo"), createProduct);
route.get("/get", getProduct);
export default route;
