const express=require('express');
const app=express();
const path=require('path');
const expressLayouts=require('express-ejs-layouts');
const mongoose=require('mongoose');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
//config passport 
require('./config/passport')(passport);
//DB config
//const db=require('./config/keys').MongoURI;
// After connecting in cloud
//Connect   
mongoose.connect('mongodb+srv://sheik:Sheik@7777@cluster0-wu9vf.mongodb.net/test?retryWrites=true&w=majority',{ useNewUrlParser : true})
.then(()=> console.log('MangoDb connected..'))
.catch((err)=> console.log(err));
//EJS
app.use(expressLayouts);
app.set('view engine','ejs');
//Add Session
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}));
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Call flash
app.use(flash());
//Set Global variable for flash
app.use((req,res,next)=>
{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    next();
})
//Body parser
app.use(express.urlencoded({extended:false}));

//Route
app.use('/',require('./route/index1'));
app.use('/users',require('./route/users'));
const PORT=process.env.PORT||5000;
app.listen(PORT,()=> console.log('Server Starter...'));