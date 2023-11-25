const express=require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const moongoose = require('mongoose');
const cors = require('cors');
const {readdirSync} = require('fs');
require('dotenv').config()

//app
app = express();

//import Route
// const authRoute = require('./Routes/auth');

//mongoose connect
moongoose.connect('mongodb://127.0.0.1:27017/ecommerce',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology:true
}).then(()=>console.log('database connected ')).catch((err)=>console.log('not connected to database',err));
mongodb://localhost:27017
//middleware

app.use(bodyParser.json({limit:'2mb'}));
app.use(cors());
app.use(morgan('dev'));

//Routes

// app.get('/api',(req,res)=>{
// res.json({
//  data:'first Api'   
// });
// });

readdirSync('./Routes').map((r)=>{
    // console.log(r);
    app.use('/api',require('./Routes/'+r));
})

// app.use('/api',authRoute);

const port = process.env.PORT || 8000;

app.listen(port,()=>{
console.log('listening at '+ port);
});
