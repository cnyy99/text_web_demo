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
        comments: null,
        frontSalt:'@Hi1Vssic7&kEIWb',
        projectName:'demo',
    },
    mutations: {
        setLogin(state, new_login_state) {
            state.isLogin = new_login_state;
            // console.log('setLogin to ' + new_login_state);
        },
        setAccount(state, account) {
            state.account = account;
        },
        setComments(state, comments) {
            state.comments = comments;
        },
    },
    actions: {
        async loadData({commit, state}, data) {
            try {
                if (data.path.endsWith('/')) {
                    data.path = data.path.substring(0, data.path.length - 1);
                }
                let type = data.path.split('/').slice(-1).toString();
                const receiveData = await axios.post('/api/getAll/' + type, {
                    id: state.account.id
                });
                let saveType = type.toUpperCase()[0] + type.substring(1) + 's';
                commit('set' + saveType, receiveData.data);
                if (type !== 'member' && type !== 'account') {
                    const members = await axios.post('/api/getAll/member', {
                        id: state.account.id
                    });
                    let membersList = members.data.map((e) => {
                        return {
                            label: e.name,
                            value: e.id
                        }
                    });
                    commit('setMembersList', membersList);
                }
                return true;
            } catch (e) {
                console.log('数据加载失败: ' + e);
                return false;
            }
        },
        async getType({state}, path) {
            path = path.toString();
            if (path.endsWith('/')) {
                path = path.substring(0, path.length - 1);
            }
            return path.split('/').slice(-1).toString();
        }
    },
    plugins: debug ? [logger, PersistedState,] : [PersistedState],
});


export default store
