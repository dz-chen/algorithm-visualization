************************by cdz
1.整个项目的目录结构是由express生成器生成(modules、data目录是自己创建的).参考：http://expressjs.com/zh-cn/starter/generator.html
2.项目入口是./bin/www（即执行 node ./bin/www）





////////////////疑惑
1.app.js中：
app.use('/', index);        //这个改变了localhost：3000后面应该显示的正常目录!!!
app.use('/users', users);   //??

2.