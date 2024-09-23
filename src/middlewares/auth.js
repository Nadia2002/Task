import jwt from "jsonwebtoken"
import userModel from "../../db/models/user.model.js"


export const auth = ()=>{
  return async (req,res,next)=>{
  const{token }= req.headers
  if(!token){
    return res.status(400).json({msg:"invalid token"})
  }
  if(!token.startsWith("ahmed__")){
    return res.status(400).json({msg:"invalid token"})
  }
  const newToken = token.split("ahmed__")[1]
  const decoded = jwt.verify(newToken,"signIn")
  if(!decoded?.id){
    return res.status(400).json({msg:"invalid payload"})
  }
  const user = await userModel.findById(decoded.id)
  if(!user){
    return res.status(409).json({msg:"user not exist "})
  }
  req.user=user

  next()
}
}