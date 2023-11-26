const express = require('express');
const route = express.Router();
const {checkToken,adminCheck} = require('../Middleware/auth');
const {list,update} = require('../Controllers/admin');

route.get('/admin/orders',checkToken,adminCheck,list);
route.put('/admin/order-status',checkToken,adminCheck,update);

module.exports = route; 



