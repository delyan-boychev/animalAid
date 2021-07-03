const jwt = require('jsonwebtoken');
require('dotenv').config();
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.replace("animalAidAuthorization ", "");
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(401);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};
module.exports = authenticateJWT;