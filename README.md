## fastgpt-admin
原作地址：https://github.com/c121914yu/FastGPT/

## 项目原理
使用tushan项目做前端，然后构造了一个与mongodb做沟通的API做后端，可以做到创建、修改和删除用户

## 使用方法
1. 修改根目录下的server.js文件中的mongodb数据库连接地址。
2. pnpm i && pnpm dev
3. 默认账号密码为tushan

## 未解决问题
1. 在React-Admin中，用户的唯一标识符为id,但在mongodb中唯一标识符为_id，我尝试构造了一个数据转换函数去转换，但不知道为什么它无法正常工作，该函数位于src/convertDataProvider.js中。因此目下的临时解决方案为修改依赖中的id为_id。
方法如下：
更新功能：node_modules\tushan\client\api\useUpdate.ts,111行，record.id-->record._id
          node_modules\tushan\client\components\edit\EditForm.tsx，45和50行的defaultValues.id-->defaultValues._id
删除功能：node_modules\tushan\client\api\useDelete.ts，107行的record.id-->record._id
2. UI问题，保留了原汁原味，供各位开发者自行开发

## 可能会有的功能
1. 对接数据库中的其他数据
2. tokens充值功能
