import { AppDataSource } from "../Database/AppDataSource";
import { Category } from "../Models/category.model";
import { Product } from "../Models/product.model";
import logger from "../Utils/logger";
import { Request, Response } from "express";

const categoryRepo = AppDataSource.getRepository(Category);
const productRepo = AppDataSource.getRepository(Product);

export const createProduct = async (
  req: Request<
    any,
    any,
    {
      productName: string;
      price: number;
      description: string;
      unit: number;
      photo: any;
      categoryId: number;
    }
  >,
  res: Response
) => {
  try {
    const { categoryId, productName, price, description, unit, photo } =
      req.body;

    const category = await categoryRepo.findOne({ where: { id: categoryId } });

    const product = new Product();
    product.description = description;
    product.productName = productName;
    product.price = price;
    product.unit = unit;
    product.totalPrice = unit * price;
    product.photo = req.file?.path || photo;
    if (category) product.category = category;

    const data = await productRepo.save(product);
    if (data) {
      res.status(201).json({ message: "Product created successfully" });
    } else {
      res.status(400).json({ message: "Cannot create Product" });
    }
  } catch (err) {
    logger.error("error while creating product");
    return res.status(500).json(err);
  }
};
