import mongoose from "mongoose";
const connectionDB= async ()=>{
  return await mongoose.connect("mongodb://127.0.0.1:27017/Nebulax")
  .then(()=>{
    console.log("database connected")
  }).catch((err)=>{
    console.log("database failed to connect",err)
  })
}
export default connectionDB;