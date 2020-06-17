const LocalStrategy = require('passport-local').Strategy;
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const User=require('../models/User');

module.exports=function(passport)
{
    passport.use(new LocalStrategy( {usernameField: 'email'},
  function(email, password, done) {
    User.findOne({ email: email })
      .then(user =>
       {    
           if(!user)
           {
               return done(null, false, { message: 'Email does not exist' });
           }      
            bcrypt.compare(password,user.password,(err,isMatch)=>
            {
                if(!isMatch)
                {
                     return done(null, false, { message: 'Incorrect password.' });
                }
                else
                {
                    return done(null,user);
                }
            })      
    });
  }
));
passport.serializeUser((user, done) =>{
  done(null, user.id);
});

passport.deserializeUser((id, done) =>{
  User.findById(id, (err, user)=> {
    done(err, user);
  });
});
}
