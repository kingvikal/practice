import { Router } from "express";
import {
  changeStatusAdmin,
  createOrder,
  trackOrder,
} from "../Controller/order.controller";
import { IsAdmin, IsAuth } from "../middleware/auth";

const route = Router();

route.post("/create", createOrder);
route.put("/change-status", IsAuth, IsAdmin, changeStatusAdmin);
route.get("/track-order", IsAuth, trackOrder);

export default route;
