const Cart  = require('../Models/cartSchema');
const Product = require('../Models/productSchema');
const User  = require('../Models/userSchema');
const Coupon = require('../Models/couponSchema');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async(req,res) =>{
    const {couponApplied} = req.body;
    let finalAmount
    const user = await User.findOne({email:req.user.email}).exec();
    const {cartTotal,totalAfterDiscount} = await Cart.findOne({orderedBy:user._id}).exec();
    if(couponApplied){
    finalAmount = totalAfterDiscount*100;
    }else{
        finalAmount = cartTotal*100
    }
    console.log(cartTotal,'--->')
    const paymentIntent = await stripe.paymentIntents.create({
        amount:finalAmount,
        currency:"inr",
        description: 'Software development services',
    });
    // console.log(paymentIntent,'-------->',process.env.STRIPE_SECRET_KEY)
    res.send({
        clientSecret:paymentIntent.client_secret,
        cartTotal,
        totalAfterDiscount,
        payable:finalAmount
    });
}