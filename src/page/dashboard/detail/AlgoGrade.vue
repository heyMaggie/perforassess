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
                        <tr v-for="(item, i) in tableData" :key="i">
                            <td align="center">
                                <div class="adorn" v-if="i < 4">{{ item.ranking }}</div>
                                <div class="rank" v-else>{{ item.ranking }}</div>
                            </td>
                            <td align="center">
                                <span class="text">{{ item.algo_name }}</span>
                            </td>
                            <td align="center">
                                <span class="text">{{ item.score }}</span>
                            </td>
                        </tr>
                    </table>
                </div>
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[10, 20, 30, 40]"
                    :current-page="pageObj.page"
                    :page-size="pageObj.pageNum"
                    layout=" ->, prev, pager, next, total, jumper"
                    :total="pageTotal"
                >
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import { algoRankingApi } from '@/api/index';
export default {
    data() {
        return {
            tableData: [],
            pageTotal: 0,
            pageObj: { page: 1, pageNum: 2 }
        };
    },
    mounted() {
        this.getAlgoRankingList();
    },
    methods: {
        goBack() {
            this.$router.push('/dashboard');
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            let pageObj = { page: val / 1, pageNum: 2 };
            this.getAlgoRankingList(pageObj);
        },
        getAlgoRankingList(pageObj = { page: 1, pageNum: 2 }) {
            this.pageObj = pageObj;
            // let time = Date.parse(new Date()) / 1000;
            let query = { date: 1658194200, page: pageObj.page, limit: pageObj.pageNum };
            algoRankingApi(query).then((res) => {
                if (res.code == 200) {
                    this.tableData = res.info;
                    this.pageTotal = res.total;
                }
            });
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
