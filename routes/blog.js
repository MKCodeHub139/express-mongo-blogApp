import { Router } from "express";
import Blog from "../models/blog.js";
import multer from "multer";
import path from 'path'

const router =Router()
const storage =multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.resolve(`/public/uploads`))
    },
    filename:function(req,file,cb){
        const fileName =`${Date.now()}-${file.originalname}`
        cb(null,fileName)
    }
})
const upload =multer({storage:storage})

router.get('/add-blog',upload.single('coverImage'),(req,res)=>{
    return res.render('addBlog')
})
router.post('/',(req,res)=>{
    console.log(req.body)
    console.log(req.file)
    return res.redirect('/')
})

export default router