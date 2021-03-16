const REFRESH_SECRET = "12345"
const jwt = require('jsonwebtoken');

module.exports = function verifyRefreshToken(refreshToken) {
  if(!refreshToken){
    return null;
  }
  try{
    return jwt.verify(refreshToken, REFRESH_SECRET);
  }catch(err){
    return null;
  }
}