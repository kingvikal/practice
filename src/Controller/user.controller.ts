import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import otpGenerator from "otp-generator";
import { RegisterValidate } from "../Validation/joiValidation";
import { AppDataSource } from "../Database/AppDataSource";
import { User } from "../Models/user.model";
import { sendMail } from "../Utils/mail.service";
import twilio from "twilio";
import logger from "../Utils/logger";

interface UserRequest extends Request {
  user?: any;
}
dotenv.config();
const userRepo = AppDataSource.getRepository(User);
export const Register = async (req: Request, res: Response) => {
  try {
    const result = await RegisterValidate.validateAsync(req.body);

    if (!result) {
      return res.status(400).json("Validation error");
    } else {
      const emailUser = await userRepo.findOne({
        where: { email: req.body.email },
      });

      if (emailUser) {
        return res.status(400).json({
          message: `${emailUser.email} already exist in database. choose another one.`,
        });
      }

      const hashedPassword = bcrypt.hashSync(req.body.password, 12);

      const user: any = new User();
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.age = req.body.age;
      user.city = req.body.city;
      user.photo = req.file?.path;
      user.contact = req.body.contact;
      user.email = req.body.email;
      user.password = hashedPassword;
      user.userType = req.body.userType;

      const data = await userRepo.save(user);

      if (data) {
        res.status(200).json({ message: "User created successfully", data });
      }
    }
  } catch (err: any) {
    if (err.isJoi === true) return res.status(422).json(err.details[0].message);
    logger.error("This is error on register");
    return res.status(500).json(err);
  }
};

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await userRepo.findOne({ where: { email: email } });

    if (!user) {
      res.status(400).json({ message: "No user with this email exists" });
    } else {
      const payload: object = {
        id: user.id,
        name: user.firstName,
        role: user.userType,
      };
      const option = { expiresIn: "365d" };
      const secretKey = process.env.JWT_SECRET ? process.env.JWT_SECRET : "";
      const accessToken = jwt.sign(payload, secretKey, option);

      const compare = bcrypt.compareSync(password, user.password);

      if (!compare) {
        return res.status(404).json({ message: "Password doesn't match" });
      } else {
        return res
          .status(200)
          .json({ message: "User login successfull", accessToken, user });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const user = await userRepo.find({});

    if (user) {
      res.status(200).json({ data: user });
    } else {
      res.status(400).json([]);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

export const getUserById = async (
  req: Request<any, any, any>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const user = await userRepo.findOne({ where: { id } });

    if (user) {
      res.status(200).json({ data: user });
    } else {
      res.status(400).json({ message: "cannot find user" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

export const updateUser = async (
  req: Request<any, any, any>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, city, age, contact, photo } = req.body;
    const object: any = {};
    firstName ? (object.firstName = firstName) : "";
    lastName ? (object.lastName = lastName) : "";
    city ? (object.city = city) : "";
    contact ? (object.contact = contact) : "";
    age ? (object.age = age) : "";
    photo ? (object.photo = photo) : "";
    // {
    //         firstName: firstName ? firstName : "",
    //         lastName: lastName ? lastName : "",
    //         city: city ? city : "",
    //         contact: contact ? contact : "",
    //         age: age ? age : "",
    //         photo: photo ? photo : "",
    //       }

    console.log(object);

    const updateUser = await userRepo
      .createQueryBuilder("user")
      .update(User)
      .set(object)
      .where({ id: id })
      .execute()
      .then((data) => {
        if (data.affected === 1) {
          res.status(200).json({ message: "Updated successfully" });
        }
      });

    // .catch((err) => {
    //   console.log(err);

    //   res
    //     .status(400)
    //     .json({ message: "Cannot update or already updated", err });
    // });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

export const deleteUser = async (
  req: Request<any, any, any>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const user = await userRepo
      .createQueryBuilder("user")
      .delete()
      .from(User)
      .where({ id: id })
      .execute();

    if (user.affected === 1) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(400).json({ message: "Already deleted or cannot delete" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

export const forgotPassword = async (
  req: Request<any, any, any>,
  res: Response
) => {
  try {
    const { email } = req.body;
    const user = await userRepo.findOne({ where: email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    } else {
      const payload = [user.id, user.firstName, user.userType];
      const secretKey = process.env.JWT_SECRET || "";
      const token = jwt.sign({ _id: payload }, secretKey, {
        expiresIn: "5m",
      });

      await sendMail(email, token, req.headers.host).then((done) => {
        if (done) {
          return res.send("Reset link has been send, Check Email");
        }
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

export const resetPassword = async (req: UserRequest, res: Response) => {
  try {
    const { email, newPassword, confirmPassword, otp } = req.body;

    const user = await userRepo.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const comparePassword = newPassword === confirmPassword;

    if (!comparePassword) {
      return res.status(400).json({ message: "password must match" });
    }

    if (newPassword && !confirmPassword) {
      return res.status(400).json({ message: "Please enter confirm password" });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 12);

    if (otp !== user.otp) {
      return res.status(400).json({ message: "The OTP doesn't match" });
    }
    user.password = hashedPassword;

    await userRepo.save(user);
    return res.status(200).json({ message: "Password changed successfull" });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

// export const uploadImage = async (req: Request, res: Response) => {
//   try {
//     if (req.file) {
//       res.status(200).json(req.file.filename);
//     }
//   } catch (error) {
//     console.log("error", error);
//     res.status(500).json(error);
//   }
// };

export const getImage = async (
  req: Request<{ fileName: string }, any, any>,
  res: Response
) => {
  try {
    const { fileName } = req.params;
    console.log(path.normalize(__dirname + "/..//upload/pp/" + fileName));
    const photo = __dirname + "/../..//upload/pp/" + fileName;
    res.sendFile(path.normalize(photo));
  } catch (error) {
    res.status(500).json(error);
  }
};

export const sendOTP = async (req: UserRequest, res: Response) => {
  try {
    const { mobileNumber } = req.body;
    const { id } = req.user;
    if (mobileNumber.length !== 14) {
      return res.status(400).json({ message: "Invalid MobileNumber" });
    }

    const accountSID = process.env.SID;

    const authToken = process.env.AUTH_TOKEN;

    const client = twilio(accountSID, authToken);

    function generateOTP(length: any) {
      return otpGenerator.generate(length, {
        digits: true,
      });
    }

    const otp = generateOTP(6);

    await userRepo
      .createQueryBuilder()
      .update(User)
      .set({ otp: otp })
      .where({ id: id })
      .execute();

    const response = await client.messages
      .create({
        body: `Your otp is : ${otp}`,
        from: process.env.TWILIO_NUMBER,
        to: mobileNumber,
      })
      .then(() => {
        return res.status(200).json({ message: "OTP sent successfully" });
      })
      .catch((err) => {
        return res.status(400).json({ message: "Cannot sent OTP", err });
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};
