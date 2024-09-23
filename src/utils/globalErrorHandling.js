export const asyncHandler = (fn)=>{
  return (req, res,next)=>{
   fn(req,res,next).catch((err)=>{
    next(err)
    //res.status(500).json({msg:"error",err})
    
   })
   

  }
}