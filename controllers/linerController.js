const Sequelize = require("sequelize");
const { user, highlight, page } = require("../models");
const Op = Sequelize.Op;

//colorHex를 보고 테마의 몇번 색상을 사용중인지 확인하고, 테마가 변경되어도 같은 순서의 색을 사용하도록 구현했습니다.
//colorHex 종류가 많아진다면 DB에 새로운 테이블이 필요하다고 생각했습니다.
//노션에 테마1-1번색 !== 입출력예시의 colorHex값이 달라서 테스트시 테마 1번색을 사용했습니다.
const colorArr = ["#ffff8d", "#a5f2e9", "#ffd5c8", "#f6f0aa", "#d3edd1", "#f9d6c1", "#f4ff40", "#8affd7", "#ffc477"];

module.exports = {
  create: async (req, res) => {
    const body = req.body;

    //필요한 값이 모두 있는지, colorHex가 테마에 존재하는 값인지 확인
    if (!body.userId || !body.pageUrl || !body.colorHex || !body.text || !colorArr.includes(body.colorHex)) {
      return res.send({ message: "Error : body content is invalid" });
    };

    const userInfo = await user.findOne({
      where: {
        id: body.userId
      }
    }).catch(err => console.log(err))

    const pageInfo = await page.findOrCreate({
      where: {
        url: body.pageUrl
      },
      defaults: {
        page_info: "page info, html" //일련의 과정을 통해서 페이지의 정보입력(구현생략 했습니다)
      }
    })
      .then((page, created) => {
        return page[0];
      })
      .catch(err => console.log(err))

    const highlightInfo = await highlight.create({
      user_id: body.userId,
      page_id: pageInfo.id,
      theme_id: userInfo.theme, //user테이블의 theme 번호
      color_id: ((colorArr.indexOf(body.colorHex)) + 1) % 3, //몇번색을 썼는지
      text: body.text
    }).catch(err => console.log(err))

    res.status(200).send({
      "highlightId": highlightInfo.id,
      "userId": userInfo.id,
      "pageId": pageInfo.id,
      "colorHex": colorArr[colorArr.indexOf(body.colorHex)],
      "text": body.text
    });
  },

  update: async (req, res) => {
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