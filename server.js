const express=require('express')
const path=require('path')
const bodyParser = require('body-parser')
const session=require('express-session')
const expressHbs=require('express-handlebars')
const flash = require('connect-flash');
const sequelize=require('./db').db;

const expressValidator = require('express-validator');
var bcrypt = require('bcrypt');
const passport=require('passport')
const LocalStrategy=require('passport-local').Strategy

//var MongoStore = require('connect-mongo')(session);
var SequelizeStore = require('connect-session-sequelize')(session.Store);
const User=require('./db').User
const Product=require('./db').Product
const Cart=require('./db').Cart

const app=express()
//app.use(express.json())
//app.use(express.urlencoded({extended:true}))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(expressValidator());

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');


app.use(session({
    secret:'someSecret',
    store: new SequelizeStore({
        db: sequelize
    }),
    resave: false,
    saveUninitialized: false,
}))


app.use(passport.initialize())
app.use(passport.session())
app.use(flash());


app.use(function(req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated();

    Cart.sum('quantity').then(sum => {
        if(sum>0)
            res.locals.quantity = sum;    
    })
    
    next();
});
app.use('/root',require('./routes/root'))

app.use('/api',require('./routes/api/'))
app.use('/pages/',require('./routes/pages'))

app.use('/',(req,res)=>{
    
    Product.findAll()
            .then((products)=>{
                res.render('homepage',{title:'HomePage',products:products})
            })
            .catch((err)=>{
                res.send('error fetching products')
            })
    
})


passport.use('local.login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, username, password, done) {
    req.checkBody('username', 'Please enter the username').notEmpty();
    req.checkBody('password', 'Invalid password.Min length must be 4').notEmpty().len(4,100);
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
   
    User.findOne({
        where:{
            username:username
        }
    }).then((user)=>{
        if(!user){
            return done(null,false,{message:'No such user exists.'})
        }
        //const hash=user.password;
       // console.log(user)
        bcrypt.compare(password, user.password, function(err, response) {
          if(response == true)
             return done(null,user)
          else
             return done(null,false,{message:'Wrong Password.'})   
        });
        
    }).catch((err)=>{
        return done(err)
    })

}));



/*passport.use(new LocalStrategy(
    function(username, password, done) {
       
        req.checkBody('username', 'Invalid email').notEmpty();
        req.checkBody('password', 'Invalid password').notEmpty();
        var errors = req.validationErrors();
        if (errors) {
            var messages = [];
            errors.forEach(function(error) {
                messages.push(error.msg);
            });
            return done(null, false, req.flash('error', messages));
        }
       
        User.findOne({
           where:{
               username:username
           }
       }).then((user)=>{
           if(!user){
               return done(null,false,{message:'No such user exists.'})
           }
           //const hash=user.password;
          // console.log(user)
           bcrypt.compare(password, user.password, function(err, response) {
             if(response == true)
                return done(null,user)
             else
                return done(null,false,{message:'Wrong Password.'})   
           });
           
       }).catch((err)=>{
           return done(err)
       })
        
    })
)*/

app.listen(2233,()=>{
    console.log("server started")
})
