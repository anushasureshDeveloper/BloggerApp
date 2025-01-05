import mongoose from "mongoose";

const schema=mongoose.Schema
const userSchema=new schema({
    image:String,
    title:String,
    blogtext:String,
    author:{type:schema.Types.ObjectId,ref:"users"},
    AllComments:[{type:schema.Types.ObjectId,ref:"comments"}],
    likes:[{type:schema.Types.ObjectId,ref:"likes"}]
})
const blogModel = mongoose.model("myblogs", userSchema)
export default blogModel 