import mongoose from "mongoose";

export const DB=()=>{
    mongoose.connect(process.env.connection_string).then(()=>{
        console.log("DB connected :)");
    }).catch((err)=>{
        console.log(err);
    })
}