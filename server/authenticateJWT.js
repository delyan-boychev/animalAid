const config = require("./config.json");
const jwt = require('jsonwebtoken');
const Cryptr = require("cryptr");
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.replace("animalAidAuthorization ", "");
        jwt.verify(token, config.JWT_SECRET , (err, tokendata) => {
            if (err) {
                return res.sendStatus(401);
            }
            const cryptr = new Cryptr(config.JWT_ENCRYPTION_KEY);
            try
            {
                req.user = JSON.parse(cryptr.decrypt(tokendata.data));
                next();
            }
            catch
            {
                return res.sendStatus(401);
            }
        });
    } else {
        res.sendStatus(401);
    }
};
module.exports = authenticateJWT;