const express = require('express');
const {create,remove,listAll} = require('../Controllers/coupon');
const {checkToken,adminCheck} = require('../Middleware/auth');
// const { currentAdmin } = require('../../client/src/Components/Functions/auth');

const route = express.Router();

route.post('/coupon',checkToken,adminCheck,create);
route.get('/coupon',listAll);
route.delete('/coupon/:id',checkToken,adminCheck,remove);



 module.exports = route;   