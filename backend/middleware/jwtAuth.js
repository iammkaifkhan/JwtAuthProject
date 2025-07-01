const JWT = require('jsonwebtoken');

const jwtAuth = (req, res, next) => {
    const token = (req.cookies && req.cookies.token) || null;
if(!token){
        return res.status(401).json({
            success: false,
            message: 'No token provided, authorization denied'
        });
    }
    try {
        const payload = JWT.verify(token,process.env.SECRET);
        req.user= {id: payload.id, email: payload.email};
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token is not valid'
        });
    }
    next();
};

module.exports = jwtAuth;
    