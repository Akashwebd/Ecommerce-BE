const express = require('express');
const {create,update,read,remove,list,getSub} = require('../Controllers/Category');
const {checkToken,adminCheck} = require('../Middleware/auth');
// const { currentAdmin } = require('../../client/src/Components/Functions/auth');

const route = express.Router();

route.post('/category',checkToken,adminCheck,create);
route.put('/category/:slug',checkToken,adminCheck,update);
route.get('/category/:slug',read);
route.delete('/category/:slug',checkToken,adminCheck,remove);
route.get('/categories',list);
route.get('/category/sub/:_id',getSub);

 module.exports = route;   