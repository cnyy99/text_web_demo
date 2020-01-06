![logo1](./src/client/static/logo1-t.png)

# 项目说明 

text_web_demo 是一个基于node.js与vue的文本情感分析体验demo，具有登陆、注册、文本分析、反馈结果、留言等功能。

访问 [http://www.bjfunlp.com/](http://www.bjfunlp.com/) 即可体验。



## 目录结构

```
├─.babelrc -------------------- // babel配置
├─.eslintrc ------------------- // eslint配置
├─LICENSE 
├─README.md 
├─build ----------------------- // build相关配置
│ ├─build.js 
│ ├─check-versions.js 
│ ├─dev-client.js 
│ ├─utils.js 
│ ├─vue-loader.conf.js 
│ ├─webpack.base.conf.js 
│ ├─webpack.dev.conf.js 
│ └─webpack.prod.conf.js 
├─config ---------------------- // 配置文件
│ ├─dev.env.js 
│ ├─index.js 
│ └─prod.env.js 
├─index.js -------------------- // 主程序
├─nodemon.json ---------------- // nodemon配置
├─package-lock.json 
├─package.json ---------------- // 项目依赖
└─src 
  ├─client -------------------- // 前端
  │ ├─App.vue ----------------- // 主组件
  │ ├─components -------------- // 组件
  │ │ ├─Home.vue -------------- // home页面组件
  │ │ ├─Login.vue ------------- // 登陆组件
  │ │ ├─Readme.md 
  │ │ ├─Register.vue ---------- // 注册组件
  │ │ ├─accountM.vue ---------- // 用户管理组件
  │ │ ├─comment.vue ----------- // 留言组件
  │ │ ├─commentM.vue ---------- // 留言管理组件
  │ │ ├─my_text.vue ----------- // 文本分析组件
  │ │ ├─mychart.vue ----------- // 图标组件
  │ │ ├─notFound.vue ---------- // 404组件
  │ │ └─textM.vue ------------- // 反馈管理组件
  │ ├─index.js ---------------- // 前端主程序
  │ ├─router ------------------ // vue-router配置文件
  │ │ ├─Readme.md 
  │ │ └─index.js 
  │ ├─static ------------------ // 静态资源文件
  │ │ ├─Readme.md 
  │ │ ├─logo1-t.png 
  │ │ ├─logo1.png 
  │ │ ├─logo2-t.png 
  │ │ ├─logo2.jpg 
  │ │ ├─logo3-t.png 
  │ │ ├─logo3.png 
  │ │ └─robot.png 
  │ ├─store ------------------- // vuex 配置文件
  │ │ ├─Readme.md 
  │ │ └─store.js 
  │ └─views ------------------- // 拼接文件
  │   └─Readme.md 
  └─server -------------------- // 后端
    ├─config ------------------ // 配置文件
    │ └─Readme.md 
    ├─data 
    │ ├─dao ------------------- // 数据库测试
    │ │ ├─Readme.md 
    │ │ └─index.js 
    │ ├─entity ---------------- // 数据实体配置
    │ │ ├─AccountSchema.js 
    │ │ ├─CommentSchema.js 
    │ │ └─TextSchema.js 
    │ ├─model ----------------- // 数据模型
    │ │ ├─Models.js 
    │ │ └─Readme.md 
    │ └─sqlOptions.js --------- // 数据库相关配置
    ├─index.js ---------------- // 后端主程序
    ├─public ------------------ // 静态资源文件
    │ ├─Readme.md 
    │ └─favicon.ico 
    ├─static ------------------ // 静态文件
    │ └─Readme.md 
    └─views ------------------- // 主页面
      └─index.html 
```



## 安装及快速开始

本地运行项目

```shell
$  cd web_demo
$  npm i      # 安装依赖
$  npm start  # visit http://localhost:80
```

build 前端代码

```shell
$  npm run-script build  # build in ./dist/
```

数据库相关配置文件在`/src/server/data/sqlOptions.js`中，需要先配置数据库连接的相关参数，并提前建立数据库，数据库中的表无需提前建立，项目会自动生成。

## api

### 创建新用户
#### Reuqest

- Method: **POST**
- URL: ```/api/register```
- Headers： Content-Type:application/json
- Body:
```json
{
    ”name“: name,
   ”email“: email,
     “pwd”: pwd,
    ”type“: type,
}
```

#### Response
- Body
```json
{
  "code": 200,
}
```



### 登陆

#### Reuqest

- Method: **POST**
- URL: ```/api/login```
- Headers： Content-Type:application/json
- Body:

```json
{
    ”name“: name,
     “pwd”: pwd,
}
```

#### Response

- Body

```json
{
  "code": 200,
  “data”:{
    "id": 2,
    "name": "123",
    "pwd": "0",
    "email": "123@123.ckm",
    "type": "administrator"
  }
}
```



### 文本分析

#### Reuqest

- Method: **POST**
- URL: ```/api/getSenti```
- Headers： Content-Type:application/json
- Body:

```json
{
    “rurl”: “”,
    “textarea”: “i love you”,
}
```

#### Response

- Body

```json
{
  "code": 200,
  “data”:[
    [
      0.9766928633040809,
      0.023307136695919155
    ]
  ]

}
```



### 提交反馈

#### Reuqest

- Method: **POST**
- URL: ```/api/save/text```
- Headers： Content-Type:application/json
- Body:

```json
{
  "data": {
    "content": "i love you",
    "oldType": 0.9766928633040809,
    "newType": 1,
    "dateTime": "2020-01-06T02:18:20.186Z",
    "textComment": "yes",
    "account": {
      "id": 6,
      "name": "12345",
      "pwd": "0",
      "email": "321@3124.sad",
      "type": "normal"
    }
  }
}

```

#### Response

- Body

```json
{
  "code": 200,
  “data”:{
    "content": "i love you",
    "oldType": 0.9766928633040809,
    "newType": 1,
    "dateTime": "2020-01-06T02:15:59.330Z",
    "textComment": "yes",
    "account": {
      "id": 6,
      "name": "12345",
      "pwd": "0",
      "email": "321@3124.sad",
      "type": "normal"
    },
    "id": 6
  }
}
```



### 提交留言

#### Reuqest

- Method: **POST**
- URL: ```/api/save/comment```
- Headers： Content-Type:application/json
- Body:

```json
{
  "data": {
    "content": "love",
    "dateTime": "2020-01-06T02:20:51.639Z",
    "account": {
      "id": 6,
      "name": "12345",
      "pwd": "0",
      "email": "321@3124.sad",
      "type": "normal"
    }
  }
}


```

#### Response

- Body

```json
{
  "code": 200,
  “data”:{
    "content": "love",
    "dateTime": "2020-01-06T02:20:51.639Z",
    "account": {
      "id": 6,
      "name": "12345",
      "pwd": "0",
      "email": "321@3124.sad",
      "type": "normal"
    },
    "id": 11
	}
}
```



### 获得全部{type}

#### Reuqest

- Method: **POST**
- URL: ```/api/getAll/{type}```
- Headers： Content-Type:application/json
- Body:

```json
{
  
}
```

#### Response

- Body

```json
{
  "code": 200,
  “data”:[]
}
```

