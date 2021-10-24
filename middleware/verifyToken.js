const jwt = require("jsonwebtoken");

module.exports = function auth(req,res,next){
    const token = req.header("auth-token");
    console.log(token);
    if(!token) return res.status(401).send({success:false,message:"Access Denied"});
    try{
        const verified = jwt.verify(token,process.env.TOKEN_SECRET);
        req.user =verified;
        next();
    }catch(err) {
        res.status(400).send({success:false,message:"Invalid Token"});
        console.log("hata");
    }
}