import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AppDataSource } from "../Database/AppDataSource";
import { User } from "../Models/user.model";

dotenv.config();

const userRepository = AppDataSource.getRepository(User);

interface RequestUser extends Request {
  user?: any;
}
export const IsAuth = async (
  req: RequestUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const reqHeaders = req.headers.authorization;

    const token = reqHeaders && reqHeaders.split(" ")[1];

    if (!token) {
      return res
        .status(400)
        .json({ message: "No token provided. Access Denied" });
    }

    const secretKey = process.env.JWT_SECRET || "";
    const decoded: any = jwt.verify(token, secretKey);

    const user = await userRepository.findOne({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(400).json("invalid");
    }
    req.user = user;

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

export const IsAdmin = async (
  req: RequestUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRole = req.user.userType;

    if (userRole !== "admin") {
      return res.status(403).json({
        message: "Unauthorized!, Admin role is required!",
        success: false,
      });
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

export const IsEmployee = async (
  req: RequestUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRole = req.user.userType;

    if (userRole !== "employee") {
      return res.status(403).json({
        message: "Unauthorized!, Employee role is required!",
        success: false,
      });
    } else {
      next();
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in authorization.", success: false });
  }
};
