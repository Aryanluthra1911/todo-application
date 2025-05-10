const path = require('path');
const express = require('express');
const app= express();
const port = 4444;

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname,`public`)));
app.use(express.json());

app.get('/homepage',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','homepage.html'))
})

app.listen(port, () => {
    console.log(`http://localhost:${port}/homepage`)
})