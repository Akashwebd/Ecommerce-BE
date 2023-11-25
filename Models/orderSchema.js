const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const orderSchema  = new mongoose.Schema({
    products:[
        {
            product:{
                type:ObjectId,
                ref:'Product'
    
            },
            count:Number,
            color:String,
            // price:Number
        }
    ],
    paymentIntent:{},
    orderStatus:{
        type:String,
        enum:['Not Processed','Processing','Dispatched','Cancelled','Delivered'],
        default:'Not Processed'
    },
    orderedBy:{
        type:ObjectId,
        ref:"User"
    }
});

module.exports = mongoose.model('Order',orderSchema);