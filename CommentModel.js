import mongoose from "mongoose";

const schema=mongoose.Schema
const userSchema=new schema({
    comment:String,
    author:{type:schema.Types.ObjectId,ref:"users"},
    replies:[{type:schema.Types.ObjectId,ref:"replies"}]

})
const cmtModel = mongoose.model("comments", userSchema)
export default cmtModel 
