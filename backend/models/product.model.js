import mongoose from "mongoose";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "langchain/document";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

productSchema.statics.findRelevantAI = async function (userQuery) {
  try {
    if (!userQuery || userQuery.trim() === "") return [];

    const products = await this.find({});

    const docs = products.map(
      (product) =>
        new Document({
          pageContent: `${product.name}\n${product.description}`,
          metadata: { id: product._id.toString() },
        })
    );

    const embeddings = new GoogleGenerativeAIEmbeddings({
      modelName: "models/embedding-001",
      apiKey: process.env.GOOGLE_API_KEY,
    });
    const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);

    const results = await vectorStore.similaritySearch(userQuery, 10);
    const relevantIds = results.map((res) => res.metadata.id);

    const relevantProducts = await this.find({ _id: { $in: relevantIds } });

    return relevantProducts;
  } catch (error) {
    console.error("AI qidiruvda xatolik:", error);
    return [];
  }
};

const Product = mongoose.model("Product", productSchema);

export default Product;
