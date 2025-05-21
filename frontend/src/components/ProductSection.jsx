import ProductCard from "./ProductCard";

const ProductSection = ({ title, products }) => {
  return (
    <section className="my-8 px-4 md:px-8">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3 lg:gap-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductSection;
