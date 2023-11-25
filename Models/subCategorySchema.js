const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const subCategorySchema = new mongoose.Schema({
    name:{
        type:String,
        require:'Name is required',
        minLength:[3,"Too Short"],
        maxLength:[32,'Too Long'],
        trim:true
    },
    slug:{
        type:String,
        unique:true,
        lowercase:true,
        index:true
    },
    parent:{
     type:ObjectId,
     ref:"Category",
     require:true
    }
},{timestamps:true})

module.exports = mongoose.model('Sub',subCategorySchema);