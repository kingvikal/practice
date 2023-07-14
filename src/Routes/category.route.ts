import { Router } from "express";
import {
  createCategory,
  createSubCategory,
  deleteCategory,
  getCategory,
  updateCategory,
} from "../Controller/category.controller";
import { IsAdmin, IsAuth } from "../middleware/auth";

const route = Router();

route.get("/get", getCategory);
route.post("/create", createCategory);
route.post("/:id/subcategory", IsAuth, IsAdmin, createSubCategory);
route.put("/:id", IsAuth, IsAdmin, updateCategory);
route.delete("/:id", IsAuth, IsAdmin, deleteCategory);

export default route;
