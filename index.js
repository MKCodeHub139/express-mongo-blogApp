import express from 'express'
import path from 'path'
import userRoute from './routes/user.js';
import blogRouter from './routes/blog.js'
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { checkAuthInCookie } from './middlewares/auth.js';

const app = express()
const port =8000
mongoose.connect('mongodb://127.0.0.1:27017/devTalk').then(()=>console.log('mongoDb connected successfully'))

app.set("view engine","ejs")
app.set('views',path.resolve('./views'))

app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(checkAuthInCookie('token'))

app.get('/',(req,res)=>{
    return res.render('home',{
        user:req.user,
    })
})
app.use('/user',userRoute)
app.use('/blog',blogRouter)

app.listen(port,()=>console.log(`server started at port http://localhost:${port}`))