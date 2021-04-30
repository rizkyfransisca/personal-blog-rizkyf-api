const router = require('express').Router()
const pool = require("../db")
const slugify = require('slugify')
const domPurifier = require('dompurify')
const { JSDOM } = require('jsdom')
const htmlPurify = domPurifier(new JSDOM().window)
const fs = require('fs')
const {promisify} = require('util')
const unlinkAsync = promisify(fs.unlink)

router.get("/", async(req,res)=>{
    try {
        const articles = await pool.query("SELECT blog_id, title, author, description, to_char(timeCreated, 'DD-MM-YYYY') as timeCreated,slug,image FROM blogs")
        res.status(200).json({"status" : 200, "message" : "Success Get All Articles", "result" : articles.rows})
    } catch (err) {
        console.log(err.message);
        res.status(500).send("SERVER ERROR")
    }
})

router.get("/:slug", async(req,res)=>{
    try {
        const {slug} = req.params
        const article = await pool.query("SELECT blog_id, title, author, description, to_char(timeCreated, 'DD-MM-YYYY') as timeCreated,slug,image FROM blogs WHERE slug = $1", [slug])
        res.status(200).json({"status" : 200, "message" : "Success Get One Article", "result" : article.rows[0]})
    } catch (err) {
        console.error(err.message)
    }
})

router.post("/", async(req,res)=>{
    try {
        if(!req.file){
            const err = new Error('Image Harus Di Upload')
            err.errorStatus = 422
            throw err
        }
        const image = req.file.filename
        const {title,author,description} = req.body
        const slug = slugify(title, {lower: true, strict: true})
        const timeCreated = new Date()
        const sanitizeDescription = htmlPurify.sanitize(description)
        const newArticle = await pool.query("INSERT INTO blogs (title, author, description, timeCreated, slug, image) VALUES($1, $2, $3, $4, $5, $6) RETURNING *", [title,author,sanitizeDescription,timeCreated,slug,image])
        res.status(201).json({"status" : 201, "message" : "Success Create New Article", "result" : newArticle.rows[0]})
    } catch (err) {
        console.error(err.message)
    }
})

router.put("/:id", async(req,res)=>{
    try {
        const {id} = req.params
        const {title,author,description} = req.body
        if(!req.file){
            const err = new Error('Image Harus Di Upload')
            err.errorStatus = 422
            throw err
        }
        const image = req.file.filename
        const findOldImage = await pool.query("SELECT image FROM blogs WHERE blog_id = $1", [id])
        await unlinkAsync('images/' + findOldImage.rows[0].image)
        const slug = slugify(title, {lower: true, strict: true})
        const sanitizeDescription = htmlPurify.sanitize(description)
        const updateArticle = await pool.query("UPDATE blogs SET title = $1, author = $2, description = $3, slug = $4, image = $5 WHERE blog_id = $6 RETURNING *", [title, author, sanitizeDescription, slug,image, id])
        res.status(201).json({"status" : 201, "message" : "Success Update Article", "result" : updateArticle.rows[0]})
    } catch (err) {
        console.error(err.message)
    }
})

router.delete("/:id", async(req,res)=>{
    try {
        const {id} = req.params
        const deleteArticle = await pool.query("DELETE FROM blogs WHERE blog_id = $1 RETURNING *",[id])
        await unlinkAsync('images/' + deleteArticle.rows[0].image)
        res.status(200).json({"status" : 200, "message" : "Success Delete Article", "result" : true})
    } catch (err) {
        console.error(err.message)
    }
})

module.exports = router