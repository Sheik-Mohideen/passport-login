const express=require('express');
const router=express.Router();
const User=require('../models/User');
const bcrypt=require('bcryptjs');
const passport=require('passport');
//login page
router.get('/login',(req,res)=> res.render('login'));

//register page
router.get('/register',(req,res)=> res.render('register'));

//Register handle
router.post('/register',(req,res)=>
{
   const { name, email, password, password2}=req.body;
   let errors=[];
   
   //check required fields
   if(!name|| !email|| !password||
    !password2)
    {
        errors.push({msg:'Please fill all the fields'});
    }
    //Check password match
    if(password !== password2)
    {
        errors.push({msg:'Password Mismatching'})
    }
    //Check pass lenght
    if(password.length<6)
    {
        errors.push({msg:'Password should be atleast 6 characters'});
    }if(errors.length>0)
    {
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });
    }else{
        //Validation Passed
        User.findOne({email :email})
        .then(user => {
            if(user)
            {   errors.push({msg: 'Email already registered'});
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }
            else{
                const newUser= new User({
                    name:name,
                    email,
                    password
                });

                //Hash code
                bcrypt.genSalt(10,(err,salt)=> bcrypt.hash(newUser.password,salt,(err,hash)=>
                {   if(err) throw err;
                    newUser.password=hash
                   //Add into  DB it should be inside the bcrypt method
                    newUser.save()
                    .then((user)=> {
                        req.flash('success_msg','You are now registered and can login in');
                        res.redirect('/users/login');
                        })
                    .catch(err => console.log(err));
                }));

               
            }
        })
    }
})
router.post('/login',(req,res,next)=>
{
      passport.authenticate('local', { successRedirect: '/dashboard',
                                   failureRedirect: '/users/login',
                                   failureFlash: true })(req,res,next);
});
router.get('/logout',(req,res)=>
{
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');
})

module.exports=router; 