const json = require('jsonwebtoken');
const SECRET = "ramsdomdsfmyfirstlovetoyopurnsdiudontknowyetcitnwascyopu";

function authMiddleware(req, res , next){
const token = req.headers.token;
const decoded = json.verify(token, SECRET)
const userId = decoded.userid;
if (userId) {
    req.userId = userId;
    next();
} else {
    res.status(403).send({
        message: "malformed token"
    })
}
}
module.exports= {
    authMiddleware: authMiddleware
}