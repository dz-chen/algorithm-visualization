************************by cdz
1.整个项目的目录结构是由express生成器生成(modules、data目录是自己创建的).参考：http://expressjs.com/zh-cn/starter/generator.html
2.项目入口是./bin/www（即执行 node ./bin/www）

3.访问流程：xxx.xxx.xxx.xxx:3000/　访问的是'/'目录，由index.js负责
   如果是初次访问，req的session部分没有userType等内容，只有cookie,被Autonrize重定向到登录界面
   输入用户名密码，登录成功会在数据库sessions中保存会话,然后自动定向到/users/
   此时向/users/的请求中session已经具userType等内容，Authorize授权通过，然后被重定向到用户主目录'/'


////////////////疑惑
1.app.js中：
app.use('/', index);        //这个改变了localhost：3000后面应该显示的正常目录!!!
app.use('/users', users);   //??

2.setSession到底将回话保存在哪里？？