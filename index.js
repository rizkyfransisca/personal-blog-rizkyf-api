const express = require('express')
const app = express()
const cors = require('cors')
const articleRoute = require('./routes/articles')
const multer = require('multer')
const path = require('path')
const PORT = process.env.PORT || 5000

// process.env.PORT
// process.env.NODE_ENV => production or undefined

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) =>{
        // images = folder dimana kita akan menyimpan file nya
        cb(null, 'images')
    },
    filename: (req, file, cb) =>{
        // format penamaan file
        cb(null, new Date().getTime() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) =>{
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        cb(null, true)
    }else{
        cb(null, false)
    }
}
// middleware
app.use(express.json()) 
app.use(cors())
// folder static yang bisa di akses dari luar
app.use('/images', express.static(path.join(__dirname, 'images')))
// body yang dikirimkan harus bernama image
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'))

app.get("/", (req,res)=>{
    res.json("Hello World")
})
// app.get('/',(req,res)=>{
//     // var today = new Date()
//     // var dd = String(today.getDate()).padStart(2, '0')
//     // var mm = String(today.getMonth() + 1).padStart(2, '0')
//     // var yyyy = today.getFullYear()
//     // today = dd + '/' + mm + '/' + yyyy
//     res.send(today)
// })

app.use("/api/v1/blog", articleRoute)

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})