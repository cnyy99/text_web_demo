import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import createPersistedState from "vuex-persistedstate"
import axios from 'axios'

const debug = process.env.NODE_ENV !== 'production';
const PersistedState = createPersistedState({
    storage: window.sessionStorage
});
Vue.use(Vuex);
const logger = createLogger({
    collapsed: false, // 自动展开记录的 mutation
    filter(mutation, stateBefore, stateAfter) {
        // 若 mutation 需要被记录，就让它返回 true 即可
        // 顺便，`mutation` 是个 { type, payload } 对象
        return true;
    },
    logger: console, // 自定义 console 实现，默认为 `console`
});
const store = new Vuex.Store({
    state: {
        isLogin: false,
        account: null,
        accounts: null,
        comments: null,
        texts: null,
        frontSalt: '@Hi1Vssic7&kEIWb',
        projectName: 'demo',
    },
    mutations: {
        setLogin(state, new_login_state) {
            state.isLogin = new_login_state;
            // console.log('setLogin to ' + new_login_state);
        },
        setAccount(state, account) {
            state.account = account;
        },
        setAccounts(state, accounts) {
            state.accounts = accounts;
        },
        setComments(state, comments) {
            state.comments = comments;
        },
        setTexts(state, texts) {
            state.texts = texts;
        },
        unshiftComment(state, comment) {
            state.comments.unshift(comment);
        },
        restoreAll(state, payload) {
            state.isLogin = false;
            state.account = null;
            state.accounts = null;
            state.comments = null;
            state.texts = null;
        }
    },
    actions: {

    },
    plugins: debug ? [logger, PersistedState,] : [PersistedState],
});


export default store
