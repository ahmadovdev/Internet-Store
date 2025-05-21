import { useEffect } from "react";
import MainSlider from "../components/MainSlider.jsx";
import ProductSection from "../components/ProductSection.jsx";
import { useProductStore } from "../stores/useProductStore";

const HomePage = () => {
  const { featuredProducts, loading, error, fetchFeaturedProducts } =
    useProductStore();
  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-700 text-lg">
        Yuklanmoqda...
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
    <div className="relative min-h-screen overflow-hidden">
      <div className="lg:px-10">
      <MainSlider />
        {featuredProducts && featuredProducts.length > 0 && (
          <ProductSection
            title="🔥 Mashhur mahsulotlar"
            products={featuredProducts}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
