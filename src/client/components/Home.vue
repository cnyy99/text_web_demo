<template>
    <div id="home">
        <el-container class="con_section">
            <el-header class="header">
                <el-image class="el-logo" :src="logoUrl" fit="scale-down"></el-image>
                <h2 class="headlogo">{{projectName}}</h2>
                <el-col :span="2" class="userinfo" v-if="this.account!=null&&this.account!==undefined">
                    <el-dropdown @command="handleCommand">
                        <i class="el-icon-setting" style="margin-right: 15px"></i>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="logout" style="color: red">注销</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <span>{{account.name}}</span>
                </el-col><el-col :span="2" class="userinfo" v-else>
                    <router-link to="/login">点此登陆</router-link>
                </el-col>
            </el-header>
            <el-container>
                <el-aside class="aside">
                    <el-menu default-active="1-1" class="el-menu-vertical-demo" @select="handleSelect">
                        <div v-if="!account||account.type!=='administrator'">
                            <el-menu-item index="1-1">
                                <i class="el-icon-user"></i>
                                <span slot="title">文本情感分析</span>
                            </el-menu-item>
                            <el-menu-item index="1-2">
                                <i class="el-icon-notebook-2"></i>
                                <span slot="title">留言区</span>
                            </el-menu-item>
                        </div>
                        <div v-else>
                            <el-menu-item index="2-1">
                                <i class="el-icon-user"></i>
                                <span slot="title">账号管理</span>
                            </el-menu-item>
                            <el-menu-item index="2-2">
                                <i class="el-icon-user"></i>
                                <span slot="title">反馈管理</span>
                            </el-menu-item>
                            <el-menu-item index="2-3">
                                <i class="el-icon-user"></i>
                                <span slot="title">留言管理</span>
                            </el-menu-item>
                        </div>
                    </el-menu>
                </el-aside>
                <el-main class="home_main">
                    <el-col :span="24" class="breadcrumb-container">
                        <strong class="title">{{$route.name}}</strong>
                        <el-breadcrumb separator="/" class="breadcrumb-inner">
                            <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                                {{ item.name }}
                            </el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                    <el-col :span="24">
                        <div style="margin-top:10px">
                            <router-view></router-view>
                        </div>
                    </el-col>
                </el-main>
            </el-container>
            <el-footer class="footer" style="height: auto;">
                <el-row>
                    <el-row>
                        <el-col :span="12" :offset="6" class="text-center">
                            <a href="https://github.com/bjfunlp" class="social-item" target="_blank">
                                <font-awesome-icon :icon="['fab', 'github']" size="3x"/>
                            </a>

                            <a href="https://zh.wikipedia.org/zh-hans/%E6%96%87%E6%9C%AC%E6%83%85%E6%84%9F%E5%88%86%E6%9E%90"
                               class="social-item" target="_blank">
                                <font-awesome-icon :icon="['fab', 'wikipedia-w']" size="3x"/>
                            </a>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12" :offset="6" class="text-center"
                                style="color: black; padding-top: 10px;padding-bottom: 10px;">
                            Copyright &copy;
                            {{new Date().getFullYear()}}
                            - bjfunlp All rights reserved
                        </el-col>
                    </el-row>
                </el-row>
            </el-footer>
        </el-container>
    </div>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        data() {
            return {
                searchCriteria: '',
                logoUrl: '/static/logo1-t.png',
            }
        },
        created() {
            if (this.account&&this.account.type === 'administrator') {
                this.$router.push('/home/accountm');
            } else {
                this.$router.push('/home/text');
            }
        },
        methods: {
            handleIconClick(ev) {
                console.log(ev);
            },
            handleSelect(key, keyPath) {
                switch (key) {
                    case '1-1':
                        this.$router.push('/home/text');
                        break;
                    case '1-2':
                        this.$router.push('/home/comment');
                        break;
                    case '2-1':
                        this.$router.push('/home/accountm');
                        break;
                    case '2-2':
                        this.$router.push('/home/textm');
                        break;
                    case '2-3':
                        this.$router.push('/home/commentm');
                        break;
                }
            },
            handleCommand(command) {
                if (command === 'logout') {
                    this.$axios.post('/api/logout', {}).then((data) => {
                        if (data.status === 200) {
                            this.$store.commit('restoreAll', null);
                            this.$message({
                                message: '注销成功',
                                type: 'success'
                            });
                            this.$router.push('/home/text');
                        }
                    }).catch((err) => {
                        console.log(err);
                    });
                } else if (command === 'changepwd') {
                    this.$router.push('/home/changepwd');
                }
            }
        },
        computed: mapState([
            'account',
            'projectName',
        ])
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    body {
        background: white;
    }

    .con_section {
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 0px;
        width: 100%;
    }

    .header {
        height: 60px;
        line-height: 60px;
        background: #ECBB17;
        color: #000;
        /*font-family: "Microsoft YaHei", serif;*/
    }

    .footer {
        height: auto;
        /*line-height: 60px;*/
        background: #ECBB17;
        color: #000;
        /*font-family: "Microsoft YaHei", serif;*/
    }

    .el-menu-item.is-active {
        color: #67c23a;
    }

    .aside {
        flex: 0 0 230px;
        width: 230px;
        background: #eef1f6
    }

    .headlogo {
        float: left;
        height: 60px;
        margin: 0 20px;
        width: 300px;
    }

    ul.el-menu {
        background: #e4e8f1;
    }

    .userinfo {
        position: absolute;
        right: 0;
    }

    .el-submenu__title {
        background: #eef1f6;
    }

    .el_main {
        padding: 0px;
    }

    .home_main {
        padding: 10px;
    }

    .breadcrumb-container .title {
        width: 200px;
        float: left;
        color: #475669;
        font-size: 13px;
    }

    .breadcrumb-inner {
        float: right;
        font-size: 13px;
    }

    .el-breadcrumb__inner, .el-breadcrumb__inner a {
        font-weight: 400;
    }

    .el-logo {
        height: 60px;
        width: 150px;
        padding-left: 0;
        vertical-align: middle;
        display: inline-block;
        float: left;
    }

    a {
        color: inherit;
    }

    a:hover {
        color: white;
    }
</style>
