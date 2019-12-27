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
                default: 5
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
                    columns: ['用户', '金额'],
                    rows: this.tableData.map((a) => ({
                        '用户': this.membersList.find((x) => {
                            return x.value === a.member.id
                        }).label,
                        '金额': a.money
                    })).reduce((result, item) => {
                        let itemFound = result.find(a => item.用户 === a.用户);
                        if (itemFound) {
                            itemFound.金额 += item.金额;
                        } else {
                            let newItem = {
                                '用户': item.用户,
                                '金额': item.金额,
                            };
                            result.push(newItem);
                        }
                        return result;
                    }, []),

                }
            }
        }
    }
</script>

<style scoped>

</style>
