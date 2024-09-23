import cartModel from "../../../db/models/cart.model.js";
import productModel from "../../../db/models/product.model.js";
import { AppError } from "../../utils/classError.js";
import { asyncHandler } from "../../utils/globalErrorHandling.js";

export const addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  let cart = await cartModel.findOne({ userId });

  const product = await productModel.findById(productId);
  if (!product) {
    return res.status(404).json({ msg: "Product not found" });
  }

  const productPrice = product.salePrice || product.price;

  if (!cart) {
    cart = new cartModel({
      userId,
      products: [{ productId, quantity, price: productPrice }],
    });
  } else {
    const productIndex = cart.products.findIndex(
      (product) => product.productId.toString() === productId
    );

    if (productIndex === -1) {
      cart.products.push({ productId, quantity, price: productPrice });
    } else {
      cart.products[productIndex].quantity += quantity;
    }
  }

  await cart.save();

  return res.status(200).json(cart);
});

export const removeProductFromCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;
  const { _id } = req.params;

  console.log("Removing product ID:", productId);
  console.log("From cart ID:", _id);

  let cart = await cartModel.findOne({ _id }).populate("products.productId");

  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  console.log("Current cart products:", cart.products);

  const productIndex = cart.products.findIndex(
    (product) => product.productId._id.toString() === productId
  );

  if (productIndex === -1) {
    return next(new AppError("Product not found in cart", 404));
  }

  cart.products.splice(productIndex, 1);
  await cart.save();

  return res.status(200).json({
    msg: "Product removed from cart",
    cart,
  });
});

export const updateProductQuantity = asyncHandler(async (req, res, next) => {
  const { productId, quantity, _id } = req.body;

  if (quantity < 1) {
    return res.status(400).json({ error: "Quantity must be at least 1" });
  }

  let cart = await cartModel.findOne({ _id });
  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  const productIndex = cart.products.findIndex(
    (product) => product.productId.toString() === productId
  );

  if (productIndex === -1) {
    return res.status(404).json({ error: "Product not found in cart" });
  }

  cart.products[productIndex].quantity = quantity;
  await cart.save();

  return res.status(200).json(cart);
});

export const getCartTotals = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cart = await cartModel
    .findOne({ userId })
    .populate("products.productId");

  if (!cart) {
    return res.status(404).json({ error: "Cart not found" });
  }

  let subtotal = 0;
  let total = 0;

  for (const product of cart.products) {
    const currentProduct = await productModel.findById(product.productId);
    if (!currentProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const price = currentProduct.salePrice || currentProduct.price;
    let discountAmount = 0;

    if (
      currentProduct.discountType === "percentage" &&
      currentProduct.discountValue
    ) {
      discountAmount = (price * currentProduct.discountValue) / 100;
    } else if (
      currentProduct.discountType === "flat" &&
      currentProduct.discountValue
    ) {
      discountAmount = currentProduct.discountValue;
    }

    const discountedPrice = price - discountAmount;

    subtotal += product.price * product.quantity;
    total += discountedPrice * product.quantity;
  }

  return res.status(200).json({
    products: cart.products,
    subtotal,
    total,
  });
});
