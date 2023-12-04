const Cart  = require('../Models/cartSchema');
const Product = require('../Models/productSchema');
const User  = require('../Models/userSchema');
const Coupon = require('../Models/couponSchema');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async(req,res) =>{
    const {couponApplied} = req.body;
    let finalAmount
    const user = await User.findOne({email:req.user.email}).exec();
    const response = await Cart.findOne({orderedBy:user._id}).exec();
    if(couponApplied){
    finalAmount = response.totalAfterDiscount*100;
    }else{
        finalAmount = response.cartTotal*100
    }
    const paymentIntent = await stripe.paymentIntents.create({
        amount:finalAmount,
        currency:"inr",
        description: 'Software development services',
    });
    // console.log(paymentIntent,'-------->',process.env.STRIPE_SECRET_KEY)
    res.send({
        clientSecret:paymentIntent.client_secret,
        cartTotal:response.cartTotal,
        totalAfterDiscount:response.totalAfterDiscount,
        payable:finalAmount
    });
}