<template>
    <el-form ref="changePwdFrom" :model="account" :rules="rules" label-position="left" label-width="0px"
             class="demo-ruleForm login-container">
        <h3 class="change-title">修改密码</h3>
        <el-form-item prop="pwd">
            <el-input type="password" v-model="account.pwd" auto-complete="off" placeholder="请输入新密码"
                      prefix-icon="el-icon-lock" clearable show-password></el-input>
        </el-form-item>
        <el-form-item prop="pwd2">
            <el-input type="password" v-model="account.pwd2" auto-complete="off" placeholder="重新输入密码"
                      prefix-icon="el-icon-lock" clearable show-password></el-input>
        </el-form-item>
        <Verify @success="inputSuccess('success')" @error="inputError('error')" :type="1" :show-button="false"
                ref="VerifyChangePwd"></Verify>
        <!--        <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>-->
        <el-form-item>
            <el-button @click="checkCode()" type="primary" style="width:100%;">确认修改</el-button>
        </el-form-item>

    </el-form>
</template>

<script>
    import Verify from 'vue2-verify'
    import sha256 from 'crypto-js/sha256';

    export default {
        name: 'changepwd',
        data() {
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.account.pwd) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                project_name: '财务管理系统',
                logining: false,
                account: {
                    username: '',
                    pwd: '',
                    pwd2: '',
                },
                rules: {
                    pwd: [
                        {
                            required: true,
                            message: '请输入密码',
                            trigger: ['blur', 'change']
                        },
                    ],
                    pwd2: [
                        {
                            required: true,
                            validator: validatePass2,
                            trigger: ['blur', 'change']
                        },
                    ]
                },
                checked: true
            };
        },
        methods: {
            inputSuccess(text) {
                this.$refs.changePwdFrom.validate((valid) => {
                    if (valid) {
                        this.logining = true;
                        var pwd = sha256(this.account.pwd + '@Hi1Vssic7&kEIWb')
                            .toString();
                        this.account.pwd = pwd.substring(0, 20);
                        this.account.pwd2 = pwd.substring(0, 20);
                        var changePwdParams = {
                            id:this.$store.state.account.id,
                            pwd: pwd
                        };
                        this.$axios.post('/api/changepwd', changePwdParams)
                            .then((data) => {
                                // alert(JSON.stringify(data, null, 2));
                                console.log(JSON.stringify(data, null, 2));
                                // this.$router.replace('/home');
                                if (data.status === 200) {
                                    this.$message({
                                        showClose: true,
                                        message: '密码修改成功',
                                        type: 'success'
                                    });
                                    this.$router.push('/home');
                                    return true;
                                } else {
                                    this.$message({
                                        showClose: true,
                                        message: '密码修改失败',
                                        type: 'error'
                                    });
                                    this.logining = false;
                                    this.$refs.changePwdFrom.resetFields();
                                    this.$refs.VerifyChangePwd.refresh();
                                    return false;
                                }
                            })
                    } else {
                        // alert('error submit!!');
                        console.log('error submit!!');
                        return false;
                    }
                });
                // alert('1username: ' + this.account.username + '\npwd: ' + this.account.pwd + '\npwd2: ' + this.account.pwd2);
                console.log(text);
                console.log('account.username: ' + this.account.username);
                console.log('account.pwd: ' + this.account.pwd);
                console.log('account.pwd2: ' + this.account.pwd2);
                return false;
            },
            inputError(text) {
                this.$message({
                    showClose: true,
                    message: '验证码错误！请重新输入',
                    type: 'error'
                });
                // alert("验证码错误！请重新输入");
                console.log(text);
                console.log('account.username: ' + this.account.username);
                console.log('account.pwd: ' + this.account.pwd);
                console.log('account.pwd2: ' + this.account.pwd2);
                return false;
            },
            checkCode() {
                this.$refs.VerifyChangePwd.checkCode();
            }
        },
        components: {
            Verify
        }
    }
</script>


<style>
    body {
        background: white;
    }
    .login-container {
        width: 350px;
        height: 100%;
        margin-top: 10%;
        margin-left: auto;
        margin-right: auto;

    }

    .change-title {
        text-align: center;
    }

    .el-form-item {
        width: 100%;
        margin-top: 17px;
        margin-bottom: 15px
    }
</style>