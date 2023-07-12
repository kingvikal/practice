import { Router } from "express";
import { createDocument } from "../Controller/document.controller";

const route = Router();

route.post("/create-document", createDocument);

export default route;
