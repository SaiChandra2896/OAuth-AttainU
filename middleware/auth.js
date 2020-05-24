const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {

    //get the token
    const token = req.header('x-auth-token');
    //if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        next();
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Token is not valid');
    }
}