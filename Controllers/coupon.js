const Coupon = require('../Models/couponSchema');

exports.create = async(req,res) =>{
    const {name,expiry,discount} = req.body;
 try{
res.json(await new Coupon({name,expiry,discount}).save());
 }catch(error){
    res.status(400).send({
        err:error.message
    })
    console.log(error.message);
 }   

}

exports.remove = async(req,res) =>{
     try{
        res.json(await Coupon.findByIdAndDelete(req.params.id).exec());

    }catch(error){
       console.log(error);
    }  
    
}
exports.listAll = async(req,res) =>{
    try{
        res.json(await Coupon.find({}).exec());
    }catch(error){
       console.log(error);
    }  
    
}