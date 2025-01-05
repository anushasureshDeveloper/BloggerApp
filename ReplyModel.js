import mongoose from "mongoose";

const schema=mongoose.Schema
const userSchema=new schema({
    reply:String,
    author:{type:schema.Types.ObjectId,ref:"users"},
    comment:{type:schema.Types.ObjectId,ref:"comments"}
})
const ReplyModel = mongoose.model("replies", userSchema)
export default ReplyModel