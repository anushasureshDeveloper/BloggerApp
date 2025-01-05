import mongoose from "mongoose";

const schema=mongoose.Schema
const userSchema=new schema({
    author:{type:schema.Types.ObjectId,ref:"users"},
    blogs:[{type:schema.Types.ObjectId,ref:"myblogs"}]
})
const like_model = mongoose.model("likes", userSchema)
export default like_model
         