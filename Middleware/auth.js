const admin = require('../Firebase');
const User = require('../Models/userSchema');

exports.checkToken = async (req,res,next) =>{
    console.log(req.headers.token,'-------------->')
    try{
        const firebaseUser =  await admin.auth().verifyIdToken(req.headers.token);
        // firebaseUser.name = firebaseUser.email.substring(0,user.email.indexOf('@'));
        req.user = firebaseUser;
        console.log(firebaseUser,'user');
        next();
    }catch(error){
        console.log(error,'error');
        res.status(401).json({
         err:'Invalid or expired token'
        });
    }
}

exports.adminCheck = async (req,res,next) => {
    console.log('reached');
        const {email} = req.user;
        const response = await User.findOne({email}).exec();
        if(response.role !== 'admin'){
            res.status(403).json({
                error:'Admin Resource.Access Denied'
            })
        }else{
            next();
        }

}