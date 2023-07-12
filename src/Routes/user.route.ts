import { Router } from "express";
import {
  Login,
  Register,
  deleteUser,
  forgotPassword,
  getAllUser,
  getImage,
  getUserById,
  resetPassword,
  updateUser,
  //   uploadImage,
} from "../Controller/user.controller";
import { IsAdmin, IsAuth } from "../middleware/auth";
import upload from "../middleware/multer";

const route = Router();

route.post("/register", upload.single("photo"), Register);
route.post("images", upload.array("images", 2));
route.get("/image/:fileName", getImage);
// route.post("/image", upload.single("avatar"), uploadImage);
route.post("/login", Login);
route.post("/admin/login", IsAdmin, Login);
route.get("/get-all-user", IsAuth, getAllUser);
route.get("/:id", IsAuth, getUserById);
route.put("/:id", IsAuth, updateUser);
route.delete("/:id", IsAuth, deleteUser);
route.post("/reset-password", IsAuth, resetPassword);
route.post("/forgot-password", IsAuth, forgotPassword);
export default route;
