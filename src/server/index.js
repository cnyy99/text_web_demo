import express from 'express'
import path from 'path'
import favicon from 'serve-favicon'
import logger from 'morgan'
import bodyParser from 'body-parser'
import webpack from 'webpack'
import "reflect-metadata";
// 引入history模块
import history from 'connect-history-api-fallback'
import {Account, Text, Comment} from './data/model/Models'

import {createConnection, getRepository, In} from 'typeorm'
import sha256 from 'crypto-js/sha256';
import sqlOptions from './data/sqlOptions'
const SALT = 'c@QSK2*fpav939#F';
// 正式环境时，下面两个模块不需要引入
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

import config from '../../build/webpack.dev.conf'


let Repositories = {
    accountRepository: null,
    textRepository: null,
    commentRepository: null,
};
const RepositoryString = 'Repository';
createConnection(sqlOptions).then(async (connection) => {
    Repositories.accountRepository = getRepository(Account);
    Repositories.textRepository = getRepository(Text);
    Repositories.commentRepository = getRepository(Comment);
    console.log('数据库连接成功');
    return true
}).catch((error) => {
    console.log('应用启动失败');
    console.log(error);
    return false
});

const app = express();

// 引入history模式让浏览器进行前端路由页面跳转
app.use(history());

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

const compiler = webpack(config);
//webpack 中间件
app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: {colors: true}
}));

app.use(webpackHotMiddleware(compiler));
app.use(express.static(path.join(__dirname, 'views')));
app.use('/static', express.static('src/client/static'));
app.use('/static', express.static('src/server/static'));
app.get('/', function (req, res) {
    res.sendFile('./views/index.html')
});

app.post('/api/login', async function (req, res) {
    let account = await Repositories.accountRepository.findOne(
        {name: req.body.name}
    );
    if (account && account.pwd === sha256(req.body.pwd + SALT).toString()) {
        let cookieString = account.id + '.' + sha256(account.name + SALT)
            .toString();
        account.pwd = account.pwd.substring(0, 1);
        res.cookie('account', cookieString, {expires: new Date(Date.now() + 1000 * 60 * 10)});
        res.json(account);
    } else {
        res.status(203).end();
    }
});

app.post('/api/register', async function (req, res) {
    let id = req.body.id ? req.body.id : undefined;
    let type = req.body.type ? req.body.type : 'normal';
    const account = new Account(req.body.name, sha256(req.body.pwd + SALT).toString(), type, undefined, undefined, id);
    try {
        const newAccount = await Repositories.accountRepository.save(account);
        res.status(200).end();
    } catch (e) {
        console.log('error ==> ' + e);
        res.status(203).end();
    }
    // res.json(toJSON(account, 'success'));
});

app.post('/api/changepwd', async function (req, res) {
    // console.log(JSON.stringify(req.body,null,2));
    const account = new Account(undefined, sha256(req.body.pwd + SALT)
        .toString(), undefined, undefined, undefined, req.body.id);
    try {
        const newAccount = await Repositories.accountRepository.save(account);
        res.status(200).end();
    } catch (e) {
        console.log('error ==> ' + e);
        res.status(203).end();
    }
});

app.post('/api/logout', function (req, res) {
    res.clearCookie('account');
    res.status(200).end();
});

app.post('/api/getOne/:type', async function (req, res) {
    try {
        const data = await Repositories[req.params.type.toLowerCase() + RepositoryString].findOne(req.body.id);
        if (req.params.type.toLowerCase() === 'account') {
            data.pwd = data.pwd.substring(0, 1);
        }
        res.json(data);
    } catch (e) {
        console.log('RepositoryType : ' + req.params.type.toLowerCase());
        console.log('Repository : ' + JSON.stringify(req.body.id, null, 2));
        console.log('error ==> ' + e);
        res.status(203).end();
    }
});

app.post('/api/getAll/:type', async function (req, res) {
    try {
        if (req.params.type.toLowerCase() === 'account') {
            const account = await Repositories.accountRepository.findOne(req.body.id);
            if (account.type === 'administrator') {
                const accountList = await Repositories.accountRepository.find();
                res.json(accountList);
            } else {
                res.status(203).end();
            }
        } else {
            let members = await Repositories.memberRepository.find({
                account: {id: req.body.id}
            });
            if (req.params.type.toLowerCase() === 'member') {
                res.json(members);
            } else {
                let memberIds = members.map((a) => a.id);
                // console.log('memberIds: ' + memberIds);
                let tempDataList = await Repositories[req.params.type.toLowerCase() + RepositoryString].find({
                    member: {id: In(memberIds)},
                });
                let tempDataIds = tempDataList.map((a) => a.id);
                let realDataList = await Repositories[req.params.type.toLowerCase() + RepositoryString].findByIds(tempDataIds, {
                    relations: ['member']
                });
                // console.log('realDataList: ' + JSON.stringify(realDataList, null, 2));
                res.json(realDataList);
            }
        }
    } catch (e) {
        console.log('RepositoryType : ' + req.params.type.toLowerCase());
        console.log('Repository : ' + JSON.stringify(req.body.id, null, 2));
        console.log('error ==> ' + e);
        res.status(203).end();
    }
});

app.post('/api/save/:type', async function (req, res) {
    // console.log(JSON.stringify(req.body.member, null, 2));
    try {
        const data = await Repositories[req.params.type.toLowerCase() + RepositoryString].save(req.body.data);
        res.json(data);
        // console.log(JSON.stringify(data,null,2));
    } catch (e) {
        console.log('RepositoryType : ' + req.params.type.toLowerCase());
        console.log('Repository : ' + JSON.stringify(req.body.data, null, 2));
        console.log('error ==> ' + e);
        res.status(203).end();
    }
});

app.post('/api/remove/:type', async function (req, res) {
    try {
        if (req.body.data.id === undefined) {
            res.status(200).end();
        } else {
            const data = await Repositories[req.params.type.toLowerCase() + RepositoryString].remove(req.body.data);
            res.status(200).end();
        }
    } catch (e) {
        console.log('RepositoryType : ' + req.params.type.toLowerCase());
        console.log('Repository : ' + JSON.stringify(req.body.data, null, 2));
        console.log('error ==> ' + e);
        res.status(203).end();
    }

});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error(req.url + ': Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    console.log(err);
    res.send(err.message);
});

// 设置监听端口
const SERVER_PORT = 4000;
app.listen(SERVER_PORT, () => {
    console.info(`服务已经启动，监听端口${SERVER_PORT}`);
});

export default app
