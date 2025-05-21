import express from "express";
import {
  createCategory,
  getCategories,
  getProductsByCategorySlug,
} from "../controllers/category.controller.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", createCategory);
router.get("/:slug", getProductsByCategorySlug);

export default router;
