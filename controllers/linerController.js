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
      color_id: (colorArr.indexOf(body.colorHex)) % 3, //몇번 인덱스의 색을 썼는지
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

    //text가 있고, colorHex값이 존재하는 색중에 하나인지 유효성 검사
    if(!body.text && !colorArr.includes(body.colorHex)){
      return res.status(400).send("body content is invalid");
    }

    //request body의 highlightId, userId 유효성 검사
    const highlightInfo = await highlight.findOne({
      where : {
        id:body.highlightId,
        user_id: body.userId
      },
      include:[
        {
          model:page,
          attributes:["id"]
        }, 
        {
          model: user,
          attributes:["theme"]
        }
      ]
    }).catch(err=>{
      console.log(err);
      return res.status(400).send("highlight doesn't exist")
    })

    //변경하려는 색이 유저가 사용중인 테마의 색 3가지중에 하나가 아니면 변경하지 않고 이전의 색을 사용
    const maxIndex = ((highlightInfo.user.theme-1)*3)+2;
    const minIndex = ((highlightInfo.user.theme-1)*3);
    const colorIndex = colorArr.indexOf(body.colorHex); 
    
    //request body의 colorHex값이 유효하지 않을 때 이전의 colorHex값을 사용
    const oldColorHex = colorArr[((highlightInfo.user.theme-1)*3) + highlightInfo.color_id];

    const isUpdated = await highlight.update({
      color_id : colorIndex >= minIndex && colorIndex <= maxIndex ? colorIndex %3 : highlightInfo.color_id,
      text: body.text ? body.text : highlightInfo.text
    },
    {
      where: {
        id:body.highlightId,
        user_id:body.userId
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
        "colorHex" : colorIndex >= minIndex && colorIndex <= maxIndex ? body.colorHex : oldColorHex,
        "text": body.text ? body.text : highlightInfo.text
      })
    }else{
      res.status(400).send("highlight didn't updated");
    }
  },

  getHighlight: async (req, res) => {
    const body = req.body;

    //두값 모두 없을 때
    if(!body.pageId && !body.pageUrl || !body.userId){
      return res.status(400).send("body content is invalid");
    }

    let highlightInfo = {};
    //pageId로 가져오기
    if(body.pageId){
      highlightInfo = await highlight.findAll({
        where: {
          user_id:body.userId,
          page_id:body.pageId
        },
        // limit: 10,
        order: [["updatedAt", "DESC"]],
        include:[
          {
            model: user,
            attributes: ["theme"] //colorHex값 구하기위해 테마값 가져옴
          }
        ]
      }).catch(err=>{
        console.log(err);
        return res.status(400).send("get highlight failed");
      });
    }else{ //pageUrl로 가져오기
      const pageId = await page.findOne({
        where: {
          url: body.pageUrl
        }
      }).catch(err=>{
        console.log(err);
        return res.status(400).send("pageId doesn't exist");
      });

      highlightInfo = await highlight.findAll({
        where: {
          user_id:body.userId,
          page_id:pageId.id
        },
        // limit: 10,
        order: [["updatedAt", "DESC"]],
        include:[
          {
            model: user,
            attributes: ["theme"] //colorHex값 구하기위해 테마값 가져옴
          }
        ]
      }).catch(err=>{
        console.log(err);
        return res.status(400).send("get highlight failed");
      });
    }//if end

    // res.send(highlightInfo);

    highlightInfo = highlightInfo.map(ele => {
      return {
        highlightId: ele.id,
        userId: ele.user_id,
        pageId: ele.page_id,
        colorHex: colorArr[(ele.user.theme-1)*3+ele.color_id],
        text: ele.text
      }
    })

    res.status(200).send(highlightInfo);
  },


}