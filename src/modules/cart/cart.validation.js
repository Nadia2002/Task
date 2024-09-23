import Joi from 'joi';


export const addProductToCart = Joi.object({
  productId: Joi.string().hex().length(24).required().messages({
    'any.required': 'Product ID is required.',
    'string.hex': 'Product ID must be a valid hexadecimal string.',
    'string.length': 'Product ID must be 24 characters long.'
  }),
  quantity: Joi.number().min(1).required().messages({
    'any.required': 'Quantity is required.',
    'number.min': 'Quantity must be at least 1.'
  })
});


export const removeProductFromCart = Joi.object({
  productId: Joi.string().hex().length(24).required().messages({
    'any.required': 'Product ID is required.',
    'string.hex': 'Product ID must be a valid hexadecimal string.',
    'string.length': 'Product ID must be 24 characters long.'
  })
});


export const updateProductQuantity = Joi.object({
  productId: Joi.string().hex().length(24).required(),
  quantity: Joi.number().min(1).required()
});
