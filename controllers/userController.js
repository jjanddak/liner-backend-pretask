const Sequelize = require("sequelize");
const { user, highlight, page } = require("../models");
const Op = Sequelize.Op;
const jwt = require('jsonwebtoken');
const verifyAccessToken = require("../verifyAccessToken");
const verifyRefreshToken = require("../verifyRefreshToken");
const ACCESS_SECRET = "1234";
const REFRESH_SECRET = "12345";

module.exports = {
  signUp: async (req, res) => {
    const body = req.body;

    //유효성 검사
    if(!body.username || !body.password){
      return res.status(400).send("body content is invalid");
    }

    const isValidName = await user.findOne({
      where: {
        username: body.username
      }
    }).catch(err=>res.status(400).send("username find failed"));

    //유저네임이 이미 사용중일 때
    if(isValidName){
      return res.status(400).send("username already exist");
    }

    await user.create({
      theme: 1, //테마 기본값 1
      username: body.username,
      password: body.password //해싱된 값이라 생각하고 해싱처리 생략
    }).catch(err=>res.status(400).send("sign up failed"));

    res.status(200).send({message:"signup success"});
  },

  login: async (req, res) => {
    const body = req.body;

    //유효성 검사
    if(!body.username || !body.password){
      return res.status(400).send("body content is invalid");
    }

    const userInfo = await user.findOne({
      where: {
        username: body.username,
        password: body.password
      }
    }).catch(err=>res.status(400).send("find userInfo failed"));

    if(!userInfo){ //유저 정보가 존재하지 않을 때
      res.status(400).send("user doesn't exist");
    }else{

      //JWT(access, refresh)토큰 생성후 응답
      const accesstoken=jwt.sign({
        id:userInfo.id,
        username:userInfo.username,
        iat:Math.floor(Date.now() / 1000),
        exp:Math.floor(Date.now() / 1000) + (60 * 60 * 24) //24시간동안 유효
      },ACCESS_SECRET);
  
      const refreshtoken=jwt.sign({
        id:userInfo.id,
        username:userInfo.username,
        iat:Math.floor(Date.now() / 1000),
        exp:Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 3) //3일동안 유효
      },REFRESH_SECRET);
  
      res.cookie('refreshToken', refreshtoken, {
        secure: true,
        httpOnly: true,
        sameSite:'none',
      });

      res.status(200).send({
        username:userInfo.username,
        accessToken:accesstoken
      });

    }//if end

  },

  updateTheme: async (req, res) => {
    const body = req.body;

    //토큰인증
    const authorization = req.headers["authorization"];
    let accessToken=authorization.split(" ")[1]; //0번인덱스는 'Bearer' 1번이 토큰정보

    const isAccessValid = verifyAccessToken(accessToken);

    //AccessToken 유효하지 않을 때
    if(!isAccessValid){
      //RefreshToken 확인
      const refreshToken = req.cookies.refreshToken;
      if(!refreshToken){
        return res.status(400).json("refresh token not provided");
      }
      const isRefeshValid = verifyRefreshToken(refreshToken);

      //RefreshToken 또한 유효하지 않을 때
      if(!isRefeshValid){
        return res.status(400).send("invalid refreshToken");
      }else{
        //AccessToken 재발급
        accessToken=jwt.sign({
          id:refreshToken.id,
          username:refreshToken.username,
        },ACCESS_SECRET);
      }
    }

    const isUpdated = await user.update({
      theme:body.themeId
    },
    {
      where : {
        id:body.userId
      }
    }).catch(err=>{
      console.log(err);
      return res.status(400).send("theme update failed");
    });

    if(isUpdated[0]===1){
      res.status(200).send({message:"200 OK", accessToken:isAccessValid ? accessToken : null});
    }else{
      res.status(400).send("theme update failed");
    }
  },


}