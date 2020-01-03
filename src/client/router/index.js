import Vue from 'vue'
import Router from 'vue-router'

// 导入对应的vuex文件
import store from './../store/store'

// 导入相应的子组件
import Login from "../components/Login";
import Home from "../components/Home";
import Register from "../components/Register";
import notFound from "../components/notFound";
import text from "../components/my_text";
import comment from "../components/comment";
import axios from 'axios'
import sha256 from 'crypto-js/sha256';

Vue.use(Router);
const SALT = 'c@QSK2*fpav939#F';

var router = new Router({
    mode: 'history',
    routes: [
        {
            name: 'register',
            path: '/register',
            component: Register
        }, {
            name: 'login',
            path: '/login',
            component: Login
        },
        {
            name: 'home',
            path: '/home',
            component: Home,
            meta: {
                requireAuth: true,
            },
            children: [
                {
                    path: 'text',
                    component: text,
                    name: '文本情感分析',
                    meta: {
                        requireAuth: true,
                    },
                },
                {
                    path: 'comment',
                    component: comment,
                    name: '留言',
                    meta: {
                        requireAuth: true,
                    },
                },
            ]
        }, {
            path: '*',
            name: 'NotFound',
            // redirect: '/404',
            component: notFound,
        },
    ]
});
router.beforeEach((to, from, next) => {
    // 这里的meta就是我们刚刚在路由里面配置的meta

    if (to.meta.requireAuth) {
        // 下面这个判断是自行实现到底是否有没有登录
        if (store.state.isLogin) {
            // 登录就继续
            if (to.path === '/home/account') {
                if (store.state.account.type === 'administrator') {
                    next();
                } else {
                    next({
                        path: '/404',
                    });
                }
            } else {
                next();
            }
        } else {
            let accountString = null;
            try {
                accountString = Vue.cookies.get('account');
            } catch (e) {
                console.log("Vue.cookies.get('account') error: " + e);
                accountString = null;
            }
            if (accountString != null) {
                console.log('has cookie account verifying...');
                var accountStrings = accountString.split('.');
                axios.post('/api/getOne/Account', {
                    id: parseInt(accountStrings[0]),
                }).then((data) => {
                    var account = data.data;
                    // console.log(JSON.stringify(account,null,2));
                    // console.log(accountStrings);
                    if (sha256(account.name + SALT).toString() === accountStrings[1]) {
                        console.log('cookie 验证成功');
                        store.commit('setLogin', true);
                        store.commit('setAccount', account);

                        if (to.path === '/home/account') {
                            if (account.type === 'administrator') {
                                next();
                            } else {
                                next({
                                    path: '/404',
                                });
                            }
                        } else {
                            next();
                        }
                    } else {
                        console.log('cookie 验证失败');
                        next({
                            path: '/login',
                            query: {redirect: to.fullPath}
                        });
                    }
                })
            } else {
                // 没有登录跳转到登录页面，登录成功之后再返回到之前请求的页面
                next({
                    path: '/login',
                    query: {redirect: to.fullPath}
                });
            }

        }
    } else if ((to.path === '/login' || to.path === '/register') && store.state.isLogin) {

        // 不需要登录的，可以继续访问
        next({
            path: '/home',
        });
    } else {
        next();
    }
});

export default router
