const Section = ({ title, products }) => {
  return (
    <section className="py-8 px-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {product.name}
              </h3>
              <p className="text-emerald-600 font-bold">{product.price} so‘m</p>
              <button className="mt-2 w-full bg-emerald-600 text-white py-2 px-4 rounded hover:bg-emerald-700 transition duration-300">
                Savatga qoshish
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Section;
