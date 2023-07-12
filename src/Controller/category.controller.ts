import { Request, Response } from "express";
import logger from "../Utils/logger";
import { Category } from "../Models/category.model";
import { AppDataSource } from "../Database/AppDataSource";

const categoryRepo = AppDataSource.getRepository(Category);
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { categoryType } = req.body;

    const category = new Category();
    category.categoryType = categoryType;

    const data = await categoryRepo.save(category);
    if (data) {
      res.status(201).json({ message: "category created successfull" });
    } else {
      res.status(400).json({ message: "cannot create category" });
    }
  } catch (err) {
    logger.error("Error while creating category");
    res.status(500).json(err);
  }
};
