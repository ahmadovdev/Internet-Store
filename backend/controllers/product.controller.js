import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";

export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find({}).populate('category'); 
		res.json({ products });
	} catch (error) {
		console.log("Error in getAllProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getFeaturedProducts = async (req, res) => {
	try {
		let featuredProducts = await redis.get("featured_products");
		if (featuredProducts) {
			return res.json(JSON.parse(featuredProducts));
		}
		featuredProducts = await Product.find({ isFeatured: true }).lean();

		if (!featuredProducts) {
			return res.status(404).json({ message: "No featured products found" });
		}

		await redis.set("featured_products", JSON.stringify(featuredProducts));

		res.json(featuredProducts);
	} catch (error) {
		console.log("Error in getFeaturedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const createProduct = async (req, res) => {
	const { name, description, price, category, image } = req.body;
  
	try {
	  const categoryObject = await Category.findOne({ name: category });
  
	  if (!categoryObject) {
		  return res.status(400).json({ message: 'Noto\'g\'ri kategoriya nomi' });
	  }
  
	  let imageUrl = '';
	  
	  if (image && image.startsWith('data:image')) {
		  const uploadResult = await cloudinary.uploader.upload(image, {
			  folder: 'products',
		  });
		  imageUrl = uploadResult.secure_url;
	  } else if (image) {
		  imageUrl = image;
	  } else {
		   return res.status(400).json({ message: 'Rasm majburiy' });
	  }
  
	  const product = new Product({
		name,
		description,
		price,
		category: categoryObject._id, 
		image: imageUrl,
	  });
  
	  const createdProduct = await product.save();
  
	  res.status(201).json(createdProduct);
  
	} catch (error) {
	  console.error("Error in createProduct controller:", error);
	  res.status(500).json({ message: error.message || "Mahsulot yaratishda server xatosi" });
	}
  };
  
export const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		if (product.image) {
			const publicId = product.image.split("/").pop().split(".")[0];
			try {
				await cloudinary.uploader.destroy(`products/${publicId}`);
				console.log("deleted image from cloduinary");
			} catch (error) {
				console.log("error deleting image from cloduinary", error);
			}
		}

		await Product.findByIdAndDelete(req.params.id);

		res.json({ message: "Product deleted successfully" });
	} catch (error) {
		console.log("Error in deleteProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getRecommendedProducts = async (req, res) => {
	try {
		const products = await Product.aggregate([
			{
				$sample: { size: 4 },
			},
			{
				$project: {
					_id: 1,
					name: 1,
					description: 1,
					image: 1,
					price: 1,
				},
			},
		]);

		res.json(products);
	} catch (error) {
		console.log("Error in getRecommendedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const toggleFeaturedProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			product.isFeatured = !product.isFeatured;
			const updatedProduct = await product.save();
			await updateFeaturedProductsCache();
			res.json(updatedProduct);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.log("Error in toggleFeaturedProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getProductById = async (req, res) => {
	try {
	  const product = await Product.findById(req.params.id);
  
	  if (product) {
		res.json(product);
	  } else {
		res.status(404).json({ message: 'Mahsulot topilmadi' });
	  }
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ message: 'Server xatosi' });
	}
  };

async function updateFeaturedProductsCache() {
	try {
		const featuredProducts = await Product.find({ isFeatured: true }).lean();
		await redis.set("featured_products", JSON.stringify(featuredProducts));
	} catch (error) {
		console.log("error in update cache function");
	}
}

export const searchProducts = async (req, res) => {
    try {
        const searchQuery = req.query.q;

        if (!searchQuery) {
            return res.status(400).json({ message: "Qidiruv so'rovi kiritilmagan" });
        }

        const products = await Product.find({
            $or: [ 
                { name: { $regex: searchQuery, $options: 'i' } }, 
                { description: { $regex: searchQuery, $options: 'i' } }
            ]
        });

        res.json(products);

    } catch (error) {
        console.error(`Search Products Error: ${error.message}`);
        res.status(500).json({ message: 'Server xatosi: Mahsulotlarni qidirishda muammo yuz berdi' });
    }
};