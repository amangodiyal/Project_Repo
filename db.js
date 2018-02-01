const Sequelize=require('sequelize')
const db=new Sequelize('shopdb','shopper','shoppass',{
    host:'localhost',
    dialect:'mysql',
    pool:{
        min:0,
        max:5
    }
})
const User=db.define('users',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    username:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true,

    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    firstName:Sequelize.STRING,
    lastName:Sequelize.STRING,
})
const Product=db.define('products',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    manufacturer:Sequelize.STRING,
    price:{
        type:Sequelize.FLOAT,
        defaultValue:0.0,
        allowNull:false
    },
    image:Sequelize.STRING,

})

const Cart=db.define('carts',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    name:{
        type:Sequelize.STRING,
       
        allowNull:false
    },
    //manufacturer:Sequelize.STRING,
    price:{
        type:Sequelize.FLOAT,
        defaultValue:0.0,
        allowNull:false
    },
   // image:Sequelize.STRING,
    quantity:{
        type:Sequelize.INTEGER,
        defaultValue:0
    }

})

db.sync()
    .then(()=>console.log("Database has been synced"))
    .catch((err)=>console.log("Error creating database"))

module.exports={
    User,Cart,Product,db
}