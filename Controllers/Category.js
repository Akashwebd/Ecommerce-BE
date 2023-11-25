const { default: slugify } = require('slugify');
const Category  = require('../Models/categorySchema');
const Product = require('../Models/productSchema');
const Sub = require('../Models/subCategorySchema');

exports.create = async (req,res) =>{
    console.log(req.user,'user');
    const {name} = req.body;
    try{
        const newCategory = await new Category({
            name,
            slug:slugify(name)
            }).save();

            console.log(newCategory);
        res.json(newCategory);    

    }catch(error){
        console.log(error);
        res.status(400).send('Category Creation Failed');
    }
}

exports.list = async(req,res) =>{
    const allCategory = await Category.find({}).sort({createdAt:-1}).exec();
    // console.log(allCategory,'check123');
    res.json(allCategory);
}

exports.read = async(req,res) => {
    const {slug} = req.params;
    const category = await Category.findOne({slug:slug}).exec();
    const products = await Product.find({category}).populate('category').exec();
    res.json({
        category,
        products});
}

exports.update = async (req,res) => {
    try{
        const {slug} = req.params;
        const {name} = req.body;
        const UpdateCategory = await Category.findOneAndUpdate({slug:slug},{
            name,
            slug:slugify(name)
        },
         {new:true}).exec();//to return new update category
        res.json(UpdateCategory);
    }catch(error){
        console.log(error);
        res.status(400).send('Updating Category Failed');
    }

}

exports.remove = async(req,res) => {
    try{
        const {slug} = req.params;
        const deletedCategory = await Category.findOneAndDelete({slug:slug}).exec();
        // console.log(deletedCategory,'qwer');
        res.json(deletedCategory);
    }catch(error){
        console.log(error);
        res.status(400).send('Category Deletion Failed');
    }
}

exports.getSub = async(req,res) => {
    const {_id} = req.params;
    try{
    const category = await Sub.find({parent:_id}).exec();
    res.json(category);
    }catch(error){
        res.status(400).json({
            err:error.message
        })
    }
}