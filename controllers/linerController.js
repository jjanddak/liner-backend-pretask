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
      return res.status(400).send({ message: "body content is invalid" });
    };

    const userInfo = await user.findOne({
      where: {
        id: body.userId
      }
    }).catch(err => {
      console.log(err);
      return res.status(400).send("user doesn't exist")
    })

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
      .catch(err => {
        console.log(err);
        return res.status(400).send("highlight create failed")
      })

    const highlightInfo = await highlight.create({
      user_id: body.userId,
      page_id: pageInfo.id,
      theme_id: userInfo.theme, //user테이블의 theme 번호
      color_id: ((colorArr.indexOf(body.colorHex)) + 1) % 3, //몇번색을 썼는지
      text: body.text
    }).catch(err => {
      console.log(err);
      return res.status(400).send("highlight create failed")
    })

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

    //유효성 검사
    if(!body.text || !body.colorHex){
      return res.status(400).send("body content is invalid");
    }else if(!colorArr.includes(body.colorHex)){
      return res.status(400).send("colorHex is invalid")
    }

    //highlightId 유효성 검사
    const highlightInfo = await highlight.findOne({
      where : {
        id:body.highlightId,
        user_id: body.userId
      },
      include:[
        {
          model:page,
          attributes:["id"]
        }
      ]
    }).catch(err=>{
      console.log(err);
      return res.status(400).send("highlight doesn't exist")
    })

    const isUpdated = await highlight.update({
      colorHex : body.colorHex ? body.colorHex : highlightInfo.colorHex,
      text: body.text ? body.text : highlightInfo.text
    },
    {
      where: {
        id:body.highlightId,
        user_id:body.userId
        //다른 유저의 하이라이트를 수정하지 못하도록 유저아이디도 일치하는지 검사
      }
    }).catch(err=>{
      console.log(err);
      return res.status(400).send("update failed");
    });

    if(isUpdated[0]===1){
      res.status(200).send({
        "highlightId": body.highlightId,  
        "userId": body.userId,
        "pageId": highlightInfo.page.id,
        "colorHex" : body.colorHex ? body.colorHex : highlightInfo.colorHex,
        "text": body.text ? body.text : highlightInfo.text
      })
    }else{
      res.status(400).send("highlight didn't updated");
    }
  },


}