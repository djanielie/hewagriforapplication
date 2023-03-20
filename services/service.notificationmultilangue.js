const { CustomizedSMS } = require("../models/model.cutsomizedsms")

const onNoftifyWithMultupleLangue = async ({ idlangue, casemessage, concern }, cb) => {
    cb = typeof cb === "function" ? cb : () => {};
    
    try {
        await CustomizedSMS.findOne({
            idlangue,
            case: parseInt(casemessage),
        },{
            attributes: ["content"]
        })
        .then(message => {
    
        })
        .catch(err => {
            
        })
    } catch (error) {
        cb(error, undefined)
    }

}

module.exports = {
    onNoftifyWithMultupleLangue
}