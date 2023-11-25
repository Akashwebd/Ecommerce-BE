const express = require('express');
const {create,update,read,remove,listAll,list,productCount,handleRating,relatedProduct,filterProduct} = require('../Controllers/Product');
const {checkToken,adminCheck} = require('../Middleware/auth');
// const { currentAdmin } = require('../../client/src/Components/Functions/auth');

const route = express.Router();

route.post('/product',checkToken,adminCheck,create);
route.get('/products/:count',listAll);
route.delete('/product/:slug',checkToken,adminCheck,remove);
route.get('/product/total',productCount);
route.get('/product/:slug',read);
route.put('/product/:slug',checkToken,adminCheck,update);
route.post('/products',list);
route.post('/product/star/:id',checkToken,handleRating);
route.get('/product/related/:id',relatedProduct);
route.post('/search/filter',filterProduct);


 module.exports = route;   