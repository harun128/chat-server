var Joi = require("@hapi/joi");
const { JSONCookie } = require("cookie-parser");


const registerValidation = data => {
    const schema = Joi.object({
        username : Joi.string().min(6).required(),
        email : Joi.string().min(6).required().email(),
        password : Joi.string().min(6).required()
    })
    return schema.validate(data);
}

const loginValidation = (data) => {
    const schema = Joi.object({
        email : Joi.string().min(6).required().email(),
        password : Joi.string().min(6).required()
    })
    return schema.validate(data);
}


const communityMessageValidation = (data) => {
    const schema = Joi.object({
        message : Joi.string().min(2).required(),
        country : Joi.number().required()
    })
    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.communityMessageValidation = communityMessageValidation;