import { Router } from "express";
import { createProduct } from "../Controller/product.controller";
import { IsAdmin, IsAuth } from "../middleware/auth";
import upload from "../middleware/multer";

const route = Router();

route.post("/create", IsAuth, IsAdmin, upload.single("photo"), createProduct);

export default route;
