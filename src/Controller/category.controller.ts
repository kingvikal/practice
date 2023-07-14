import { Request, Response } from "express";
import logger from "../Utils/logger";
import { Category } from "../Models/category.model";
import { AppDataSource } from "../Database/AppDataSource";
// import { CategoryType } from "../Utils/enums";

const categoryRepo = AppDataSource.getRepository(Category);
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { categoryName } = req.body;

    const category = new Category();
    category.categoryName = categoryName;

    if (category.categoryName === categoryName) {
      return res.status(400).json({ message: "category already created" });
    }

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

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { categoryName } = req.body;
    const { id } = req.params;

    const updateCategory = await categoryRepo
      .createQueryBuilder("category")
      .update(Category)
      .set({ categoryName: categoryName })
      .where({ id: id })
      .execute();

    if (updateCategory.affected === 1) {
      return res.status(200).json({ message: "Update successfull" });
    } else {
      return res
        .status(400)
        .json({ message: "Cannot update or already updated" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletCategory = await categoryRepo
      .createQueryBuilder()
      .delete()
      .from(Category)
      .where({ id: id })
      .execute();

    if (deletCategory.affected === 1) {
      res.status(200).json({ message: "Success delete" });
    } else {
      res.status(400).json({ message: "Cannot delete or already deleted" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const createSubCategory = async (
  req: Request<{ id?: number }, any, { categoryName: string }, any>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const { categoryName } = req.body;

    const parentCategory = await categoryRepo.findOne({
      where: { id: id },
    });

    if (!parentCategory) {
      return res.status(404).json({ message: "Parent category not found" });
    }

    const subcategory = new Category();

    let savedCategory;
    if (parentCategory) {
      subcategory.parentCategory = parentCategory;
      subcategory.categoryName = categoryName;

      savedCategory = await categoryRepo.save(subcategory);
    }

    if (savedCategory) {
      return res
        .status(201)
        .json({ message: "subCategory created", data: savedCategory });
    } else {
      return res.status(400).json({ message: "Cannot create sub category" });
    }
  } catch (err) {
    logger.error("Error while creating sub category");
  }
};

export const getCategory = async (req: Request, res: Response) => {
  try {
    const getCategory = await categoryRepo
      .createQueryBuilder("c")
      .leftJoinAndSelect("c.childCategory", "cc")
      .leftJoinAndSelect("cc.product", "product")
      .addSelect("product.avgRate")
      .getMany();

    if (getCategory) {
      res.status(200).json({ data: getCategory });
    }
  } catch (err) {
    logger.error("Error while getting", err);
    return res.status(500).json(err);
  }
};
