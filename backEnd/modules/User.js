const DB = require('./DB');
const Logger = require('./Logger');


//添加用户
const addUser = ({userid, password,userType }) => new Promise((resolve, reject) => DB.query({
    sql: 'INSERT INTO user(userID, password, userType) VALUES(?, ?, ?);',
    timeout: 10000,
    values: [userid, password, userType],
}).then((data) => {
    if (!data.results || !data.results.affectedRows || data.results.affectedRows !== 1) {
        Logger.info('添加失败！！');
        reject(new Error('失败'));
    } else {
        resolve();
    }
}).catch(err => reject(err)));


const getUserTypeByUsidAndPass = (userid, password) => new Promise((resolve, reject) => DB.query({
    sql: 'SELECT * FROM user WHERE userID = ? AND password = ? LIMIT 1;',   //sha1（）用于计算散列值
    timeout: 10000,
    values: [userid, password],
}).then((data) => {
    if (!data.results || data.results.length !== 1) {
        reject(new Error('查询失败'));
    } else {
        resolve(data.results[0].userType);    
    }
}).catch(err => reject(err)));


//为新用户创建对应的表格
const createUserActionTable=(userid)=>new Promise((resolve,reject)=>DB.query({
    sql:'CREATE TABLE '+'action_'+userid+' (id int(11) NOT NULL AUTO_INCREMENT,actionID int(11) NOT NULL, content varchar(512), type varchar(32),stepID int(11) NOT NULL, visitID int(11) NOT NULL, algorithm varchar(32) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARSET=utf8;',
    timeout:10000,
    //values:['action_'+userid],     为什么这里使用问号替代参数不行？？->只好用参数拼接成sql！！！
}).then((data)=>{
    var x=1;                        //不做任何操作
}).catch(err=>reject(err)));


const createUserQuestionTable=(userid)=>new Promise((resolve,reject)=>DB.query({
    sql:'CREATE TABLE '+'que_'+userid+' (id int(11) NOT NULL AUTO_INCREMENT,que varchar(512), ans varchar(512), msg varchar(512),type int(11),visitID int(11) not null,actionID int(11) not null,PRIMARY KEY(id)) DEFAULT CHARSET=utf8;',
    timeout:10000,
    //values:['que_'+userid],     为什么这里使用问号替代参数不行？？->只好用参数拼接成sql！！！
}).then((data)=>{
    var x=1;                        //不做任何操作
}).catch(err=>reject(err)));



const saveQue = ({ que, ans, msg, usid }) => new Promise((resolve, reject) => DB.query({
    sql: 'INSERT INTO que(que, ans, msg, usid) VALUES(?, ?, ?, ?);',
    timeout: 10000,
    values: [que, ans, msg, usid],
}).then((data) => {
    if (!data.results || !data.results.affectedRows || data.results.affectedRows !== 1) {
        reject(new Error('失败'));
    } else {
        resolve();
    }
}).catch(err => reject(err)));


// exports.getUserByUsid = getUserByUsid;
exports.getUserTypeByUsidAndPass = getUserTypeByUsidAndPass;
exports.addUser = addUser;
exports.saveQue = saveQue;
exports.createUserActionTable=createUserActionTable;
exports.createUserQuestionTable=createUserQuestionTable;