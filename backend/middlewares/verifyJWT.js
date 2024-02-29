const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {

    console.log("verifying JWTs");
    // extracing token from header 
    const authHeader = req.headers['authorization'] || req.headers['Authorization']; // 'Authorization': Bearer token
    const tokenInAuthHeader = authHeader?.split(' ')[1];

    const tokenInBearerHeader = req.headers['bearer']; // 'Bearer': token

    if (!tokenInAuthHeader && !tokenInBearerHeader)
        return res.status(401).send("No authorization header");
    jwt.verify(tokenInAuthHeader || tokenInBearerHeader, process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                console.log(err);
                return res.status(403).send("Error verifying JWTs");
            }
            req.username = decoded.UserInfo.username;
            req.roles = decoded.UserInfo.roles;
            console.log("JWT Verified");
            next();
        }
    );
}

module.exports = verifyJWT