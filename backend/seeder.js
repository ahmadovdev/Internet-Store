import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Product from "./models/product.model.js";
import Category from "./models/category.model.js";
import Comment from "./models/comment.model.js";
import { connectDB } from "./lib/db.js";

dotenv.config();

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const productsFilePath = path.join(__dirname, "data", "products.json");
const commentsFilePath = path.join(__dirname, "data", "comment.json");
let products = [];
let comments = [];

try {
  products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));
  console.log(
    `✅ "${path.basename(productsFilePath)}" fayli muvaffaqiyatli o'qildi.`
  );
} catch (error) {
  console.error(
    `❌ "${path.basename(productsFilePath)}" faylni o'qishda xato: ${
      error.message
    }`
  );
  console.error(
    `Tekshiring: "${productsFilePath}" manzili to'g'rimi va fayl mavjudmi?`
  );
  process.exit(1);
}

try {
  comments = JSON.parse(fs.readFileSync(commentsFilePath, "utf-8"));
  console.log(
    `✅ "${path.basename(commentsFilePath)}" fayli muvaffaqiyatli o'qildi.`
  );
} catch (error) {
  console.error(
    `❌ "${path.basename(commentsFilePath)}" faylni o'qishda xato: ${
      error.message
    }`
  );
  console.error(
    `Tekshiring: "${commentsFilePath}" manzili to'g'rimi, fayl mavjudmi va TO'G'RI JSON ARRAY formatidami?`
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

const importData = async () => {
  try {
    await Product.deleteMany();
    await Category.deleteMany();
    console.log("Bazadagi Product collectioni tozalandi.");
    console.log("Bazadagi Category collectioni tozalandi.");
    console.log("Bazadagi Comment collectioni tozalandi.");

    const uniqueCategories = [
      ...new Set(products.map((product) => product.category)),
    ];

    const categoryDocs = uniqueCategories.map((name) => ({
      name: name,
      slug: createSlug(name),
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

      const categoryMap = new Map(
        createdCategories.map((cat) => [cat.name, cat._id])
      );
      const productsToInsert = [];
      for (const product of products) {
        const categoryId = categoryMap.get(product.category);

        if (!categoryId) {
          console.warn(
            `⚠️ Kategoriya ID topilmadi (Mapda yo'q): "${product.category}". Bu mahsulot o'tkazib yuboriladi: "${product.name}"`
          );
          continue;
        } 
        productsToInsert.push({
          ...product,
          category: categoryId,});
      }

      if (productsToInsert.length > 0) {
        const createdProducts = await Product.insertMany(productsToInsert);
        console.log(
          `✅ ${createdProducts.length} ta mahsulot muvaffaqiyatli kiritildi!`
        );

        console.warn(
          "\n⚠️ OGOHLANTIRISH: comments.json dagi Product IDlar bazaga kiritilgan mahsulotlarning real IDlariga mos kelmasligi mumkin. Sharhlar to'g'ri bog'lanmasligi mumkin!\n"
        ); 

        if (comments.length > 0) {
          await Comment.insertMany(comments);
          console.log(
            `✅ ${comments.length} ta sharh muvaffaqiyatli kiritildi!`
          ); 
        } else {
          console.warn(
            "⚠️ Kiritish uchun sharh topilmadi (comments.json bo'sh yoki o'qilmadi)."
          ); 
        }
      } else {
        console.warn(
          "⚠️ Kiritish uchun mos mahsulot topilmadi (kategoriya topilmagan bo'lishi mumkin)."
        ); 
        if (comments.length > 0) {
          console.warn(
            "⚠️ Mahsulotlar kiritilmadi, ammo sharhlar mavjud. Sharhlar kiritiladi, lekin Product ID'lari noto'g'ri bo'lishi ehtimoli yuqori."
          );
          await Comment.insertMany(comments);
          console.log(
            `✅ ${comments.length} ta sharh muvaffaqiyatli kiritildi (!!! Product ID'lari noto'g'ri bo'lishi mumkin).`
          );
        } else {
          console.warn("⚠️ Kiritish uchun sharh topilmadi.");
        }
      }
    } else {
      console.warn(
        "⚠️ Kiritish uchun mos kategoriya topilmadi (slug yaratilmadi yoki products.json bo'sh)."
      );
      if (comments.length > 0) {
        console.warn(
          "⚠️ Kategoriyalar va mahsulotlar kiritilmadi, ammo sharhlar mavjud. Sharhlar kiritiladi, lekin Product ID'lari va User IDlari (agar Comment schemasida user required bo'lsa) noto'g'ri bo'lishi ehtimoli yuqori."
        );
        await Comment.insertMany(comments);
        console.log(
          `✅ ${comments.length} ta sharh muvaffaqiyatli kiritildi (!!! Product ID'lari va User ID'lari noto'g'ri bo'lishi mumkin).`
        );
      } else {
        console.warn("⚠️ Kiritish uchun sharh topilmadi.");
      }
      console.log(
        "✅ Data kiritish jarayoni yakunlandi (hech qanday data kiritilmagan bo'lishi mumkin)."
      );
    }

    console.log("✅ Data kiritish jarayoni yakunlandi.");
    process.exit();
  } catch (error) {
    console.error(`❌ Data kiritishda xato: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    await Category.deleteMany();
    await Comment.deleteMany(); 
    console.log("🗑️ Data muvaffaqiyatli o'chirildi!");
    process.exit();
  } catch (error) {
    console.error(`❌ Data o'chirishda xato: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
