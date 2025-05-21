import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom"; // agar routing ishlatayotgan bo‘lsangiz

const slides = [
  {
    id: 1,
    image: "https://images.uzum.uz/d03ljgtpb7f46s87ugug/main_page_banner.jpg",
    alt: "Chegirmalar haftaligi",
    link: "/aksiya",
  },
  {
    id: 2,
    image: "https://images.uzum.uz/d013patpb7fbmqmoge80/main_page_banner.jpg",
    alt: "Elektronika uchun aksiya",
    link: "/elektronika",
  },
  {
    id: 3,
    image: "https://images.uzum.uz/cug7q9tht56sc95cis1g/main_page_banner.jpg",
    alt: "Yozgi mahsulotlar",
    link: "/yozgi",
  },
];

export default function MainSlider() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-screen-xl mx-auto overflow-hidden rounded-xl shadow-md">
      {slides.map((slide, index) => (
        <Link
          to={slide.link}
          key={slide.id}
          className={`block transition-opacity duration-700 ${
            index === current ? "opacity-100" : "opacity-0 absolute"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-[200px] md:h-[350px] object-cover"
          />
        </Link>
      ))}

      {/* Tugmalar */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition"
      >
        <ChevronRight size={20} />
      </button>

      {/* Indicatorlar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === current ? "bg-purple-600" : "bg-gray-300"
            } transition`}
          />
        ))}
      </div>
    </div>
  );
}
