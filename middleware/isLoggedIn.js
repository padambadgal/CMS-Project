const jwt = require('jsonwebtoken');

const isLoggedIn = async (req, res, next) => {
    try{
    const token = req.cookies.jwt;
    if (!token) return res.redirect('/admin/');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded)
    req.id = decoded.id;
    req.role = decoded.role;
    req.fullname = decoded.fullname;

    next();
    }catch(error) {
       res.status(401).send('Unauthorized: Invalid Token');;
    }
};


module.exports = isLoggedIn;   