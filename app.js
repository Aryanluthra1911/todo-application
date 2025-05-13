const path = require('path');
const express = require('express');
const app= express();
const port = 4444;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
const cookie = require('cookie')
var cookieParser = require('cookie-parser')

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname,`public`)));
app.use(express.json());
app.use(cookieParser())

const JWT_SECRET_KEY='HELLO';

function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
        const verified = jwt.verify(token, JWT_SECRET_KEY);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
}

app.get('/dashboard',authenticateToken,(req,res)=>{
    res.sendFile(path.join(__dirname,'public','dashboard','dashboard.html'))
})

app.get('/homepage',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','homepage','homepage.html'))
})
const signup_schema =  new mongoose.Schema({
    name:String,
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:String

});

const credentials = mongoose.model('credentials',signup_schema);

app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public','login_signup','login.html'));
})
app.post('/login',async(req,res)=>{
    let {email,password}=req.body;
    try{
        const user= await credentials.findOne({email})
        if (!user) return res.json({ 
            success: false, 
            message: 'User Not Found' 
        });
        let hashed_password = await bcrypt.hash(password, 12);
        const pass_check= await bcrypt.compare(password,user.password);
        if(pass_check){
            const token = jwt.sign({email:email , password:hashed_password}, JWT_SECRET_KEY, { expiresIn: '11h' });
            res.cookie('token',token,{
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: true
            })
            return res.json({
                success:true,
                message:'login succesfull'
            })
        }
        res.json({
            success:false,
            message:'Incorrect Password'
        })
    }
    catch(err){
        console.error('Login Error:', err);
        res.json({
            success:false,
            message:'Login Falied'
        })
    }
})
app.get('/login_success',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','login_signup','login_page.html'))
})

app.get('/signup',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','login_signup','signup.html'))
})
app.post('/signup',async(req,res)=>{
    let {name,email,password} = req.body;
    try{
        let hashed_password = await bcrypt.hash(password, 12);
        let user = await credentials.findOne({ email });
        if (user) return res.json({ 
            success: false, 
            message: 'Email already exists' 
        });
    
        const New_credentials = new credentials({
            name: name,
            email: email,
            password:hashed_password
        });
        New_credentials.save()
        const token = jwt.sign({email:email , password:hashed_password}, JWT_SECRET_KEY, { expiresIn: '11h' });
        res.cookie('token',token,{
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true
        })
        res.json({ success: true });
    }
    catch(err){
        console.error(err)
    }
})
app.get('/signup_success',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','login_signup','signup_page.html'))
})

app.post('/logout', (req, res) => {
    res.clearCookie('token'); // removes the cookie
    res.json({ success: true, message: 'Logged out' });
});

mongoose.connect('mongodb://localhost:27017/login_credentials')
    .then(()=>{
        console.log('mongodb connected');
        app.listen(port, () => {
            console.log(`http://localhost:` + port +`/homepage`);
        });
    }).catch((err)=>{
        console.log("server")
    })