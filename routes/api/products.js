const route=require('express').Router()
const Product=require('../../db').Product

route.get('/',(req,res)=>{
    Product.findAll()
        .then((products)=>{
            res.status(200).send(products)
        })
        .catch((err)=>{
            res.status(500).send({
                error:"could not retrive products"
            })
        })
})

route.post('/',(req,res)=>{
    //validate the price
    if(isNaN(req.body.price)){
        return res.status(403).send({
            error:"Price is not a valid number"
        })
    }
    
    Product.create({
        name:req.body.name,
        manufacturer:req.body.manufacturer,
        price:parseFloat(req.body.price),
        image:req.body.image
    })
    .then((product)=>{
        res.redirect('/')
        
    })
    .catch((err)=>{
        res.status(501).send({
            error:"Error adding product"
        })
    })
})
module.exports=route;