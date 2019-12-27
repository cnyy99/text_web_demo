<template>
    <el-form ref="LoginFrom" :model="account" :rules="rules" label-position="left" label-width="0px"
             class="demo-ruleForm login-container">
        <h3 class="title">请登录{{project_name}}</h3>
        <el-form-item prop="username">
            <el-input type="text" v-model="account.username" auto-complete="off" placeholder="账号"
                      prefix-icon="el-icon-user" clearable></el-input>
        </el-form-item>
        <el-form-item prop="pwd">
            <el-input type="password" v-model="account.pwd" auto-complete="off" placeholder="密码"
                      prefix-icon="el-icon-lock" clearable show-password></el-input>
        </el-form-item>
        <Verify @success="inputSuccess('success')" @error="inputError('error')" :type="1" :show-button="false" :code-length="4"
                ref="Verify"></Verify>
        <!--        <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>-->
        <el-form-item>
            <el-button @click="checkCode()" type="primary" style="width:100%;" :loading="logining">登录</el-button>
        </el-form-item>
        <el-link href="/register"><strong>没有账号？点此注册</strong><i class="el-icon-document el-icon--right"></i></el-link>
    </el-form>
</template>

<script>
    import Verify from 'vue2-verify'
    import sha256 from 'crypto-js/sha256';

    export default {
        name: 'login',
        data() {
            return {
                project_name: '财务管理系统',
                logining: false,
                account: {
                    username: '',
                    pwd: ''
                },
                rules: {
                    username: [
                        {
                            required: true,
                            message: '请输入账号',
                            trigger: ['blur', 'change']
                        },
                    ],
                    pwd: [
                        {
                            required: true,
                            message: '请输入密码',
                            trigger: ['blur', 'change']
                        },
                    ]
                },
                checked: true
            };
        },
        methods: {
            inputSuccess(text) {
                this.$refs.LoginFrom.validate((valid) => {
                    if (valid) {
                        this.logining = true;
                        // alert('1username: ' + this.account.username + '\npwd: ' + this.account.pwd);
                        var pwd = sha256(this.account.pwd + '@Hi1Vssic7&kEIWb').toString();
                        this.account.pwd = pwd.substring(0, 20);
                        var loginParams = {
                            name: this.account.username,
                            pwd: pwd
                        };
                        this.$axios.post('/api/login', loginParams)
                            .then((data) => {
                                // alert(JSON.stringify(data, null, 2));
                                // console.log(JSON.stringify(data, null, 2));
                                // this.$router.replace('/home');
                                if (data.status === 200) {
                                    this.$store.commit('setLogin', true);
                                    this.$message({
                                        showClose: true,
                                        message: '登陆成功',
                                        type: 'success'
                                    });
                                    this.$store.commit('setAccount', data.data);
                                    this.$router.push('/home');
                                    return true;
                                } else {
                                    // alert("用户名或密码错误");
                                    this.$message({
                                        showClose: true,
                                        message: '登陆失败:用户名或密码错误',
                                        type: 'error'
                                    });
                                    this.logining = false;
                                    this.$refs.LoginFrom.resetFields();
                                    this.$refs.Verify.refresh();
                                    return false;
                                }
                            })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

                // alert('account.username: '+this.account.username+'\naccount.pwd: '+this.account.pwd);
                // console.log(text);
                // console.log('account.username: ' + this.account.username);
                // console.log('account.pwd: ' + this.account.pwd);
                return false;
            },
            inputError(text) {
                // alert("验证码错误！请重新输入");
                this.$message({
                    showClose: true,
                    message: '验证码错误请重新输入',
                    type: 'error'
                });
                // console.log(text);
                // console.log('account.username: ' + this.account.username);
                // console.log('account.pwd: ' + this.account.pwd);
                return false;
            },
            checkCode() {
                this.$refs.Verify.checkCode();
            }
        },
        components: {
            Verify
        }
    }
</script>


<style>
    body {
        background: #DFE9FB;
    }

    .login-container {
        width: 350px;
        height: 100%;
        margin-top: 10%;
        margin-left: auto;
        margin-right: auto;

    }

    .title {
        text-align: center;
    }

    .el-form-item {
        width: 100%;
        margin-top: 17px;
        margin-bottom: 15px
    }
</style>
