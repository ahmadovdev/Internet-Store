import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCategoryStore } from "../stores/useCategoryStore";

export default function KatalogDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { categories, loading, error, fetchCategories } = useCategoryStore();

  useEffect(() => {
    if (categories.length === 0 && !loading && !error) {
      fetchCategories();
    }
  }, [categories.length, loading, error, fetchCategories]);

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleCategoryClick = (categoryName) => {
    const categorySlug = categoryName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/categories/${categorySlug}`);
    setIsOpen(false);
  };

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
        onClick={handleButtonClick}
      >
        <Menu size={18} />
        Katalog
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-lg rounded-lg border z-50 p-4">
          {loading && <p className="text-gray-600">Yuklanmoqda...</p>}
          {error && <p className="text-red-500">Xato: {error}</p>}
          {!loading && !error && categories.length > 0 && (
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li
                  key={cat._id}
                  className="hover:bg-gray-100 px-3 py-2 rounded-md cursor-pointer transition"
                  onClick={() => handleCategoryClick(cat.name)}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          )}
          {!loading && !error && categories.length === 0 && (
            <p className="text-gray-600">Kategoriyalar topilmadi.</p>
          )}
        </div>
      )}
    </div>
  );
}
