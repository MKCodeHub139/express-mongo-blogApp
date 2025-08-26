import 'dotenv/config'
import express from 'express'
import path from 'path'
import userRoute from './routes/user.js';
import blogRouter from './routes/blog.js'
import Blog from './models/blog.js'
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { checkAuthInCookie } from './middlewares/auth.js';

const app = express()
const port = process.env.PORT || 8000
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));
app.set("view engine", "ejs")
app.set('views', path.resolve('./views'))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(checkAuthInCookie('token'))
app.use(express.static(path.resolve('./public')))

app.get('/', async (req, res) => {
    const blogs = await Blog.find({})
    return res.render('home', {
        user: req.user,
        blogs: blogs
    })
})
app.use('/user', userRoute)
app.use('/blog', blogRouter)

app.listen(port, () => console.log(`server started at port http://localhost:${port}`))