const { default: slugify } = require('slugify');
const Sub  = require('../Models/subCategorySchema');
const Product = require('../Models/productSchema');

exports.create = async (req,res) =>{
    const {name,categoryName} = req.body;
    try{
        const newCategory = await new Sub({
            name,
            slug:slugify(name),
            parent:categoryName
            }).save();

        console.log(newCategory);
        res.json(newCategory);    

    }catch(error){
        console.log(error);
        res.status(400).send('Sub Category Creation Failed');
    }
}

exports.list = async(req,res) =>{
    const allCategory = await Sub.find({}).sort({createdAt:-1}).exec();
    console.log(allCategory,'check123');
    res.json(allCategory);
}

exports.read = async(req,res) => {
    const {slug} = req.params;
    const category = await Sub.findOne({slug:slug}).exec();
    const products = await Product.find({subs:category}).exec();
    res.json({
        sub:category,
        products
    });
}

exports.update = async (req,res) => {
    console.log('hello1234',req);
    try{
        const {slug} = req.params;
        const {name} = req.body;
        const {categoryName} = req.body;
        console.log(req.body,'checkbody');
        const UpdateCategory = await Sub.findOneAndUpdate({slug:slug},{
            name,
            slug:slugify(name),
            parent:categoryName

        },
         {new:true}).exec();//to return new update category
         console.log(UpdateCategory,'check1234');
        res.json(UpdateCategory);
    }catch(error){
        console.log(error);
        res.status(400).send('Updating Sub Category Failed');
    }

}

exports.remove = async(req,res) => {
    try{
        const {slug} = req.params;
        const deletedCategory = await Sub.findOneAndDelete({slug:slug}).exec();
        console.log(deletedCategory,'qwer');
        res.json(deletedCategory);
    }catch(error){
        console.log(error);
        res.status(400).send('Sub Category Deletion Failed');
    }
}