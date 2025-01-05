import mongoose from "mongoose";

const schema=mongoose.Schema
const userSchema=new schema({
    email:String,
    username:String,
    password:String,
    blogs:[{type:schema.Types.ObjectId,ref:"myblogs"}]
})
const userDAta = mongoose.model("users", userSchema)
export default userDAta