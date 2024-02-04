const jwt = require('jsonwebtoken');


const checkToken = (req, res, next) =>{
    token = req.cookies.access_token;

    if(!token) {
        return res.redirect('/login')
    }
    
    try {
        const secret = process.env.SECRET;
        jwt.verify(token, secret)
        next();
    } catch (error) {
        return res.redirect('/login')
    }
}

exports.checkToken = checkToken;