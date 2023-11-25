const express = require('express');
const {createPaymentIntent} = require('../Controllers/stripe');
const {checkToken} = require('../Middleware/auth');
// const { currentAdmin } = require('../../client/src/Components/Functions/auth');

const route = express.Router();

route.post('/create-payment-intent',checkToken,createPaymentIntent);

 module.exports = route;   