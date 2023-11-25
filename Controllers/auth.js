const User  = require('../Models/userSchema');

exports.createOrUpdateUser = async(req,res) =>{
    const {email} = req.user;
    const name = email.substring(0,email.indexOf('@'));
    // console.log(email.substring(0,email.indexOf('@')));
    const user = await User.findOneAndUpdate({email},{
        name,
        email
    });
    if(user){
        res.json(user);
    }else{
        const newUser = await new User({
            name,
            email
        }).save();
        res.json(newUser);
    }
    // res.json({
    //     data:'first Api'   
    //    });
}

exports.currentUser = async (req,res,next) =>{
    const {email} = req.user;
    await User.findOne({email}).exec((err,user)=>{
        if(err) throw new Error(err)
        res.json(user);
    }); 
}