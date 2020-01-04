<template>
    <div>
        <el-button @click="$refs.xTable.exportCsv({filename:'data'+new Date().toLocaleDateString()})" type="primary"
                   style="margin-bottom: 5px">
            导出数据
        </el-button>
        <vxe-table
                ref="xTable"
                highlight-current-row
                highlight-hover-row
                border
                stripe
                resizable
                show-overflow
                height="540"
                :loading="loading"
                :data.sync="texts"
                :edit-config="{key: 'id', trigger: 'manual', mode: 'row'}">
            <vxe-table-column type="seq" width="60"></vxe-table-column>
            <vxe-table-column field="account.name" title="用户名" sortable  :filters="[{data: ''}]" show-overflow></vxe-table-column>
            <vxe-table-column field="content" title="文本" sortable  :filters="[{data: ''}]" show-overflow></vxe-table-column>
            <vxe-table-column field="oldType" title="分析结果" sortable></vxe-table-column>
            <vxe-table-column field="newType" title="用户结果" sortable></vxe-table-column>
            <vxe-table-column field="dateTime" title="时间" :formatter="formatTime" sortable></vxe-table-column>
            <vxe-table-column field="textComment" title="反馈" sortable show-overflow></vxe-table-column>
            <vxe-table-column title="操作">
                <template v-slot="{ row }">
                    <template>
                        <el-button @click="removeRowEvent(row)" type="danger" size="small">删除</el-button>
                    </template>
                </template>
            </vxe-table-column>
        </vxe-table>
    </div>
</template>
<script>
    import {mapActions, mapState} from "vuex";
    import sha256 from 'crypto-js/sha256';
    import Register from './Register';

    export default {
        name:'account',
        data() {
            return {
                loading: false,
            }
        },
        async created() {
            this.loading = true;
            let result = await this.$axios.post('/api/getAll/text');
            if (!result) {
                this.errorMessage("数据加载错误");
            } else {
                this.$store.commit('setTexts', result.data);
                this.successMessage("数据加载成功");
            }
            this.loading = false;
        },
        methods: {
            removeRowEvent(row) {
                this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    this.loading = true;
                    this.$axios.post('/api/remove/text', {
                        data: row,
                    }).then((data) => {
                        if (data.status === 200) {
                            this.$refs.xTable.remove(row);
                            this.successMessage("删除成功");
                        } else {
                            this.errorMessage("删除失败");
                        }
                        this.loading = false;
                    }).catch((e) => {
                        this.errorMessage("删除失败");
                        console.log("error ==> " + e);
                        this.loading = false;
                    })
                }).catch(() => {
                    this.successMessage("已取消删除");
                    this.loading = false;
                });
                this.loading = false;
            },
            formatTime({cellValue, row, column}) {
                return cellValue.replace(/T/, ' ').replace(/\..+/, '');
            },
            successMessage(message) {
                this.$message({
                    showClose: true,
                    message: message,
                    type: 'success'
                });
            },
            errorMessage(message) {
                this.$message({
                    showClose: true,
                    message: message,
                    type: 'error'
                });
            },
        },
        computed: mapState([
            'texts',
        ])
    }
</script>
<style>
    body {
        background: white;
    }
</style>


