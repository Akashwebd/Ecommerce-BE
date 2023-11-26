const express = require('express');
const {
    create,
    update,
    read,
    remove,
    handleAddress,
    handleCoupon,
    createOrder,
    getOrders,
    addWishlist,
    getAllWishlist,
    removeWishlist
    } = require('../Controllers/user');
const {checkToken,adminCheck} = require('../Middleware/auth');
// const { currentAdmin } = require('../../client/src/Components/Functions/auth');

const route = express.Router();

route.post('/user/cart',checkToken,create);
route.get('/user/cart',checkToken,read);
route.delete('/user/cart',checkToken,remove);
route.post('/user/address',checkToken,handleAddress);
route.post('/user/order',checkToken,createOrder);
route.get('/user/orders',checkToken,getOrders);
route.post('/user/cart/coupon',checkToken,handleCoupon);
route.post('/user/wishlist',checkToken,addWishlist);
route.get('/user/wishlist',checkToken,getAllWishlist);
route.put('/user/wishlist/:id',checkToken,removeWishlist)
// route.put('/category/:slug',checkToken,adminCheck,update);
// route.get('/category/:slug',read);
// route.delete('/category/:slug',checkToken,adminCheck,remove);
// route.get('/categories',list);
// route.get('/category/sub/:_id',getSub);

 module.exports = route;   