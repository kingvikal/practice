import { Request, Response } from "express";
import { AppDataSource } from "../Database/AppDataSource";
import { Product } from "../Models/product.model";
import { CartItem } from "../Models/cartItems.model";
import { Cart } from "../Models/cart.model";
import { User } from "../Models/user.model";
import { Order } from "../Models/order.model";

const productRepo = AppDataSource.getRepository(Product);
const cartItemRepo = AppDataSource.getRepository(CartItem);
const cartRepo = AppDataSource.getRepository(Cart);
const userRepo = AppDataSource.getRepository(User);
const orderRepo = AppDataSource.getRepository(Order);

interface UserRequest extends Request {
  user?: any;
}

export const createCartItem = async (req: UserRequest, res: Response) => {
  try {
    const { productId, cartId, quantity } = req.body;
    const { id } = req.user;

    let cart;

    if (cartId) {
      cart = await cartRepo.findOne({ where: { id: cartId } });
    }

    if (!cart) {
      const user = await userRepo.findOne({
        where: { id: id },
      });
      if (!user) {
        return res.status(400).json({ message: "No user found" });
      }

      cart = new Cart();
      cart.user = user;
      cart.itemsCount = 0;
      cart.subtotal = 0;
      await cartRepo.save(cart);
    }

    const product = await productRepo.findOne({ where: { id: productId } });

    if (!product) {
      return res.status(400).json({ message: "No product found" });
    }

    const cartItem = new CartItem();
    cartItem.product = product;
    cartItem.quantity = quantity;
    cartItem.total = product.unit * product.price;
    cartItem.cart = cart;

    const result = await cartItemRepo.save(cartItem);

    if (result) {
      if (product.unit >= quantity) {
        product.unit = product.unit - quantity;

        cart.itemsCount += quantity;
        cart.subtotal += cartItem.total;
        await cartRepo.save(cart);

        return res
          .status(200)
          .json({ message: "Cart Item created successfully", cartItem });
      } else {
        await cartItemRepo.delete(cartItem);
        return res.status(400).json({ message: "Insufficient product units" });
      }
    } else {
      return res.status(400).json({ message: "Cannot create cart Item" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

export const getAllCartItem = async (req: Request, res: Response) => {
  try {
    const cartItem = await cartItemRepo.find({});

    if (cartItem) {
      return res.status(200).json({ cartItem });
    } else {
      return res.status(400).json({ message: "Cannot find cartItem" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};
