import joi from "joi"



export const addValidation = {
  body:joi.object({
  name:joi.string().alphanum().min(3).max(30).messages({
    "any.required":"!! name is required !!"
  }),
  price:joi.number().min(1).max(100000).messages({
    "any.required":"!! price is required !!"
  }),
  quantity:joi.number().min(1).max(100000).messages({
    "any.required":"!! quantity is required !!"
  }),
  salePrice:joi.number().min(1).max(100000).messages({
    "any.required":"!! salePrice is required !!"
  })
}).options({presence:"required"})

}



export const updateBodyValidation = joi.object({
  name: joi.string().alphanum().min(3).max(30).optional().messages({
    "any.required": "!! name is required !!"
  }),
  price: joi.number().min(1).max(100000).optional().messages({
    "any.required": "!! price is required !!"
  }),
  quantity: joi.number().min(1).max(100000).optional().messages({
    "any.required": "!! quantity is required !!"
  }),
  salePrice: joi.number().min(1).max(100000).optional().messages({
    "any.required": "!! salePrice is required !!"
  })
}).options({ presence: "required"}); 


export const updateParamsValidation = joi.object({
  _id: joi.string().hex().length(24).required().messages({
    "any.required": "!! id of product is required !!",
    "string.hex": "!! id must be a valid hexadecimal string !!",
    "string.length": "!! id must be 24 characters long !!"
  })
}).options({ presence: "required" });