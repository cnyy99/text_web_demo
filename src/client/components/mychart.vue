<template>
    <figure>
        <ve-pie :data="chartData" :settings="chartSettings"></ve-pie>
    </figure>
</template>

<script>
    import {mapState} from "vuex";

    export default {
        name: "mychart",
        props: {
            tableData: {
                type: Array,
                default: null,
            },
            limitShowNumber: {
                type: Number,
                default: 2
            }
        },
        data() {
            return {
                chartSettings: {
                    // roseType: 'radius',
                    limitShowNum: this.limitShowNumber
                },
            }
        },
        computed: {
            ...mapState([
                // 映射 this.account 为 store.state.account
                'membersList',
            ]),
            chartData() {
                return {
                    columns: ['类型', '数值'],
                    rows: [
                        {
                            '类型': '正面指数',
                            '数值': this.tableData[0],
                        },
                        {
                            '类型': '负面指数',
                            '数值': this.tableData[1],
                        }
                    ],

                }
            }
        }
    }
</script>

<style scoped>

</style>
