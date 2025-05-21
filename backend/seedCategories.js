// seedCategories.js

// ESM da import qilish
console.log("Skript ishga tushdi!"); 
import mongoose from 'mongoose';
import dotenv from 'dotenv';
// Model yo'lini loyiha tuzilishingizga moslang.
// Agar category.model.js ham ESM bo'lsa, .js kengaytmasi kerak.
import Category from './models/category.model.js'; 

dotenv.config();

const DB_URL = process.env.MONGO_URI || 'mongodb://localhost:27017/internet_store';

const categoriesToInsert = [
    { name: "Elektronika" },
    { name: "Poyabzallar" },
    { name: "Kiyimlar" },
    { name: "Uy Uchun" },
    { name: "Aksesuar" }
];

/**
 * MongoDB ga kategoriyalarni kiritadi.
 * Agar kategoriya allaqachon mavjud bo'lsa, uni o'tkazib yuboradi.
 * @param {string} [mongoUri] - MongoDB ulanish URI'si. Agar ko'rsatilmasa, .env dan yoki standart URI ishlatiladi.
 */

console.log("Skript ishga tushdi! 1"); 
async function seedCategories(mongoUri = DB_URL) {
    try {
        await mongoose.connect(mongoUri);
        console.log('MongoDB ga muvaffaqiyatli ulanildi.');
        
        for (const categoryData of categoriesToInsert) {
            const existingCategory = await Category.findOne({ name: categoryData.name });
            if (existingCategory) {
                console.log(`Kategoriya "${categoryData.name}" allaqachon mavjud. O'tkazib yuborildi.`);
            } else {
                const newCategory = new Category(categoryData);
                await newCategory.save();
                console.log(`Kategoriya "${newCategory.name}" muvaffaqiyatli qo'shildi.`);
            }
        }
        console.log("Skript ishga tushdi! 2"); 

        console.log('Barcha kategoriyalarni qo\'shish jarayoni yakunlandi.');
    } catch (error) {
        console.error('Kategoriyalarni qo\'shishda xato:', error);
        throw error; // Xatolikni yuqoriga uzatish
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB dan uzilish.');
    }
}

// ESM da eksport qilish
export {
    seedCategories,
    categoriesToInsert
};

// Agar skriptni to'g'ridan-to'g'ri ishga tushirganda, kategoriyalarni qo'shish
// Bu qism faqatgina fayl bevosita `node seedCategories.js` orqali chaqirilganda ishlaydi.
// Agar modul sifatida import qilinsa, bu qism ishlamaydi.
if ((process.argv[1], 'file:').href) {
    seedCategories();
}