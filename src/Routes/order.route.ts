import { Router } from "express";
import {
  changeStatusAdmin,
  getOrderDetail,
  placeOrder,
  sendDeliveryEmail,
  trackOrder,
} from "../Controller/order.controller";
import { IsAdmin, IsAuth } from "../middleware/auth";

const route = Router();

route.post("/place-order", IsAuth, placeOrder);
route.put("/change-status", IsAuth, IsAdmin, changeStatusAdmin);
route.get("/track-order", IsAuth, trackOrder);
route.get("/order-detail", getOrderDetail);
route.put("/send-email/:id", IsAuth, IsAdmin, sendDeliveryEmail);

export default route;
