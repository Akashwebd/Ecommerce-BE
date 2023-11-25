
const Product = require('../Models/productSchema');
const User  = require('../Models/userSchema');
const { default: slugify } = require('slugify');

exports.create = async (req,res) =>{
    console.log(req.body);
    try{
        req.body.slug = slugify(req.body.title);
        const newProduct = await new Product(req.body).save();
        res.json(newProduct);
    }catch(error){
        res.status(400).json({
           err:error.message 
        })
        // res.status(400).send('Product Creation Failed');
    }
}

exports.listAll = async(req,res) =>{
    const {count} = req.params;
    const products = await Product.find({}).limit(parseInt(count)).populate('category').populate('subs').sort([['createdAt','desc']]).exec();
    console.log(products);
    res.json(products);
}

exports.remove = async(req,res) =>{
    try{
        const deletedProduct = await Product.findOneAndDelete({slug:req.params.slug}).exec();
        res.json(deletedProduct);
    }catch(error){
        console.log(error);
        res.status(400).send('Product Deletion Failed');
    }
}

exports.read = async(req,res) =>{
    console.log(req.params.slug);
    const product = await Product.find({slug:req.params.slug}).populate('category').populate('subs').sort([['createdAt','desc']]).exec();
    res.json(product);
}

exports.update = async(req,res) =>{
    try{
        const {slug} = req.params;
        req.slug = slugify(req.body.title);
        const updatedProduct = await Product.findOneAndUpdate({slug:slug},req.body,{new:true}).exec();
        console.log(req.body,'zxcv',slug);
        res.json(updatedProduct);
    }catch(error){
      res.status(400).send('Product Update Failed');
    }
}

exports.list = async(req,res) =>{
    try{
        const {sort,order,page} = req.body;
        const currentPage = page || 1;
        const perPage=3;
        const products = await Product.find({}).
        skip((currentPage-1)*perPage).
        populate('category').
        populate('subs').
        sort([[sort,order]]).
        limit(perPage);
        res.json(products);
    }catch(error){
        console.log(error);
        res.status(400).send('Product Fetch Failed');
    }
}

exports.productCount = async(req,res) =>{
    try{
        const productCount = await Product.find({}).estimatedDocumentCount().exec();
        res.json(productCount);
    }catch(error){
        res.status(400).send('Product Count fetch Failed');
    }
}

exports.handleRating = async(req,res) =>{
    const star =req.body.star;
    const product = await Product.findById({_id:req.params.id}).exec();
    const user = await User.find({email:req.user.email}).exec();
    const rating = product.ratings;
    const ratingObject = rating?.filter((r) => r.postedBy.toString() == user[0]._id.toString());
    let updatedProduct;
    console.log(ratingObject);
    try{
        if(!ratingObject.length){
             updatedProduct = await Product.findByIdAndUpdate(
                product._id,
                {
                    $push:{ratings:{star,postedBy:user[0]._id}}
                },
                {new:true}
            ).exec();
        }else{
             updatedProduct = await Product.updateOne(
                {"_id" : product._id},
                {$set: {
                    'ratings.$[x].star':star
                }},
                {new:true,arrayFilters: [
                    {"x.postedBy": user[0]._id.toString()}
                ]}
            ).exec();
        }
        res.json(updatedProduct);
    }catch(error){
        console.log(error);
    }
}

exports.relatedProduct = async(req,res) =>{
    try{
        const product = await Product.find({_id:req.params.id}).exec();
        console.log(product[0]._id);
        const relatedProducts = await Product.find({_id:{
            $ne:product[0]._id
        },
        category:product[0].category
        }).limit(3).
        populate('category').
        populate('subs').
        populate('postedBy').
        exec();
    
        res.json(relatedProducts);
    }catch(error){
        console.log(error);
        res.status(400).send('Failed');
    }
}

const handleQuery = async(req,res,query) => {
    try{
        const product = await Product.find({$text:{$search:query}}).
        populate('category','_id name').
        populate('subs','_id name').
        populate('postedBy').
        exec();
        res.json(product);
    }catch(error){
        console.log(error);
    }
}

const handlePrice = async(req,res,price) =>{
    try{
        const product = await Product.find({
           price:{
            $gte:price[0],
            $lte:price[1]
           }
        }).
        populate('category','_id name').
        populate('subs','_id name').
        populate('postedBy').
        exec();
        res.json(product);
    }catch(error){
        console.log(error);
    }
}

const handleCategory = async(req,res,category) =>{
    try{
        const products = await Product.find({category}).
        populate('category','_id name').
        populate('subs','_id name').
        populate('postedBy').
        exec();
        res.json(products);
    }catch(error){
        console.log(error);
    }
}

const handleStars = async(req,res,stars) =>{
    try{
        const newProducts = await Product.aggregate([{
            $project:{
                document:'$$ROOT',
                floorAverage:{$floor:{$avg:'$ratings.star'}}
            }
        },{$match:{floorAverage:stars}}]).limit(12)
      
        const Products = await Product.find({_id:newProducts}).
        populate('category','_id name').
        populate('subs','_id name').
        populate('postedBy').exec();
    
        res.json(Products);
    }catch(error){
        console.log(error);
    }
}

const handleSub = async(req,res,sub) =>{
    try{
        const products = await Product.find({subs:sub}).
        populate('category','_id name').
        populate('subs','_id name').
        populate('postedBy').
        exec();
        res.json(products);
    }catch(error){
        console.log(error);
    }
}

const handleShipping = async(req,res,shipping) =>{
    try{
        const products = await Product.find({shipping:shipping}).
        populate('category','_id name').
        populate('subs','_id name').
        populate('postedBy').
        exec();
        res.json(products);
    }catch(error){
        console.log(error);
    }
}

const handleBrand = async(req,res,brand) =>{
    try{
        const products = await Product.find({brand:brand}).
        populate('category','_id name').
        populate('subs','_id name').
        populate('postedBy').
        exec();
        res.json(products);
    }catch(error){
        console.log(error);
    }
}

const handleColor= async(req,res,color) =>{
    try{
        const products = await Product.find({color:color}).
        populate('category','_id name').
        populate('subs','_id name').
        populate('postedBy').
        exec();
        res.json(products);
    }catch(error){
        console.log(error);
    }
}


exports.filterProduct = async(req,res) =>{
    const{query,price,category,stars,sub,shipping,brand,color} = req.body;
    if(query){
        await handleQuery(req,res,query)
    }

    if(price){
     await handlePrice(req,res,price);
    }
    if(category){
        await handleCategory(req,res,category);
    }
    if(stars){
        await handleStars(req,res,stars);
    }
    if(sub){
        await handleSub(req,res,sub);
    }
    if(shipping){
    await handleShipping(req,res,shipping)
    }
    if(brand){
    await handleBrand(req,res,brand);   
    }
    if(color){
    await handleColor(req,res,color);    
    }
}
