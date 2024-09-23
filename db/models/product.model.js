import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: [
     String,
  ],
  quantity: {
    type: Number,
    required: true,
  },
  salePrice: {
    type: Number,
  },
});
const productModel = mongoose.model("product",productSchema)

export default productModel