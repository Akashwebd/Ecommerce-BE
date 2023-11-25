const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        upperCase:true,
        required:true,
        minLength:[6,'Too Short'],
        maxLength:[12,'Too Long'],
        unique:true
    },
    expiry:{
        type:Date,
        required:true
    },
    discount:{
        type:Number,
        required:true
    }
},{timestamps:true});

module.exports = mongoose.model('Coupon',couponSchema);