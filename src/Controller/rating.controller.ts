import { Request, Response } from "express";
import logger from "../Utils/logger";
import { AppDataSource } from "../Database/AppDataSource";
import { Product } from "../Models/product.model";
import { Rating } from "../Models/rating.model";
import { User } from "../Models/user.model";

interface UserRequest extends Request {
  user?: any;
}
const productRepo = AppDataSource.getRepository(Product);
const ratingRepo = AppDataSource.getRepository(Rating);
const userRepo = AppDataSource.getRepository(User);

export const createRating = async (req: UserRequest, res: Response) => {
  try {
    const { rating, productId } = req.body;
    const userId = req.user.id;

    console.log({ userId });

    const product = await productRepo.findOne({ where: { id: productId } });

    const user = await userRepo.findOne({
      where: { id: userId },
      relations: { rating: true },
    });

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating cannot be less than 1 or more than 5" });
    }

    const existingRating = await ratingRepo.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    if (existingRating) {
      return res
        .status(400)
        .json({ error: "User has already rated this product." });
    }

    if (!product || !user) {
      return res.status(400).json({ message: "Product or User not Found" });
    }

    let result;
    if (product && user) {
      console.log({ user });
      const ratings = new Rating();
      ratings.rating = rating;
      ratings.product = product;
      ratings.user = user;

      result = await ratingRepo.save(ratings);
    }
    if (result) {
      return res.status(200).json({ message: "Rating created successfully" });
    } else {
      return res.status(400).json({ message: "Cannot create Rating" });
    }
  } catch (err) {
    logger.error("Error in creating rating");
    res.status(500).json(err);
  }
};

export const updateRating = async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const { rating } = req.body;

    const updateRating = await ratingRepo
      .createQueryBuilder("rating")
      .update(Rating)
      .set({ rating: rating })
      .where({ id: id })
      .andWhere({ id: userId })
      .execute();

    if (updateRating.affected === 1) {
      res.status(200).json({ message: "Rating updated" });
    } else {
      res
        .status(400)
        .json({ message: "Cannot update rating or already updated" });
    }
  } catch (err) {
    logger.error("Error while updating rating");
  }
};

export const deleteRating = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleteRating = await ratingRepo
      .createQueryBuilder()
      .delete()
      .from(Rating)
      .where({ id: id })
      .execute();

    deleteRating.affected === 1
      ? res.status(200).json({ message: "Rating deleted successfully" })
      : res.status(400).json({ message: "Already deleted or cannot delete" });
  } catch (err) {
    logger.error("Error while deleting rating");
    res.status(500).json(err);
  }
};

export const getRating = async (req: Request, res: Response) => {
  try {
    const ratings = await ratingRepo
      .createQueryBuilder("rating")
      .leftJoinAndSelect("rating.product", "product")
      .leftJoinAndSelect("rating.user", "user")
      .select([
        "rating",
        "product",
        "user.id",
        "user.email",
        "user.firstName",
        "user.lastName",
      ])
      .getMany();

    if (ratings) {
      res.status(200).json({ data: ratings });
    } else {
      res.status(400).json({ message: "Cannot find rating" });
    }
  } catch (err) {
    logger.error("Error while getting", err);
    res.status(500).json(err);
  }
};
