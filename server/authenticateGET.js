const config = require("./config.json");
const Cryptr = require("cryptr");
const authenticate = (req, res, next) => {
    const token = req.query.token;
    if (token) {
        const cryptr = new Cryptr(config.TOKEN_ENCRYPTION);
        try
        {
            let data = JSON.parse(cryptr.decrypt(token));
            if(data["exp"] < parseInt(new Date().getTime()/1000))
            {
                res.sendStatus(401);
            }
            else
            {
                req.user = data["user"];
                next();
            }
        }
        catch
        {
            res.sendStatus(401);
        }

    } else {
        res.sendStatus(401);
    }
};
module.exports = authenticate;