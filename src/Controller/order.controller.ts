import { Request, Response } from "express";
import logger from "../Utils/logger";
import { OrderStatus } from "../Utils/enums";
import { AppDataSource } from "../Database/AppDataSource";
import { User } from "../Models/user.model";
import { Product } from "../Models/product.model";
import { Order } from "../Models/order.model";

const userRepo = AppDataSource.getRepository(User);
const productRepo = AppDataSource.getRepository(Product);
const orderRepo = AppDataSource.getRepository(Order);

interface UserRequest extends Request {
  user?: any;
}

interface OrderField extends UserRequest {
  status: OrderStatus;
  shippedTo: string;
  country: string;
  userId: number;
  productId: number;
}
export const createOrder = async (req: UserRequest, res: Response) => {
  try {
    const { country, productId } = req.body;
    const id = req.user;

    const user = await userRepo.findOne({ where: { id: id } });

    const product = await productRepo.findOne({ where: { id: productId } });

    let result;
    if (user && product) {
      const order = new Order();
      order.shippedTo = user.email;
      order.status = OrderStatus.PLACED;
      order.country = country;
      order.totalPrice = product.unit * product.price;
      order.user = user;
      order.product = product;

      result = await orderRepo.save(order);
    }

    if (result) {
      res.status(200).json({ message: "Order placed successfully" });
    } else {
      res.status(400).json({ message: "Cannot place Order" });
    }
  } catch (err) {
    console.log(err);

    logger.error("Cannot create order");
    res.status(500).json(err);
  }
};

export const changeStatusAdmin = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const changeStatus = await orderRepo
      .createQueryBuilder()
      .update(Order)
      .set({ status: status })
      .where({ id: id })
      .execute();

    if (changeStatus.affected === 1) {
      res.status(200).json({ message: "Status changed" });
    } else {
      res
        .status(400)
        .json({ message: "Cannot change status or already changed" });
    }
  } catch (err) {
    logger.error("error while tracking error");
  }
};

export const trackOrder = async (req: Request, res: Response) => {
  try {
    const track = await orderRepo
      .createQueryBuilder("order")
      .leftJoinAndSelect("order.user", "user")
      .leftJoinAndSelect("order.product", "product")
      .select(["user.email", "user.firstName", "user.lastName", "user.id"])
      .getOne();

    if (track) {
      res.status(200).json({ data: track });
    } else {
      res.status(400).json({ message: "Cannot track order" });
    }
  } catch (err) {
    logger.error("Error while tracking order");
    res.status(500).json(err);
  }
};
