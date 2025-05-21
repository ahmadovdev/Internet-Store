import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
// import ProductSection from "../components/ProductSection";
import { useCategoryStore } from "../stores/useCategoryStore.js";
// import ProductCard from "../components/ProductCard.jsx";
import ProductSection from "../components/ProductSection.jsx";

const CategoryPage = () => {
  const { slug } = useParams();
  const { products, loading, error, fetchProductsByCategory } =
    useCategoryStore();

  const categoryName = slug
    ? slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    : "";

  useEffect(() => {
    if (slug) {
      fetchProductsByCategory(slug);
    }
  }, [slug, fetchProductsByCategory]);

  console.log("Products state in CategoryPage:", products);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-700 text-lg">
        Mahsulotlar yuklanmoqda...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600 text-lg">
        Xato: {error}
      </div>
    );
  }
  return (
    <div className="min-h-screen ">
      <div className="relative z-10 px-4 sm:px-6 lg:px-8">
        <motion.h1
          className="text-center text-xl sm:text-3xl font-bold text-purple-600 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {categoryName || "Kategoriya"} mahsulotlari
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <ProductSection
            products={products}
          />
        </motion.div>
      </div>
    </div>
  );
};
export default CategoryPage;
