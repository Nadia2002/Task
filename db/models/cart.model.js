
import mongoose from "mongoose";
const cartSchema = new mongoose.Schema({
  products:[
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      }
    }
  ],
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
    required:true
  }
});

const cartModel = mongoose.model("cart", cartSchema);
export default cartModel
