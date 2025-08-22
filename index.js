import express from 'express'
import path from 'path'
import userRoute from './routes/user.js';
import mongoose from 'mongoose';

const app = express()
const port =8000

app.set("view engine","ejs")
app.set('views',path.resolve('./views'))

app.use(express.urlencoded({extended:false}))
mongoose.connect('mongodb://127.0.0.1:27017/devTalk').then(()=>console.log('mongoDb connected successfully'))

app.get('/',(req,res)=>{
    return res.render('home')
})
app.use('/user',userRoute)

app.listen(port,()=>console.log(`server started at port http://localhost:${port}`))