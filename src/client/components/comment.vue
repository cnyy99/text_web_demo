<template>
    <div>
        <el-button @click="showDialogForm()" size="big">留言
        </el-button>
        <el-dialog title="添加留言" :visible.sync="dialogFormVisible">
            <el-form :model="replyForm">
                <el-form-item label="留言内容：" :label-width="formLabelWidth">
                    <el-input v-model="replyForm.content" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="leaveComment()">确 定</el-button>
            </div>
        </el-dialog>
        <div style="height: 650px;">
            <el-container v-for="(item,index) in currentComments" :key="item.id" v-if='index%2===0'>
                <el-container style="padding-top: 3%">
                    <el-col :span="12">
                        <el-card class="box-card" shadow="hover">
                            <div slot="header" class="clearfix">
                                <el-row>
                                    <span>{{item.account.name}}</span>
                                    <span class="nonImportantText" style="float: right; padding: 3px 0">{{item.dateTime.replace(/T/, ' ').replace(/\..+/, '')}}</span>
                                </el-row>
                                <span class="nonImportantText"><a
                                        :href="'mailto:'+item.account.email">{{item.account.email}}</a></span>
                            </div>
                            <div class="text item">
                                {{item.content}}
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="12" v-if='index+1<currentComments.length'>
                        <el-card class="box-card" shadow="hover">
                            <div slot="header" class="clearfix">
                                <el-row>
                                    <span>{{currentComments[index+1].account.name}}</span>
                                    <span class="nonImportantText" style="float: right; padding: 3px 0">{{currentComments[index+1].dateTime.replace(/T/, ' ').replace(/\..+/, '')}}</span>
                                </el-row>
                                <!--                                <span class="nonImportantText">{{currentComments[index+1].account.email}}</span>-->
                                <span class="nonImportantText"><a
                                        :href="'mailto:'+currentComments[index+1].account.email">{{currentComments[index+1].account.email}}</a></span>
                            </div>
                            <div class="text item">
                                {{currentComments[index+1].content}}
                            </div>
                        </el-card>
                    </el-col>
                </el-container>
            </el-container>
        </div>
        <el-row>
            <el-col class="text-center">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="page_size"
                        layout="prev, pager, next, jumper"
                        :total="this.comments.length">
                </el-pagination>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        name: "comment",
        created() {
                this.$axios.post('/api/getAll/comment').then((data)=>{
                    // this.$message({
                    //     showClose: true,
                    //     message: JSON.stringify(data,null,2),
                    //     type: 'error'
                    // });
                    this.$store.commit('setComments', data.data);
                    this.currentComments = this.comments.slice((this.currentPage - 1) * this.page_size, (this.currentPage) * this.page_size);
                    // console.log(this.currentComments);
                    // console.log('(this.currentPage - 1) * this.page_size, (this.currentPage) * this.page_size= ' + ((this.currentPage - 1) * this.page_size - (this.currentPage) * this.page_size));
                    // console.log('Math.ceil(this.comments.length/page_size)= ' + Math.ceil(this.comments.length / this.page_size));
                    // console.log('this.comments.length= ' + this.comments.length);
                }).catch ((err)=>{
                    console.log(err);
                });

        },
        data() {
            return {
                textarea: '',
                type: 'general',
                chartShow: 'block',
                sentiResult: [0.5, 0.5],
                replyText: '',
                dialogFormVisible: false,
                currentComments: [],
                replyForm: {
                    content: '',
                },
                page_size: 6,
                formLabelWidth: "30",
                currentPage: 1,
            }
        },
        methods: {
            handleSizeChange(pagination) {
                // console.log('handleSizeChange: ' + pagination);
            },
            handleCurrentChange(pagination) {
                this.currentPage = pagination;
                this.currentComments = this.comments.slice((this.currentPage - 1) * this.page_size, (this.currentPage) * this.page_size);

                console.log('handleCurrentChange: ' + pagination);

            },
            showDialogForm(){
                if(!this.account)
                {
                    this.$message({
                        showClose: true,
                        message: '请登陆后惊醒留言',
                        type: 'error'
                    });
                }  else {
                    this.dialogFormVisible=true;
                }
            },
            leaveComment() {
                let data = {
                    content: this.replyForm.content,
                    dateTime: new Date(Date.now()),
                    account: this.account,
                };
                this.$axios.post('/api/save/comment', {data: data}).then((response) => {
                    if (response.status === 200) {
                        this.$message({
                            showClose: true,
                            message: '留言成功',
                            type: 'success'
                        });
                        this.dialogFormVisible = false;
                        this.$store.commit('unshiftComment', response.data);
                        this.currentComments = this.comments.slice((this.currentPage - 1) * this.page_size, (this.currentPage) * this.page_size);
                    } else {
                        this.$message({
                            showClose: true,
                            message: 'opps,留言失败，请稍后再试',
                            type: 'error'
                        });
                    }

                })
            }
        },
        computed: mapState([
            'account',
            'comments',
        ]),
        components: {}
    }
</script>

<style>
    body {
        background: #ECBB17;
    }

    .text {
        font-size: 14px;
    }

    .item {
        margin-bottom: 18px;
    }

    .nonImportantText {
        font-size: 10px;
        color: gray;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .box-card {
        width: 480px;
    }
</style>
