import express from "express";
import connectionDB from "./db/connectionDB.js";
import { AppError } from "./src/utils/classError.js";
import productRouter from "./src/modules/product/product.routes.js"
import cartRouter from "./src/modules/cart/cart.routes.js"
import userRouter from "./src/modules/user/user.routes.js";
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectionDB();

app.use("/product", productRouter);
app.use("/users", userRouter);
app.use("/cart", cartRouter);

app.use("*", (req, res, next) => {
  //res.status(404).json({msg: `invalid url ${req.originalUrl}`})
  //const err = new Error(`invalid url ${req.originalUrl}`,{cause:404})
  const err = new AppError(`invalid url ${req.originalUrl}`, 404);
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.statuscode || 500).json({ msg: "error thrir", err: err.message });
});
app.listen(3000, () => {
  console.log("server is running on port 3000");
});
