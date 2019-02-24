const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const encoding = require('encoding');
const iconv = require('iconv-lite');
const { exec } = require('child_process');

const Authorize = require('../modules/Authorize');
const logger = require('../modules/Logger');
const User = require('../modules/User');
const Algo = require('../modules/Algo');


/* GET home page. */
router.get('/', Authorize, (req, res, next) => {
  logger.info(`get index from ${process.pid}`);
  const { usid } = req.session;
  Algo.getAlgos().then(algos => {
      res.render('index_vc', { usid, algos });
  }).catch(err => next(new Error(err)));
});


//创建EdgeIn,保存到data中(edgeIn.txt)
function createEdgeIn(edgeIn, path1) {
  let a = JSON.parse(edgeIn);
  a = a.map(v => v.join(' '));
  a = a.join('\r\n');
  a = encoding.convert(a, 'GBK');
  // a = iconv.encode(a, 'ascii').toString('ascii');
  console.log('createEdgeIn', a);
  fs.writeFileSync(path1, a);
}


function createPointIn(pointIn, path1) {
  let a = JSON.parse(pointIn);
  a = a.map(v => v.join(' '));
  a = a.join('\r\n');
  a = encoding.convert(a, 'GBK');
  // a = iconv.encode(a, 'us-ascii').toString('ascii');
  console.log('createPointIn', a);

  fs.writeFileSync(path1, a);
}


function createGlobalIn(globalIn, path1) {
  let a = JSON.parse(globalIn);
  a = a.map(v => v.join(' '));
  a = a.join('\r\n');
  a = encoding.convert(a, 'GBK');
  // a = iconv.encode(a, 'ascii').toString('ascii');
  console.log('createGlobalIn', a);

  fs.writeFileSync(path1, a);
}


/* 保存答错的题目 */  
router.post('/collect', Authorize, (req, res, next) => {
  const { que, ans, msg } = req.body;
  const { usid } = req.session;

  logger.info(usid);
  logger.info(que);
  logger.info(ans);
  logger.info(msg);

  User.saveQue({ que, ans, msg, usid }).then(() => {
      res.end();
  }).catch(err => next(new Error(`error ${err}`)));
});


/* 保存数据  data */    //注意，取消回调函数Authorize,否则需要跳转登录不好调试!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!
router.post('/data',(req, res, next) => {
  
  //const { usid } = req.session;  取消登录，注释此项
  const { edgeIn, pointIn, globalIn, sName, eName, algo } = req.body;

  logger.info(edgeIn);
  logger.info(pointIn);
  logger.info(globalIn);
  logger.info(sName);
  logger.info(eName);
  logger.info(algo);

  //const p = path.resolve(__dirname, '../data/', usid);
  const p = path.resolve(__dirname, '../data/', '123456');  //临时使用123456代替usid
  if (!fs.existsSync(p)) {
      fs.mkdirSync(p);
  }
  createGlobalIn(globalIn, path.resolve(p, 'globalIn.txt'));
  createEdgeIn(edgeIn, path.resolve(p, 'edgeIn.txt'));
  createPointIn(pointIn, path.resolve(p, 'pointIn.txt'));

  //以下直接写edge.txt 和point.txt实际上这样就够了（对于我的DJ算法,by cdz）
  createEdgeIn(edgeIn, path.resolve(p, 'edge.txt'));
  createPointIn(pointIn, path.resolve(p, 'point.txt'));

  const exe = path.resolve(__dirname, '../bin/exe/'+algo);
  const str = `${exe} ${p}/  ${sName}`;   //exe是指定C++程序的位置， p指定文件路径、sName指定起点名字
  logger.info(str);
  //const encodingStr = 'gb2312';   //在linux下cout的编码为utf-8,在wondows下为gbk，没搞懂之前的ＤＦＳ为什么可以使用cp936?????
  var  encodingStr='';
  if(algo=="DFS")     //按理应该使用utf-8编码，这里为了不改动配置好了ＤＦＳ代码，针对这一算法特殊处理
    encodingStr='gb2312';
  else
    encodingStr='utf-8';
  //调用C++程序执行
  //exec() 方法用于检索字符串中的正则表达式的匹配
  exec(str, { encoding: 'buffer' }, (error, stdout, stderr) => {
      if (error === null) {
          const resStr = iconv.decode(stdout, encodingStr);
          logger.info(resStr);
          const stepsArray = resStr.split('\n');
          stepsArray.filter(v => v.length > 0);
          res.json({ code: 1, steps: stepsArray });
      } else {
          logger.info(`exec error: ${stderr}`);
          next(new Error('error'));
      }
  });
});



//读取代码文件并返回给前端显示
router.post('/code',(req,res,next)=>{
   var {codeName}=req.body;
   //console.log("codeName:"+codeName);
   const codePath=path.resolve(__dirname, '../data/','123456',codeName);
   var code=fs.readFileSync(codePath,'utf-8');
   //console.log(code);
   res.send(code);  //返回响应数据
});



module.exports = router;
