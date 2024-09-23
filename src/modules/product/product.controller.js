import productModel from "../../../db/models/product.model.js"
import { AppError } from "../../utils/classError.js"
import {asyncHandler} from "../../utils/globalErrorHandling.js"
import fs from "fs"


export const addProduct = asyncHandler (async (req,res,next)=>{
  const {name, price, quantity, salePrice }= req.body
  if (!req.file) {
    return next(new AppError("Image file is required", 400));
  }
  const imageBuffer = fs.readFileSync(req.file.path);
   
  
  const product = await productModel.create({name, price, quantity, salePrice , image: imageBuffer  })
  if(!product){
    return next( AppError("failed to add this product",404))
  }
  res.status(201).json({msg:"product is added sucessfully",product})

})
export const updateProduct = asyncHandler(async(req,res,next)=>{
  const{_id}= req.params
  const {name, price, quantity, salePrice }= req.body
  const productExist = await productModel.findById(_id)
  
  if(!productExist){
    return next(AppError("This product can not found to edit"))
  }
  const product = await productModel.findByIdAndUpdate({_id},{name:name, price:price, quantity:quantity, salePrice:salePrice },{ new: true })
  res.status(200).json({msg:"product is updated sucessfully"})
})

export const deleteProduct = asyncHandler(async(req,res,next)=>{
  const{_id}= req.params
  const productExist = await productModel.findById(_id)
  if(!productExist){
    return next(AppError("This product can not found to delete"))
  }
  const product = await productModel.findByIdAndDelete(_id)
  res.status(200).json({msg:"product is deleted sucessfully"})
})