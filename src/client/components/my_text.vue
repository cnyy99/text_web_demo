<template>
    <div class="back">
        <el-row class="el-myrow">
            <el-col :span="13" :offset="6">
                <div>
                    <span>类型：  </span>
                    <el-radio-group v-model="type" style="padding-left: 20px;">
                        <el-radio-button label="general">通用</el-radio-button>
                        <el-radio-button label="auto">汽车</el-radio-button>
                        <el-radio-button label="kitchen">厨具</el-radio-button>
                        <el-radio-button label="food">餐饮</el-radio-button>
                        <el-radio-button label="news">新闻</el-radio-button>
                        <el-radio-button label="weibo">微博</el-radio-button>
                    </el-radio-group>
                </div>
            </el-col>
        </el-row>
        <el-row class="el-myrow">
            <el-col :span="13" :offset="6">
                <el-input
                        type="textarea"
                        placeholder="请输入要分析的文本"
                        :autosize="{ minRows: 3, maxRows: 5}"
                        v-model="textarea">
                </el-input>
            </el-col>
        </el-row>
        <el-row class="el-myrow">
            <el-col :span="5" :offset="18">
                <el-button icon="el-icon-upload2" @click="submitText()">提交
                </el-button>
            </el-col>
        </el-row>
        <el-row>
            <div v-bind:style="{display:chartShow}">
                <!--            <div v-bind:class="[chartShow?'activeClass' : 'nActiveClass']">-->
                <mychart :table-data="sentiResult"></mychart>
            </div>
        </el-row>
        <el-row>
            <el-col :span="5" :offset="18">
                结果有问题？
                <el-button type="text" @click="showReplyDialog()" size="big">点此反馈
                </el-button>
            </el-col>
        </el-row>
        <el-dialog title="反馈" :visible.sync="dialogFormVisible">
            <el-form :model="replyForm">
                <el-form-item label="反馈留言：" :label-width="formLabelWidth">
                    <el-input v-model="replyForm.textComment" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="正面指数：" :label-width="formLabelWidth">
<!--                    <el-radio-group v-model="replyForm.newType" style="padding-left: 20px;">-->
<!--                        <el-radio-button label="1">正面</el-radio-button>-->
<!--                        <el-radio-button label="0">负面</el-radio-button>-->
<!--                    </el-radio-group>-->
                    <el-input-number v-model="replyForm.newType" controls-position="right" :precision="3" :step="0.01" :min="0" :max="1"></el-input-number>
                    &nbsp;&nbsp;&nbsp;&nbsp;负面指数：<el-input-number v-model="1-replyForm.newType" :precision="3" :disabled="true"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="reply()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {mapState} from "vuex";
    import mychart from "./mychart";

    export default {
        name: "my_text",
        data() {
            return {
                textarea: '',
                type: 'general',
                chartShow: 'block',
                sentiResult: [0.5, 0.5],
                replyText: '',
                dialogFormVisible: false,
                replyForm: {
                    textComment: '',
                    newType: '',
                },
                formLabelWidth: 30,
            }
        },
        methods: {
            submitText() {
                if (this.textarea.replace(/(^\s*)|(\s*$)/g, "").length === 0) {
                    this.$message({
                        showClose: true,
                        message: '不能为空！请输入内容',
                        type: 'error'
                    });
                    this.textarea = '';
                    this.sentiResult = [0.5, 0.5];
                    return;
                }
                let rurl = '';
                if (this.type === 'general') {
                    rurl = '';
                } else {
                    rurl = '?' + this.type;
                }
                this.$axios.post('/api/getSenti', {
                    rurl: rurl,
                    textarea: this.textarea,
                }).then((response) => {
                    // this.$message({
                    //     showClose: true,
                    //     message: JSON.stringify(response.data, null, 2),
                    //     type: 'success'
                    // });
                    this.sentiResult = response.data[0];
                    this.chartShow = 'block';
                })
            },
            reply() {
                let data={
                    content:this.textarea,
                    oldType:this.sentiResult[0],
                    newType:this.replyForm.newType,
                    dateTime:new Date(Date.now()),
                    textComment: this.replyForm.textComment,
                    account:this.account,
                };
                this.$axios.post('/api/save/text',{data:data}).then((response)=>{
                    if (response.status===200)
                    {
                        this.$message({
                            showClose: true,
                            message: '感谢您的反馈',
                            type: 'success'
                        });
                        this.dialogFormVisible=false;
                    }else{
                        this.$message({
                            showClose: true,
                            message: 'opps,反馈失败，请稍后再试',
                            type: 'error'
                        });
                    }

                })
            },
            showReplyDialog() {
                if (this.sentiResult[0] === 0.5 && this.sentiResult[1] === 0.5) {
                    this.$message({
                        showClose: true,
                        message: '请先提交分析后再反馈，或者可以进行留言',
                        type: 'error'
                    });
                } else {
                    this.dialogFormVisible = true;
                }
                this.dialogFormVisible = true;
            }
        },
        computed: mapState([
            'account',
        ]),
        components: {
            mychart
        }
    }
</script>

<style>
    body {
        background: #ECBB17;
    }

    .el-myrow {
        padding-top: 2%;
    }

    .nActiveClass {
        display: none;
        background: black;
    }

    .activeClass {
        background: white;

    }
</style>
