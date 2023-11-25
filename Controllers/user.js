const { default: slugify } = require('slugify');
const Cart  = require('../Models/cartSchema');
const Product = require('../Models/productSchema');
const User  = require('../Models/userSchema');
const Coupon = require('../Models/couponSchema');

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