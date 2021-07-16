const config = require("./config.json");
const jwt = require('jsonwebtoken');
const authenticateJWT = (req, res, next) => {
    const token = req.query.token;
    if (token) {
        jwt.verify(token, config.JWT_SECRET , (err, user) => {
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