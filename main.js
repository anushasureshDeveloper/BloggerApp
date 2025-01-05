import express from "express";
const app=express()
import bodyParser from "body-parser";
import {engine} from "express-handlebars"
import dotenv from "dotenv"
import { DB } from "./connection.js";
import path from "path"
import { dirname } from "path";
import { fileURLToPath } from "url";
import mainRouter from "./router.js";
dotenv.config()
const __dirname=dirname(fileURLToPath(import.meta.url))
app.set("views",path.join(__dirname,"views"))
app.set("view engine","hbs")
app.engine("hbs",engine({extname:"hbs",defaultLayout:"layout",layoutsDir:path.join(__dirname,"views/layout")}))
app.use(bodyParser.urlencoded({extended:false}))
app.use("/images",express.static(path.join(__dirname,"/public/images")))
app.use(bodyParser.json())
app.use("/",mainRouter)

DB()

app.listen(1000) 