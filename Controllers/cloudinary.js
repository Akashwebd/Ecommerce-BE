const cloudinary = require('cloudinary');

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET_KEY
  });

exports.upload = async (req,res) =>{
  try{
    const response = await cloudinary.uploader.upload(req.body.image,{
      public_id:`${Date.now()}`,
      resource_type:'auto'
    });
    res.json({
      public_id:response.public_id,
      url:response.secure_url
    });
  }catch(error){
    res.status(400).send('Image Upload Failed');
  }
}  

exports.remove = async(req,res) =>{
  try{
    const response = cloudinary.uploader.destroy(req.body.id);
    res.send('ok');
  }catch(error){
    res.status(400).json({
      err:err,
      success:false
    })
  }
}