const route=require('express').Router()
const Product=require('../db').Product

route.get('/:id',(req,res)=>{
    
  
    Product.findOne(
        { 
            where: { 
                    id: req.params.id 
                 } 
        }
    ).then((product) => {
       // console.log(product.dataValues);
        res.render('productPage', { product : product.dataValues } )
    }).catch((err)=>{
        res.send("error in fetching product.")
    })
    
})


module.exports=route;