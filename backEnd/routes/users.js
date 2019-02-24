var express = require('express');
var router = express.Router();

const Tools = require('../modules/Tools');
const Logger = require('../modules/Logger');
const Authorize = require('../modules/Authorize');
const User = require('../modules/User');


/* GET users listing. */
router.get('/', Authorize, (req, res) => {
  // const { username } = req.session;
  // res.render('index_vc', { title: `用户 ${username}` });
  res.redirect('/');
});

/* GET 用户注册 */
router.get('/reg', (req, res) => {
  Tools.delUserSession(req);
  res.render('register');
});

/* GET 用户注册 */
router.post('/reg', (req, res) => {
  const { usid, password1, password } = req.body;
  if (password1 !== password) {
      res.render('register', { info: '密码不一致' });
      return;
  }
  const name = 'user';
  User.addUser({ name, usid, password }).then(() => {
      // 成功后保存session即可
      Tools.saveUserSession(req, { usid, name });
      Logger.info('用户注册成功，并登录');
      res.redirect('/users');
  }).catch(() => {
      res.render('register', { info: '注册失败' });
  });
});


/* GET 用户登录 */
router.get('/login', (req, res) => {
  Tools.delUserSession(req);
  res.render('login');
});

/* POST 用户登录 */
router.post('/login', (req, res) => {
  const { usid, password } = req.body;
  User.getUserByUsidAndPass(usid, password).then((data) => {
      // 登陆成功后保存session即可
      const { name } = data;
      Tools.saveUserSession(req, { usid, name });
      Logger.info('用户登陆成功');
      res.redirect('/users');
  }).catch(() => res.render('login', { info: 'fail' }));
});


/* GET 用户退出 */
router.get('/logout', (req, res) => {
  Tools.delUserSession(req);
  res.redirect('/users/login');
});


module.exports = router;
