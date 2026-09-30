const db = require("../db/query")
const bcrypt = require("bcryptjs")
const {validationResult}= require("express-validator")
require("dotenv").config();



async function gethome(req,res) {

    const SearchQuery = req.query.search
    let messages;
    if(SearchQuery){
        messages= await db.searchMessages(SearchQuery)
    }else{
        messages= await db.getmessageUser()
    }
    res.render("index", { messages:messages,user:req.user})

   
}

const createUsersPost = async (req, res) => {
const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // If passwords don't match, or a field is empty, send them back to the form
    // and pass the errors array so you can show them what went wrong
    return res.render("sign-up-form", { 
      errors: errors.array() 
    });
  }
  
  try {
    // 1. Controller hashes the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    // 2. Controller passes the already-hashed password to the DB function
    await db.InsertUser(req.body.first_name, req.body.last_name, req.body.username, hashedPassword);
    
    // 3. Controller sends the response
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to create Users.")
  }
};

const createUsersGet = (req,res)=>{
    res.render("form")
}
const loginGet = (req,res)=>{
  res.render("log-in")
}

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}
async function getMessage(req,res) {
    const SearchQuery = req.query.search
    let messages;
    if(SearchQuery){
        messages= await db.searchMessages(SearchQuery)
    }else{
        messages= await db.getmessageUser()
    }
    res.render("index", { title: "Mini Messageboard", messages:messages})
}

 function CreateMessageGet(req,res) {
    res.render("form")
}

async function CreateMessagePost(req,res) {
  const user_id = req.user.id;
    const {title,text}= req.body;
    await db.InsertMesssage(user_id,text,title);
    res.redirect("/");
}

async function DeleteMessagePost(req,res) {
    const messagesid = req.params.id
    await db.DeleteMessage(messagesid)
    res.redirect("/");
}

async function joinmembershipPost(req,res) {
const password = process.env.PASSWORD_MEMBER;
const inputpassw = req.body.password;
if(inputpassw===password){
  try{
    const userid = req.user.id
    await db.joinmembership(userid)
    res.redirect("/")
  }catch (error){
    console.log(error)
  }
}else{
  res.redirect("/")
}
}
async function beadmin(req,res) {
  const password = process.env.PASSWORD_ADMIN
  const inputpassw = req.body.password
  if(inputpassw===password){
    try{
        const userid = req.user.id
        await db.beadmin(userid)
        res.redirect("/")
    }catch(error){
      console.log(error)
    }
  }else{
    res.redirect("/")
  }
}

module.exports={gethome,createUsersPost,createUsersGet,logout,loginGet,getMessage,CreateMessageGet,CreateMessagePost,DeleteMessagePost,joinmembershipPost,beadmin}