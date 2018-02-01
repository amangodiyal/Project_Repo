const route=require('express').Router()
const User=require('../db').User
const Cart=require('../db').Cart
const Op = require('sequelize').Op

const expressValidator = require('express-validator');
var bcrypt = require('bcrypt');
const saltRounds = 10;
const passport=require('passport')
const LocalStrategy=require('passport-local').Strategy


route.get('/cart',(req,res)=>{
    //fetch cart from cart db;
    Cart.findAll()
    .then((products)=>{
        //console.log(products[0].name);
        let amount=0;
      //  let quantity=0
        for(let val of products){
            amount+=val.price*val.quantity;
          //  quantity+=val.quantity;    
        }
       // res.locals.quantity = quantity;
        res.render('cart',{title:'MyCart',products:products,amount:amount})
    })
    .catch((err)=>{
        res.send({
            error:"could not retrive products"
        })
    })    
          
})


route.get('/checkout',(req,res)=>{
    
    res.render('checkout');       
        
})

route.get('/login',(req,res)=>{
    var messages = req.flash('error');
    res.render('login', { messages: messages, hasErrors: messages.length > 0});       
        
})
route.get('/signup',(req,res)=>{
  
    res.render('signup');
        
})

route.get('/addToCart',(req,res)=>{
    // console.log(req.query.name)
   // console.log(req.query.price)
   //existing entry will not be changed here
   if(req.isAuthenticated()){
    Cart.findOrCreate({where: {name: req.query.name}, defaults: {price: req.query.price,quantity:1}})
      .spread((user, created) => {
        var item = user.get({plain: true})
        //console.log(created)
    // will be true if a new object was created and false if not
        if(!created){
            //Carts.///increment quantity by 1
            Cart.update({
                quantity: item.quantity+1,
              }, {
                where: {
                  name: {
                    [Op.eq]: item.name
                  }
                }
              });
        }
        res.redirect('/')
    }) 
   }
   else{
       res.render('login')
    }
  
    
})


route.get('/logout',(req,res)=>{
    // DELETE FROM carts WHERE status = 'inactive';
    Cart.destroy({
        where: {
            id: {
                    [Op.gt]: 0
                }
        }
      });
      
    req.logout();
     req.session.destroy();    
     res.redirect('/');    
})
route.get('/private',(req,res)=>{
    if(req.user){
        return res.render("addProduct")
    }else{
        res.redirect("/root/login")
    }
    //res.render("addProduct",{title: 'addProduct private'})
})

route.post('/login', passport.authenticate('local.login', 
                    { failureRedirect: '/root/login',
                      successRedirect: '/',
                      failureFlash: true
                    })
            
);


route.post('/signup',function (req, res, next) {
    req.checkBody('username','Invalid Username').notEmpty()
    req.checkBody('email','Invalid Email').isEmail()
    req.checkBody('password','Invalid password').notEmpty().len(4,100)
    req.checkBody('confirmpassword','Invalid Confirm password field').notEmpty().len(4,100)
    req.checkBody('firstName','Invalid First Name').notEmpty()
    req.checkBody('lastName','Invalid Last Name').notEmpty()
    req.checkBody('confirmpassword','Passwords do not match. Please try again.').equals(req.body.password)
    const errors=req.validationErrors()
    if(errors){
       // console.log(errors);
        //console.log(`errors: ${JSON.stringify(errors)}`)
        res.render('signup',{title:'signup error', errors:errors})
    }
    else{
        
        bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                
            User.create({
                username:req.body.username,
                password:hash,
                firstName:req.body.firstName,
                lastName:req.body.lastName,
            }).then((result)=>{
                
                const user=result.dataValues
                //console.log(user);
                req.login(user.username,function(err){
                                    
                })
                res.render('login',{title:'signup successful '})
                
            }).catch((err)=>{
                throw err;
                
            })    
        });
        
        
        
    }
    
})

passport.serializeUser(function(username, done) {
    done(null, username);
  });
  
passport.deserializeUser(function(username, done) {
    return done(null,username)    
});      
   
    
  

module.exports=route;
