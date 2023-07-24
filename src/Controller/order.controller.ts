import { Request, Response } from "express";
import logger from "../Utils/logger";
import nodemailer from "nodemailer";
import { OrderStatus } from "../Utils/enums";
import { AppDataSource } from "../Database/AppDataSource";
import { Order } from "../Models/order.model";
import { Cart } from "../Models/cart.model";
import { OrderItem } from "../Models/orderItem.model";
import { User } from "../Models/user.model";
import { transporter } from "../Utils/mail.service";

const orderRepo = AppDataSource.getRepository(Order);
const cartRepo = AppDataSource.getRepository(Cart);
const orderItemRepo = AppDataSource.getRepository(OrderItem);
const userRepo = AppDataSource.getRepository(User);
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

export const placeOrder = async (req: UserRequest, res: Response) => {
  try {
    const { cartId, shippingAddress, shippingCharge } = req.body;
    const { id } = req.user;

    const cart = await cartRepo.findOne({
      where: { id: cartId, user: id },
      relations: { cartItem: true },
    });
    if (!cart) {
      return res.status(400).json({ message: "cannot find cart" });
    }

    const totalAmount = cart.cartItem.reduce(
      (total, item) => total + item.total,
      0
    );
    let savedOrder;

    if (cart) {
      const order = new Order();
      order.orderDate = new Date();
      order.shippingAddress = shippingAddress;
      order.shippingCharge = shippingCharge;
      order.status = OrderStatus.ACCEPTED;
      order.totalPrice = totalAmount;
      order.user = cart.user;

      const orderItem = new OrderItem();
      orderItem.productName = cart.cartItem[0].product.productName;
      orderItem.product = cart.cartItem[0].product;
      orderItem.quantity = cart.cartItem[0].quantity;
      orderItem.total = cart.cartItem[0].total;
      orderItem.productSnapshot = {
        productId: cart.cartItem[0].product.id,
        productName: cart.cartItem[0].product.productName,
        price: cart.cartItem[0].product.price,
      };

      savedOrder = await orderRepo.save(order);

      orderItem.order = savedOrder;
      await orderItemRepo.save(orderItem);
    }

    if (savedOrder) {
      return res.status(200).json({
        message: "Order placed successfully",
        savedOrder,
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while placing the order." });
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

export const getOrderDetail = async (req: Request, res: Response) => {
  try {
    const getOrder = await orderRepo.find({});

    if (getOrder) {
      return res.status(200).json({ order: getOrder });
    } else {
      return res.status(400).json({ message: "Cannot find order" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const sendDeliveryEmail = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const { id }: any = req.params;

    const order = await orderRepo.findOne({
      where: { id: id },
    });

    const updateStatus = await orderRepo
      .createQueryBuilder("order")
      .leftJoinAndSelect("order.user", "user")
      .update(Order)
      .set({ status: status })
      .where({ id: id })
      .execute();

    const mailOptions = {
      from: process.env.EMAIL,
      to: order?.shippingAddress.shippedTo,
      subject: "Order Delivery Status",
      text: `Your order with ID ${order?.id} is out for delivery. Thank you for shopping with us!`,
    };

    const mailSend = await transporter.sendMail(mailOptions);

    if (mailSend && order?.status === OrderStatus.DELIVERING) {
      return res.status(200).json({ message: "Mail send Successfully" });
    } else {
      return res.status(400).json({ message: "Problem while sending mail" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
