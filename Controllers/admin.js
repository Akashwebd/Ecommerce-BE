const Order = require('../Models/orderSchema');


exports.list = async(req,res) =>{
    try{
        const orders = await Order.find({}).sort('-createdAt').populate('products.product').exec();
        res.json(orders);
    }catch(error){
        console.log(error);
    }
}

exports.update = async(req,res) =>{
    try{
        const {id,status} = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(id,{orderStatus:status},{new:true}).exec();
        res.json(updatedOrder);
    }catch(error){
        console.log(error);
    }

}