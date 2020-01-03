<template>
    <div id="home">
        <el-container class="con_section">
            <el-header class="header">
                <el-image class="el-logo" :src="logoUrl" fit="scale-down"></el-image>
                <h2 class="headlogo">{{projectName}}</h2>
                <el-col :span="2" class="userinfo">
                    <el-dropdown @command="handleCommand">
                        <i class="el-icon-setting" style="margin-right: 15px"></i>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="changepwd">修改密码</el-dropdown-item>
                            <el-dropdown-item command="logout" style="color: red">注销</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <span>{{account.name}}</span>
                </el-col>
            </el-header>
            <el-container>
                <el-aside class="aside">
                    <el-menu default-active="1-1" class="el-menu-vertical-demo" @select="handleSelect">
                        <el-menu-item index="1-1">
                            <i class="el-icon-user"></i>
                            <span slot="title">文本情感分析</span>
                        </el-menu-item>
                        <el-menu-item index="1-2">
                            <i class="el-icon-notebook-2"></i>
                            <span slot="title">留言区</span>
                        </el-menu-item>
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
            <el-footer class="footer">Footer</el-footer>
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
            // if (this.account.type === 'administrator') {
            //     this.$router.push('/home/account');
            // } else {
            //     this.$router.push('/home/member');
            // }
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
                }
            },
            handleCommand(command) {
                if (command === 'logout') {
                    this.$axios.post('/api/logout', {}).then((data) => {
                        if (data.status === 200) {
                            this.$store.commit('setLogin', false);
                            this.$message({
                                message: '注销成功',
                                type: 'success'
                            });
                            this.$router.push('/login');
                        }
                    }).catch((err) => {
                        console.log(err);
                    })
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
        font-family: "Microsoft YaHei", serif;
    }

    .footer {
        height: 60px;
        line-height: 60px;
        background: #ECBB17;
        color: #000;
        font-family: "Microsoft YaHei", serif;
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

</style>
