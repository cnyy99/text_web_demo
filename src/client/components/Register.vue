<template>
    <el-form ref="RegisterFrom" :model="account" :rules="rules" label-position="left" label-width="0px"
             class="demo-ruleForm login-container">
        <h3 class="title">{{NotAddAccount?'请注册'+projectName:FMessageUp}}</h3>
        <el-form-item prop="username">
            <el-input type="text" v-model="account.name" auto-complete="off" placeholder="账号"
                      prefix-icon="el-icon-user" clearable></el-input>
        </el-form-item>
        <el-form-item prop="email">
            <el-input type="email" v-model="account.email" auto-complete="off" placeholder="邮箱"
                      prefix-icon="el-icon-message" clearable></el-input>
        </el-form-item>
        <el-form-item prop="pwd">
            <el-input type="password" v-model="account.pwd" auto-complete="off" placeholder="密码"
                      prefix-icon="el-icon-lock" clearable show-password></el-input>
        </el-form-item>
        <el-form-item prop="pwd2">
            <el-input type="password" v-model="account.pwd2" auto-complete="off" placeholder="重新输入密码"
                      prefix-icon="el-icon-lock" clearable show-password></el-input>
        </el-form-item>
                <el-form-item prop="type" v-if="!NotAddAccount">
                    <el-select v-model="account.type" placeholder="请选择账号类型">
                        <el-option
                                v-for="item in typeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
        <Verify @success="inputSuccess('success')" @error="inputError('error')" :type="1" :show-button="false"
                :code-length="4"
                ref="VerifyRegister"></Verify>
        <!--        <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>-->
        <el-form-item>
            <el-button @click="checkCode()" type="primary" style="width:100%;">{{NotAddAccount?'注册':FMessageDown}}
            </el-button>
        </el-form-item>
        <el-link href="/login" v-if="NotAddAccount"><strong>已有账号？点此登陆</strong><i
                class="el-icon-document el-icon--right"></i></el-link>

    </el-form>
</template>

<script>
    import Verify from 'vue2-verify'
    import sha256 from 'crypto-js/sha256';
    import {mapState} from "vuex";

    export default {
        name: 'register',
        props: {
            NotAddAccount: {
                type: Boolean,
                default: true
            },
            FMessageUp: {
                type: String,
                default: ''
            },
            FMessageDown: {
                type: String,
                default: ''
            },
            typeOptions:{
                type: Array,
                default: []
            }
        },
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
            var validateEmail = (rule, value, callback) => {
                var regex = /^([0-9A-Za-z\-_.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
                if (value === '') {
                    callback(new Error('请输入邮箱'));
                } else if (regex.test(value)) {
                    callback();
                } else {
                    callback(new Error('邮箱地址非法'));
                }
            };
            return {
                logining: false,
                account: {
                    name: '',
                    pwd: '',
                    pwd2: '',
                    type: 'normal',
                    email: '',
                },
                rules: {
                    name: [
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
                    ],
                    pwd2: [
                        {
                            required: true,
                            validator: validatePass2,
                            trigger: ['blur', 'change']
                        },
                    ],
                    email: [
                        {
                            required: true,
                            validator: validateEmail,
                            trigger: ['blur', 'change']
                        },
                    ]
                },
                checked: true
            };
        },
        methods: {
            inputSuccess(text) {
                this.$refs.RegisterFrom.validate((valid) => {
                    if (valid) {
                        this.logining = true;
                        var pwd = sha256(this.account.pwd + this.frontSalt)
                            .toString();
                        this.account.pwd = pwd.substring(0, 20);
                        var registerParams = {
                            name: this.account.name,
                            email: this.account.email,
                            pwd: pwd,
                            type: this.account.type,
                        };
                        this.$axios.post('/api/register', registerParams)
                            .then((data) => {
                                // alert(JSON.stringify(data, null, 2));
                                console.log(JSON.stringify(data, null, 2));
                                if (data.status === 200) {
                                    this.$message({
                                        showClose: true,
                                        message: '注册成功，请登录',
                                        type: 'success'
                                    });
                                    if (this.NotAddAccount) {
                                        this.$router.push('/login');
                                    } else {
                                        this.$emit('setShowRegisterDialog', false);
                                        this.$message({
                                            showClose: true,
                                            message: "添加成功",
                                            type: 'success'
                                        });
                                    }
                                    return true;
                                } else {
                                    this.$message({
                                        showClose: true,
                                        message: '用户名已被使用，请重新输入',
                                        type: 'error'
                                    });
                                    this.logining = false;
                                    this.$refs.RegisterFrom.resetFields();
                                    this.$refs.VerifyRegister.refresh();
                                    return false;
                                }
                            })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
                // alert('1username: ' + this.account.username + '\npwd: ' + this.account.pwd + '\npwd2: ' + this.account.pwd2);
                // console.log(text);
                // console.log('account.username: ' + this.account.username);
                // console.log('account.pwd: ' + this.account.pwd);
                // console.log('account.pwd2: ' + this.account.pwd2);
                return false;
            },
            inputError(text) {
                this.$message({
                    showClose: true,
                    message: '验证码错误！请重新输入',
                    type: 'error'
                });
                // console.log(text);
                // console.log('account.username: ' + this.account.username);
                // console.log('account.pwd: ' + this.account.pwd);
                // console.log('account.pwd2: ' + this.account.pwd2);
                return false;
            },
            checkCode() {
                this.$refs.VerifyRegister.checkCode();
            }
        },
        components: {
            Verify
        },
        computed: mapState([
            'frontSalt',
            'projectName'
        ])
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
