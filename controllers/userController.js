const Sequelize = require("sequelize");
const { user, highlight, page } = require("../models");
const Op = Sequelize.Op;

module.exports = {
  updateTheme: async (req, res) => {
    const body = req.body;

    const userInfo = await user.update({
      theme:body.themeId
    },
    {
      where : {
        id:body.userId
      }
    }).catch(err=>{
      console.log(err);
      return res.status(400).send("ERROR OCCURRED");
    });

    if(userInfo[0]===1){
      res.status(200).send("200 OK");
    }else{
      res.status(400).send("theme update failed");
    }
  },


}