import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import userRoute from "./Routes/user.route";
import documentRoute from "./Routes/document.route";
import categoryRoute from "./Routes/category.route";
import productRoute from "./Routes/product.route";
import ratingRoute from "./Routes/rating.route";
import { AppDataSource } from "./Database/AppDataSource";
import logger from "./Utils/logger";
import expressWinston from "express-winston";

const app = express();

dotenv.config();
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressWinston.logger({ winstonInstance: logger, statusLevels: true }));

app.use("/upload", express.static("upload"));

app.use("/user", userRoute);
app.use("/document", documentRoute);
app.use("/category", categoryRoute);
app.use("/product", productRoute);
app.use("/rating", ratingRoute);

app.listen(process.env.PORT || 8080, async () => {
  await AppDataSource.initialize()
    .then(() => {
      console.log("DB connected");
    })
    .catch((e) => console.log("Error connecting database", e));

  console.log("connected to Server", process.env.PORT);
});
