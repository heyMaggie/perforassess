<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> Dashboard / 排行榜</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="card">
            <div class="main-content">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="股票排行" name="first">
                        <div class="big-blue-card">
                            <table border="0">
                                <tr>
                                    <th>排名</th>
                                    <th>算法名称</th>
                                    <th>分数</th>
                                    <th>证券代码</th>
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
                                    <td align="center">
                                        <span class="text">610928121</span>
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
                            :page-size="100"
                            layout=" ->, prev, pager, next, total, jumper"
                            :total="1000"
                        >
                        </el-pagination
                    ></el-tab-pane>
                    <el-tab-pane label="用户排行" name="second">222</el-tab-pane>
                </el-tabs>
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
            ],
            activeName: 'first'
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
        },
        handleClick(tab, event) {
            console.log(tab, event);
        }
    }
};
</script>
<style lang="less" scoped>
.card {
    height: 88vh;
    .main-content {
        margin: auto;
        width: 850px;
        margin-top: 20px;
        .big-blue-card {
            width: 100%;
            height: 491px;
            // background: red;
            background: #fafbff;
            border-radius: 8px;
            margin-bottom: 24px;
            margin-top: 20px;
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
                background-image: url('../../assets/icon/rank-icon.png');
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
    /deep/.el-tabs__item {
        font-size: 16px;
        padding: 0 40px;
    }
}
</style>
