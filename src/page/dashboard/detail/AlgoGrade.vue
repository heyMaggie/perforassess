<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> Dashboard / 查看更多</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="card">
            <div @click="goBack" class="backRow"><span class="backIcon icon el-icon-arrow-left"></span>返回</div>
            <div class="main-content">
                <div class="cardB-title">算法总体评分</div>
                <div class="big-blue-card">
                    <table border="0">
                        <tr>
                            <th>排名</th>
                            <th>算法名称</th>
                            <th>分数</th>
                        </tr>
                        <tr v-for="i in 6" :key="i">
                            <td align="center">
                                <div class="adorn" v-if="i < 4">{{ i }}</div>
                                <div class="rank" v-else>{{ i }}</div>
                            </td>
                            <td align="center"><span class="text">日内回转</span></td>
                            <td align="center">
                                <span class="text">100</span>
                            </td>
                        </tr>
                    </table>
                </div>
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="10"
                    layout=" ->, prev, pager, next, total, jumper"
                    :total="pageTotal"
                >
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            tableData: [
                {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                },
                {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                },
                {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                },
                {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }
            ]
        };
    },
    mounted() {},
    methods: {
        goBack() {
            this.$router.push('/dashboard');
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        }
    }
};
</script>
<style lang="less" scoped>
.card {
    height: 88vh;
    .backRow {
        font-size: 14px;
        font-family: SourceHanSansSC-Regular, SourceHanSansSC;
        color: #666666;
        cursor: pointer;
        margin: 0 -24px 0px;
        padding: 0 24px 16px;
        border-bottom: #ececec 1px solid;
        .backIcon {
            color: #91a2bd;
            margin-right: 10px;
        }
    }
    .main-content {
        margin: auto;
        width: 850px;
        margin-top: 38px;
        .cardB-title {
            height: 24px;
            font-size: 16px;
            font-family: SourceHanSansSC-Medium, SourceHanSansSC;
            font-weight: 500;
            color: #333333;
            line-height: 24px;
            margin-bottom: 16px;
        }
        .big-blue-card {
            width: 100%;
            height: 491px;
            background: #fafbff;
            border-radius: 8px;
            margin-bottom: 24px;
            padding-top: 6px;
            overflow: auto;
            table {
            }
            th {
                width: 300px;
                height: 65px;
                // line-height: 20px;
            }
            tr {
                // height: 40px;
                font-size: 14px;
                font-family: SourceHanSansSC-Regular, SourceHanSansSC;
                font-weight: 400;
                color: #333333;
                // line-height: 0px;
            }
            .adorn {
                width: 34px;
                height: 48px;
                background-repeat: no-repeat;
                background-size: 34px 44px;
                background-image: url('../../../assets/icon/rank-icon.png');
                text-align: center;
                line-height: 48px;
                font-size: 20px;
                font-family: DINAlternate-Bold, DINAlternate;
                font-weight: bold;
                color: #ffffff;
                text-shadow: 0px -2px 9px #3a8159;
                margin-bottom: 20px;
            }
            .rank {
                width: 34px;
                height: 48px;
                margin-bottom: 20px;
                font-size: 20px;
                font-family: DINAlternate-Bold, DINAlternate;
                font-weight: bold;
                color: #666666;
                line-height: 24px;
            }
            .text {
                display: inline-block;
                height: 40px;
                margin-bottom: 20px;
            }
        }
    }
}
</style>
