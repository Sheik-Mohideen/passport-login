const express=require('express');
const router=express.Router();
const { isAuthenticated }=require('../config/auth');
//Welcome page
router.get('/',(req,res)=> res.render('welcome'));
//Dashboard
router.get('/dashboard',isAuthenticated,(req,res)=> res.render('dashboard'));
module.exports=router; 