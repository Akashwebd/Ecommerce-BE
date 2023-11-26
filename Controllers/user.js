const { default: slugify } = require('slugify');
const Cart  = require('../Models/cartSchema');
const Product = require('../Models/productSchema');
const User  = require('../Models/userSchema');
const Coupon = require('../Models/couponSchema');
const Order = require('../Models/orderSchema');

exports.create = async(req,res) =>{
    try{
        const {cart} = req.body;
        let products = []
        const user = await User.findOne({email:req.user.email}).exec();
        const existedCart = await Cart.findOne({orderedBy:user._id}).exec();
        if(existedCart){
            existedCart.remove();
        }
        
        for(i=0;i<cart.length;i++){
            let subProduct ={}
            subProduct.product = cart[i]._id,
            subProduct.count = cart[i].count,
            subProduct.color = cart[i].color,
            subProduct.price = (await Product.findById(cart[i]._id).select('price').exec()).price;
            products.push(subProduct);
        }
        let cartTotal = 0;
        for(i=0;i<cart.length;i++){
            cartTotal = cartTotal + cart[i].price;
        }
        console.log(products,'check123----->')
        const response = await new Cart({
            products,
            cartTotal,
            orderedBy:user._id
        }).save()
        
        res.json({
            ok:true
        })
    }catch(error){
        console.log(error);
        res.status(400).send('Cart creation Failed');
    }  

}

exports.read = async(req,res) =>{
    const user = await User.findOne({email:req.user.email}).exec();
    const cart = await Cart.findOne({orderedBy:user._id}).populate('products.product');
    console.log(cart,'checkcart-------->');
    // const {products,cartTotal,totalAfterDiscount} = cart;
    res.json({details:{products:cart?.products,cartTotal:cart?.cartTotal,totalAfterDiscount:cart?.totalAfterDiscount}});
}

exports.remove = async(req,res) =>{
    try{
        const user = await User.findOne({email:req.user.email}).exec();
        const removedCart = await Cart.deleteOne({orderedBy:user._id}).exec();
        res.json({
            ok:true
        })
    }catch(error){
        console.log(error);
    }
}

exports.handleAddress = async(req,res) =>{
    const user = await User.findOneAndUpdate({email:req.user.email},{address:req.body.address}).exec();
    res.json({
        ok:true
    });

}

exports.handleCoupon = async(req,res) =>{
    const {coupon} = req.body;
    const validateCoupon = await Coupon.findOne({name:coupon}).exec();
    if(validateCoupon){
        const user = await User.findOne({email:req.user.email}).exec();
        const {cartTotal} = await Cart.findOne({orderedBy:user._id});
        const totalAfterDiscount = cartTotal - ((cartTotal*validateCoupon.discount)/100);
        console.log(totalAfterDiscount,'-------->')
        await Cart.findOneAndUpdate({orderedBy:user._id},{totalAfterDiscount}).exec();
        res.json({totalAfterDiscount});
    }else{
        res.status(400).send('Invalid Coupon'); 
    }
}

exports.createOrder = async(req,res) =>{
    try{
        const {paymentIntent} = req.body.stripeResponse;
        const user = await User.findOne({email:req.user.email}).exec();
        const {products} = await Cart.findOne({orderedBy:user._id}).exec();
        await new Order({
         products,
         paymentIntent,
         orderedBy:user._id
        }).save();
        //decrement quantity and increment sold
        const bulkOption = products.map(item =>{
            return {
                updateOne:{
                filter:{_id:item.product._id},
                update:{$inc:{sold:+item.count,quantity:-item.count}}

            }
        }
        })
        let updated = await Product.bulkWrite(bulkOption,{new:true});
        console.log(updated,'-------------------->updated');
        res.json({ok:true});
    }catch(error){
        res.send({
            err:error.message
        })
    }

}

exports.getOrders = async(req,res) =>{
    try{
        const user = await User.findOne({email:req.user.email}).exec();
        const orders = await Order.find({orderedBy:user._id}).
        populate('products.product').
        exec();
        console.log(orders,'check123------------------>');
        res.json(orders);
    }catch(error){
        console.log(error);
    }
}

exports.addWishlist = async(req,res) =>{
// const user = await User.find({email:req.body.email}).exec();
const response = await User.findOneAndUpdate({email:req.user.email},{$addToSet:{wishlist:req.body.id}}).exec();
console.log(response,req.body.id,'-------------->')

res.json({ok:true});
}
exports.getAllWishlist = async(req,res) =>{
   const response =  await User.findOne({email:req.user.email}).select('wishlist').populate('wishlist').exec();
   console.log(response,'checkresponse');
   res.json(response);
}
exports.removeWishlist= async(req,res) =>{
    try{
        const {id} = req.params;
        await User.findOneAndUpdate({email:req.user.email},{$pull:{wishlist:id}}).exec();
        // User.findOne({email:req.user.email},{$pull:{wishlist:id}}).exec();
        res.json({ok:true});
    }catch(error){
        console.log(error);
    }
}