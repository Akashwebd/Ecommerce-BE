const express = require('express');
const {upload,remove} = require('../Controllers/cloudinary');
const {checkToken,adminCheck} = require('../Middleware/auth');
// const { currentAdmin } = require('../../client/src/Components/Functions/auth');

const route = express.Router();

route.post('/uploadimage',checkToken,adminCheck,upload);
route.post('/removeimage',checkToken,adminCheck,remove)

 module.exports = route;