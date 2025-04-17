const jwt = require('jsonwebtoken');
const JWT_SECRET = 'jwt_secret';

function sign(email, expiresIn = '30m') {
    return jwt.sign({ email }, process.env.JWT_SECRET || JWT_SECRET, { expiresIn });
};

function verify(token) {
    try {
        jwt.verify(token, process.env.JWT_SECRET || JWT_SECRET);
        return true; // Token hợp lệ
    }
    catch (error) {
        return false; // Token không hợp lệ hoặc đã hết hạn
    }
};
module.exports = { sign, verify };