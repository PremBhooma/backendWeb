const express = require("express")
const bcrypt = require("bcryptjs")
var jwt = require('jsonwebtoken')
require("dotenv").config()
const cors = require("cors")

const {connection} = require("./config/db")
const {UserModel} = require("./models/User.model")
const {blogsRouter} = require("./routes/blog.routes")
const {authentication} = require("./middlewares/authentication")

const app = express()

app.use(express.json())

app.use(cors())


app.get("/", (req, res) => {
    res.send("Home API")
})

app.post("/signup", async (req, res) => {
    let {name, email, password} = req.body
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, 4, async function(err, hash) {
            const new_user = new UserModel({
                name,
                email,
                password: hash
            })
            try{
                await new_user.save()
                res.send({msg: "signup succesfully"})
            }catch(err){
                console.log(err)
                res.status(500).send("something went Wrong")
            }
        });
    });
})

app.post("/login", async (req, res) => {
    const {email, password} = req.body
    const user = await UserModel.findOne({email})
    if(!user){
        res.send("Do signup")
    }else{
        const hashPassword = user.password
        bcrypt.compare(password, hashPassword, function(err, result) {
            if(result){
                let token = jwt.sign({ user_id: user._id }, process.env.SECRET_KEY);
                res.send({msg: "login successfull", token : token})
            }else{
                res.send("login failed")
            }
        });
    }
})

app.use("/blogs", authentication, blogsRouter)

app.listen(8019, async () => {
    try{    
        await connection
        console.log("DB Connection Succesfully ")
    }catch(err){
        console.log(err)
        console.log("DB Connection failed ")
    }
    console.log("listening on port 8019")
})