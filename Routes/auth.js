const express = require('express');
const {createOrUpdateUser,currentUser} = require('../Controllers/auth');
const {checkToken,adminCheck} = require('../Middleware/auth');
// const { currentAdmin } = require('../../client/src/Components/Functions/auth');

const route = express.Router();

route.post('/create-update-user',checkToken,createOrUpdateUser);
route.post('/current-admin',checkToken,adminCheck,currentUser);
route.post('/current-user',checkToken,currentUser);

 module.exports = route;   