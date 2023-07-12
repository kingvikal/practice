import { Router } from "express";
import { createCategory } from "../Controller/category.controller";

const route = Router();

route.post("/create", createCategory);

export default route;
