import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Category from "./models/category.model.js"; // Faqat Category modeli kerak
import { connectDB } from "./lib/db.js";

dotenv.config();

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const categoriesFilePath = path.join(__dirname, "data", "categories.json");
let categories = [];

try {
  categories = JSON.parse(fs.readFileSync(categoriesFilePath, "utf-8"));
  console.log(
    `✅ "${path.basename(categoriesFilePath)}" fayli muvaffaqiyatli o'qildi.`
  );
} catch (error) {
  console.error(
    `❌ "${path.basename(categoriesFilePath)}" faylni o'qishda xato: ${
      error.message
    }`
  );
  console.error(
    `Tekshiring: "${categoriesFilePath}" manzili to'g'rimi va fayl mavjudmi?`
  );
  process.exit(1);
}

const createSlug = (name) => {
  if (!name) return null;
  return name
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

const importCategories = async () => {
  try {
    await Category.deleteMany();
    console.log("Bazadagi Category collectioni tozalandi.");

    const categoryDocs = categories.map((cat) => ({
      name: cat.name,
      slug: createSlug(cat.name),
    }));

    const categoriesWithNullSlug = categoryDocs.filter(
      (cat) => cat.slug === null
    );
    if (categoriesWithNullSlug.length > 0) {
      console.warn(
        "⚠️ Quyidagi kategoriyalar uchun slug yaratilmadi (nomi bo'sh bo'lishi mumkin):",
        categoriesWithNullSlug.map((cat) => cat.name)
      );
    }

    const categoriesToInsert = categoryDocs.filter((cat) => cat.slug !== null);

    if (categoriesToInsert.length > 0) {
      const createdCategories = await Category.insertMany(categoriesToInsert);
      console.log(
        `✅ ${createdCategories.length} ta kategoriya muvaffaqiyatli kiritildi!`
      );
    } else {
      console.warn(
        "⚠️ Kiritish uchun mos kategoriya topilmadi (slug yaratilmadi yoki categories.json bo'sh)."
      );
    }

    console.log("✅ Kategoriya kiritish jarayoni yakunlandi.");
    process.exit();
  } catch (error) {
    console.error(`❌ Kategoriya kiritishda xato: ${error.message}`);
    process.exit(1);
  }
};

const destroyCategories = async () => {
  try {
    await Category.deleteMany();
    console.log("🗑️ Category datasi muvaffaqiyatli o'chirildi!");
    process.exit();
  } catch (error) {
    console.error(`❌ Category datani o'chirishda xato: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyCategories();
} else {
  importCategories();
}