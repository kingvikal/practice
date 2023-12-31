import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { User } from "../Models/user.model";
import { UserDocument } from "../Models/document.model";
import { Product } from "../Models/product.model";
import { Category } from "../Models/category.model";
import { Rating } from "../Models/rating.model";
import { Order } from "../Models/order.model";
import { Cart } from "../Models/cart.model";
import { CartItem } from "../Models/cartItems.model";
import { OrderItem } from "../Models/orderItem.model";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  password: process.env.DB_PASS,
  username: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  synchronize: true,
  entities: [
    User,
    UserDocument,
    Product,
    Category,
    Rating,
    Order,
    Cart,
    CartItem,
    OrderItem,
  ],
});
