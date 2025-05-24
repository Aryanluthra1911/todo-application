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

const signup_schema =  new mongoose.Schema({
    name:String,
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:String,

});

const task_schema = new mongoose.Schema({
    email:String,
    title:{
        type:String,
        required:true,
    },
    due_date:Date,
    priority:String,
    status:String
})
const credentials = mongoose.model('credentials',signup_schema);
const tasks_credentials = mongoose.model('tasks_credentials',task_schema);

function get_email(token){
    const decode = jwt.verify(token, JWT_SECRET_KEY);
    return decode.email;
}


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

app.get('/task',async(req,res)=>{
    try{
        const token = req.cookies.token;
        const mail = get_email(token)
        const todolist = await tasks_credentials.find({email:mail})
        res.json({
            message:'data fetched',
            data:todolist
        })
    }catch(err){
        res.json({
            message:'error in data finding',
            error:err.message
        })
    }
})

app.get('/dashboard',authenticateToken,(req,res)=>{
    res.sendFile(path.join(__dirname,'public','dashboard','dashboard.html'))
})

app.post('/dashboard',async(req,res)=>{
    const token = req.cookies.token;
    let email = get_email(token);
    let {title,due_date,priority}= req.body;
    let status= 'pending';
    try{
        const new_task = new tasks_credentials({
            email:email,
            title:title,
            due_date:due_date,
            priority:priority,
            status:status,
        })
        await new_task.save()
        return res.json({
            messsage:"data_added"
        })
    }catch(err){
        console.error('Login Error:', err);
    }
})
app.patch('/completed',async(req,res)=>{
    let {title} = req.body;
    try{
        await tasks_credentials.findOneAndUpdate({title}, { status: "completed" });
        res.status(200).send("Task updated")
    }
    catch(err){
        console.log(err);
    }
})
app.delete('/delete',async(req,res)=>{
    let {title} = req.body;
    try{
        await tasks_credentials.findOneAndDelete({ title });
        res.status(200).json({ message: "Task deleted successfully" });
    }
    catch(err){
        console.log(err);
        res.status(500).json({ message: "Error deleting task" });
    }
})
app.post('/details',async(req,res)=>{
    try{
        let {title} = req.body;
        let task_details= await tasks_credentials.findOne({title})
        res.send(task_details);
    }
    catch(err){
        console.error("error" ,err);
    }
    
})
app.get('/',(req,res)=>{
    const token = req.cookies.token;
    if (!token){
        res.sendFile(path.join(__dirname,'public','homepage','homepage.html'))
    }
    else{
        return res.redirect('/dashboard');
    }
})

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
            const token = jwt.sign({email:email , password:hashed_password}, JWT_SECRET_KEY, { expiresIn: '24h' });
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
        const token = jwt.sign({email:email , password:hashed_password}, JWT_SECRET_KEY, { expiresIn: '24h' });
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
            console.log(`http://localhost:` + port);
        });
    }).catch((err)=>{
        console.log("server")
    })