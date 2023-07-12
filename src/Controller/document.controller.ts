import { Request, Response } from "express";
import { AppDataSource } from "../Database/AppDataSource";
import { UserDocument } from "../Models/document.model";
import { User } from "../Models/user.model";

interface UserRequest extends Request {
  user?: any;
}

const documentRepo = AppDataSource.getRepository(UserDocument);
const userRepo = AppDataSource.getRepository(User);

export const createDocument = async (req: UserRequest, res: Response) => {
  try {
    const { id } = req.user;
    const { type, value, docType } = req.body;

    const user = await userRepo.findOne({ where: { id: id } });

    const userDocument = new UserDocument();
    userDocument.type = type;
    userDocument.value = value;
    userDocument.docType = docType;
    if (user) userDocument.user = user;

    const data = await documentRepo.save(userDocument);

    if (data) {
      res.status(200).json({ message: "Document created successfully", data });
    } else {
      res.status(400).json({ message: "Cannot create document" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
