import { Router } from "express";
import {
  createRating,
  deleteRating,
  getRating,
  updateRating,
} from "../Controller/rating.controller";
import { IsAuth } from "../middleware/auth";

const route = Router();

route.post("/create", IsAuth, createRating);
route.get("/get-rating", getRating);
route.put("/update/:id", IsAuth, updateRating);
route.delete("/delete/:id", IsAuth, deleteRating);

export default route;
