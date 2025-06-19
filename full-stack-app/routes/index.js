    let express = require('express')
    let router  = express.Router()
    const User = require('../models/User')
    const bcrypt = require('bcryptjs')

    router.get('/',(req,res,next)=>{
        return res.render('homepage')
    })
    router.get("/login",function (req,res,next){
        return res.render('login')
    });
    router.post('/login',async (req,res,next)=>{
        let user = await User.findOne({email: req.body.email});
        if(!user){
            req.flash("danger","user with this email is not present")
            console.log('User not exist')
            return res.redirect('/login')
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password)

        if(validPassword)
        {
            req.session.user = user;
            req.flash("success","Logged in successfully")
                    req.session.cart = [];
            return res.redirect('/')
        }
        else {
            req.flash("danger","Invalid Password")
            return res.redirect('/login')
        }
    });

    router.get('/register',(req,res,next)=>{
        console.log('inside register route')
        return res.render('signup')
    });
    router.get('/logout',(req,res,next)=>{
        req.flash('danger',"logged out")
        req.session.user = null;
        req.session.cart=[];
        console.log('Session clear');
        res.redirect('/login')
    })
    
    router.post('/register', async (req, res, next) => {
  const { role,name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    req.flash("danger", "Passwords do not match");
    return res.redirect('/register');
  }

  let user = await User.findOne({ email });
  if (user) {
    req.flash("danger", "User with this email already registered");
    return res.redirect('/login');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  user = new User({
    name,
    email,
    password: hashedPassword,
    role: [role]
  });

  await user.save();
  req.flash("success", "Registration successful! Please login.");
  return res.redirect('/login');
});

    module.exports = router