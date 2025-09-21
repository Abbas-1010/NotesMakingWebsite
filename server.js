const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.set("view engine", "ejs");

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ MongoDB Connection with explicit DB name
mongoose.connect('mongodb://localhost:27017/bookNotes', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected to 'bookNotes'"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));
const bookSchema = new mongoose.Schema({}, { strict: false });

// ✅ Explicit collection name = 'courses'
const book = mongoose.model('Books', bookSchema, 'books');

app.get('/',async (req,res)=>{
    try{
        var bks=await book.find()
    }catch(err){

    }
    res.render('notes',{bookslist:bks})
})
app.get('/create',(req,res)=>{
    res.render('createNotes')
})

app.get('/create-note',async (req,res)=>{
    const bk=req.query
    try{
        const newbookNote=new book(bk)
        newbookNote.save()
        console.log("New note added")
    }catch(err){
        console.log("problem in saving new note")
    }
    res.redirect('/')
})
app.get('/update',async (req,res)=>{
    try{
        var bks=await book.find()
    }catch(err){

    }
    res.render('update',{bookslist:bks})
})
app.get('/update-note',async (req,res)=>{
    const titleofbook=req.query.bookt
    try{
        var dataofbook=await book.findOne({bookTitle:titleofbook})
        //console.log(dataofbook)
    }catch(err){
        console.log(err)
    }
    res.render('updateNotesData',{dab:dataofbook})
})
app.get('/upNote',async (req,res)=>{
    const bk=req.query
    try{
        await book.updateOne(
            { bookTitle:bk.oldt },
            { $set: { bookTitle:bk.booktitle,brief:bk.brief,linkofbook:bk.linkofbook,notes:bk.notes } }
        );
        console.log(book.find())
    }catch(err){}
    res.redirect('/')
})
app.get('/delete',async (req,res)=>{
    try{
        var bks=await book.find()
    }catch(err){

    }
    res.render('deletenotes',{bookslist:bks})
})
app.get('/delNote',async(req,res)=>{
    const bti=req.query
    try{
        await book.deleteOne({ bookTitle: bti.bt });
    }catch(err){}
    res.redirect('/')
})
app.listen(5001,()=>{
    console.log("server running at 5001")
})