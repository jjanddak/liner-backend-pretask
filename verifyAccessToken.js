const ACCESS_SECRET = "1234"; //process.env.ACCESS_SECRET
const jwt = require('jsonwebtoken');

module.exports = function verifyAccessToken(accessToken) {
  if(!accessToken){
    return null;
  }
  try{
    return jwt.verify(accessToken, ACCESS_SECRET);
  }catch(err){
    return null;
  }
}