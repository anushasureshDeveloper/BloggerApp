import express from "express"
import bcrypt from "bcrypt"
import blogModel from "./model.js"
import userDAta from "./usermodel.js"
import cmtModel from "./CommentModel.js"
import crypto from "crypto"
import { log } from "console"
import ReplyModel from "./ReplyModel.js"
import like_model from "./like_model.js"

// let _id
// const id= _id
let currentUser
let CmtReplies=[]
let liked_users = []
let logged_users = [] 
const mainRouter = express.Router()
const secrect = crypto.randomBytes(64).toString('hex')
console.log(secrect);
let salt = 10

mainRouter.get("/", async (req, res) => {
    //populate method

    let Blog = await blogModel.find().populate("author").lean({})

    // console.log("hi", Blog);
    res.render("home", { all: Blog })
})
//goto homepage when click login button
mainRouter.post("/login", async (req, res) => {
    const { email, username, password } = req.body
    const user = await userDAta.findOne({ email: email })
    console.log("user", user); 
    logged_users.push(email)
    console.log(logged_users);
    if (user != null) {
        if (bcrypt.compareSync(password, user.password)) {
            currentUser = user
            res.redirect("/blog_create")
        }
        else {
            res.render("login", { msg: "invalid password" })
        }
    }
    else {
        res.render("login", { msg: "invalid user" })
    }
})


mainRouter.get("/signup", (req, res) => {
    res.render("signup")
})
//goto signup page clicking the link
mainRouter.post("/signup", (req, res) => {
    const { email, username, password } = req.body
    let pwd = bcrypt.hashSync(password, salt)
    let user = new userDAta({
        email: email,
        username: username,
        password: pwd
    })
    user.save()

    res.render("login")
})
//go to home when create a account and login..

mainRouter.get("/login", (req, res) => {
    res.render("login")
})
//display the current users blog using array and check array is empty or not.
mainRouter.get("/myblogs", async (req, res) => {
    if (logged_users.length == 0) {
        res.render("myblogs", { msg: "please login" })
    }
    else {
        let Myblogs = await userDAta.findOne({ email: logged_users[0] }).populate("blogs").lean({})
        res.render("myblogs", { data: Myblogs.blogs })
    }

})

mainRouter.get("/blog_create", (req, res) => {
    res.render("blog_create")
})

mainRouter.post("/blog_create", async (req, res) => {
    const { image, title, blogtext } = req.body
    let NewBlog = new blogModel({
        image: image,
        title: title,
        blogtext: blogtext,
        author: currentUser.id
    })
    const blog = await NewBlog.save()
    console.log(blog,"blog id=");

    await userDAta.findByIdAndUpdate(currentUser._id, { $push: { blogs: blog._id } })
    res.redirect("/")
})

// logout 
mainRouter.get("/logout", (req, res) => {
    logged_users = [] 
    res.redirect("login")
})

mainRouter.get("/blog_view/:id", async (req, res) => {
    const id = req.params.id
    const blog_view = await blogModel.findById(id).populate("author").lean({})
   // const reply_view= await cmtModel.findById(id).populate("replies").lean({})
    const comment_view = await blogModel.findById(id).populate({
        path: "AllComments",
        model: "comments",
        populate: [{
            path: "author",
            model: "users"
        }, 
        {
            path:"replies",
            model:"replies"
        }
    ]
    }).lean({})
    console.log("this is comments",comment_view);
    res.render("blog_view", { data: blog_view, cmt_data: comment_view})

})
//delete blogs 
mainRouter.get("/blog_delete/:id",async(req,res)=>{
    const id =req.params.id

    await blogModel.findByIdAndDelete(id)

    await userDAta.findByIdAndUpdate(currentUser._id,{$pull:{blogs:id}})
    res.redirect("/myblogs")
})
//for viewing the comment section using id.
mainRouter.post("/blog_view/:id", async (req, res) => {
    const { comment } = req.body
    const comment_id = req.params.id
    let cmt = new cmtModel({
        comment: comment,
        author: currentUser._id
    })
    const cmts = await cmt.save()

    await blogModel.findByIdAndUpdate(comment_id, { $push: { AllComments: cmts._id } })
    res.redirect(`/blog_view/${comment_id}`)
})

//comment replies
mainRouter.get("/reply/:id",(req,res)=>{

})

mainRouter.post("/reply/:id",async(req,res)=>{
    const {reply,bId}=req.body
    const id=req.params.id
    // let rly=new ReplyModel({
    //     reply:reply,
    //     author: currentUser._id,
    //     comment:id
    // })
    // const rpls=await rly.save()
    // console.log("replies",rpls);
    console.log("blog Id",bId);
    //await cmtModel.findByIdAndUpdate(req.body.cmtId, { $push: { replies: rpls._id } })
    res.redirect(`/blog_view/${id}`)
    // console.log("replies is",replies);
})



//blog like 
mainRouter.get("/blog_like/:id", async (req, res) => {
    const blog_like=new like_model({
        blogs: req.params.id,
        author:currentUser.id
    })
    const like= await blog_like.save()

    await blogModel.findByIdAndUpdate(req.params.id,{ $push: { likes:like._id } })
    if(currentUser._id==like){
        await blogModel.findByIdAndUpdate(req.params.id,{$pull:{likes:like._id}})
    }
 
    res.redirect(`/blog_view/${req.params.id}`)

})

export default mainRouter