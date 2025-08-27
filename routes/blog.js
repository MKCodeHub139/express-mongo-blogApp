import { Router } from "express";
import Blog from "../models/blog.js";
import multer from "multer";
import path from 'path'
import Comment from "../models/comment.js";
import fs from 'fs'

const router =Router()
const storage =multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.resolve(`./public/uploads`))
    },
    filename:function(req,file,cb){
        const fileName =`${Date.now()}-${file.originalname}`
        cb(null,fileName)
    }
})
const upload =multer({storage:storage})

router.get('/add-blog',(req,res)=>{
    return res.render('addBlog',{
                user:req.user,

    })
})
router.get('/my-blogs',async(req,res)=>{
    const myBlogs =await Blog.find({createdBy:req.user._id})
    return res.render('myBlogs',{
        myBlogs,
        user:req.user
    })
})
router.get('/edit/:editId',async(req,res)=>{
    const editBlog = await Blog.findById(req.params.editId)
            
    return res.render('editBlog',{
        editBlog,
        user:req.user
    })
})
router.post('/edit/:editId',upload.single('edit-coverImage'),async(req,res)=>{
    const oldBlog =await Blog.findById(req.params.editId)
    if(req.file && oldBlog.coverImageUrl){
        fs.unlink(`public/${oldBlog.coverImageUrl}`,(err)=>{})
    }
    const newBlog ={}
    if(req.body.title) newBlog.title=req.body.title
    if(req.body.body) newBlog.body=req.body.body
    if(req.file) newBlog.coverImageUrl=`uploads/${req.file.filename}`
    const editBlog =await Blog.findByIdAndUpdate({_id:req.params.editId},{$set:newBlog},{new:true})
    return res.redirect(`/blog/${editBlog._id}`)
})
router.get('/delete/:deleteId',async(req,res)=>{
    const deleteData = await Blog.findById(req.params.deleteId)
    if(deleteData.coverImageUrl){
        fs.unlink(`./public/${deleteData.coverImageUrl}`,(err)=>{})
    }
     await Blog.findByIdAndDelete(req.params.deleteId)
    return res.redirect('/')
})
router.get('/:id',async (req,res)=>{
    const blog =await Blog.findById(req.params.id).populate('createdBy')
    const comments = await Comment.find({blogId:req.params.id}).populate('createdBy')
    return res.render('blog',{
        user:req.user,
        blog:blog,
        comments
    })
})
router.post('/comment/:blogId',async(req,res)=>{
await Comment.create({
        content:req.body.comment,
        blogId:req.params.blogId,
        createdBy:req.user._id
    })
    return res.redirect(`/blog/${req.params.blogId}`)
})

router.post('/',upload.single('coverImage'),async(req,res)=>{
    const {title,body} =req.body
   const blog =await Blog.create({
        title,
        body,
        createdBy:req.user._id,
        coverImageUrl:`uploads/${req.file.filename}`
    })
    console.log(blog)
    return res.redirect(`/blog/${blog._id}`)
})

export default router