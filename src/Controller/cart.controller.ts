import { Request, Response } from "express";
import { AppDataSource } from "../Database/AppDataSource";
import { Cart } from "../Models/cart.model";

const cartRepo = AppDataSource.getRepository(Cart);
export const getCart = async (req: Request, res: Response) => {
  try {
    const cart = await cartRepo.find({
      relations: { cartItem: { product: true } },
    });

    if (cart) {
      return res.status(200).json({ cart });
    } else {
      return res.status(400).json({ message: "Cart not found" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const deleteCart = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleteCart = await cartRepo
      .createQueryBuilder("cart")
      .delete()
      .from(Cart)
      .where({ id: id })
      .execute();

    if (deleteCart.affected === 1) {
      return res.status(200).json({ message: "Cart deleted successfully" });
    } else {
      return res
        .status(400)
        .json({ message: "Already deleted or cannot delete" });
    }
  } catch (err) {
    console.log(err);

    return res.status(500).json(err);
  }
};
