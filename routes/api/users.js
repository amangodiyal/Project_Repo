const route=require('express').Router()
const User=require('../../db').User

route.get('/',(req,res)=>{
    //send all the users back
    User.findAll()
        .then((users)=>{
            res.status(200).send(users)
        })
        .catch((err)=>{
            res.status(500).send({
                error:"could not retrive users"
            })
        })
})
route.post('/',(req,res)=>{
    //create a new user 
    User.create({
        name:req.body.name
    }).then((user)=>{
        res.status(201).send(user)
    })
    .catch((err)=>{
        res.status(501).send({
            error:"could not create new user"
        })
    })
})

module.exports=route;