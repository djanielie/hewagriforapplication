const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config()

const hashPWD = async ({ plaintext }, cb) => {
    return bcrypt.hash(plaintext, 10);
}

const comparePWD = async ({ plaintext, hashedtext }, cb) => {
    const valide = await bcrypt.compare(plaintext, hashedtext)
    if(valide) cb(undefined, valide)
    else cb('error pwds not matching', undefined)
}

module.exports = {
    hashPWD,
    comparePWD
}
