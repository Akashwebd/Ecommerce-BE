const express = require('express');
const {create,update,read,remove,list} = require('../Controllers/sub');
const {checkToken,adminCheck} = require('../Middleware/auth');
// const { currentAdmin } = require('../../client/src/Components/Functions/auth');

const route = express.Router();

route.post('/sub',checkToken,adminCheck,create);
route.put('/sub/:slug',checkToken,adminCheck,update);
route.get('/sub/:slug',read);
route.delete('/sub/:slug',checkToken,adminCheck,remove);
route.get('/subs',list);

 module.exports = route;   