<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>高阶评估</el-breadcrumb-item>
                <el-breadcrumb-item>排行榜</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="card">
            <div class="main-content">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="股票排行" name="first">
                        <div class="big-blue-card">
                            <el-empty
                                v-if="!stockRankList.length"
                                description="暂无数据"
                                style="height: 491px"
                                :image="require('../../assets/img/empty.png')"
                            ></el-empty>
                            <table v-else border="0">
                                <tr>
                                    <th>排名</th>
                                    <th>算法名称</th>
                                    <th>分数</th>
                                    <th>证券代码</th>
                                </tr>
                                <tr v-for="item in stockRankList" :key="item.ranking">
                                    <td align="center">
                                        <div class="adorn" v-if="item.ranking < 4">{{ item.ranking }}</div>
                                        <div class="rank" v-else>{{ item.ranking }}</div>
                                    </td>
                                    <td align="center">
                                        <span class="text">{{ item.sec_name }}</span>
                                    </td>
                                    <td align="center">
                                        <span class="text">{{ item.score }}</span>
                                    </td>
                                    <td align="center">
                                        <span class="text">{{ item.sec_id }}</span>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <el-pagination
                            background
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChangeStock"
                            :current-page="stockCurrentPage"
                            :page-sizes="[10, 20, 30, 40]"
                            :page-size="pageObj.pageNum"
                            layout=" ->, prev, pager, next, total, jumper"
                            :total="stockRankListTotal"
                        >
                        </el-pagination
                    ></el-tab-pane>
                    <el-tab-pane label="用户排行" name="second"
                        ><div class="big-blue-card">
                            <el-empty
                                v-if="!userRankList.length"
                                description="暂无数据"
                                style="height: 491px"
                                :image="require('../../assets/img/empty.png')"
                            ></el-empty>
                            <table v-else border="0">
                                <tr>
                                    <th>排名</th>
                                    <th>用户名称</th>
                                    <th>分数</th>
                                    <th>用户ID</th>
                                </tr>
                                <tr v-for="item in userRankList" :key="item.ranking">
                                    <td align="center">
                                        <div class="adorn" v-if="item.ranking < 4">{{ item.ranking }}</div>
                                        <div class="rank" v-else>{{ item.ranking }}</div>
                                    </td>
                                    <td align="center">
                                        <span class="text">{{ item.user_name }}</span>
                                    </td>
                                    <td align="center">
                                        <span class="text">{{ item.score }}</span>
                                    </td>
                                    <td align="center">
                                        <span class="text">{{ item.user_id }}</span>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <el-pagination
                            background
                            @current-change="handleCurrentChangeUser"
                            :current-page="userCurrentPage"
                            :page-sizes="[10, 20, 30, 40]"
                            :page-size="pageObj.pageNum"
                            layout=" ->, prev, pager, next, total, jumper"
                            :total="userRankListTotal"
                        >
                        </el-pagination
                    ></el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>
<script>
import { algoRankingApi } from '@/api/index';
export default {
    data() {
        return {
            stockRankList: [],
            stockRankListTotal: 0,
            stockCurrentPage: 1,

            userRankList: [],
            userRankListTotal: 0,
            userCurrentPage: 1,
            activeName: 'first',

            pageTotal: 5,
            pageObj: { page: 1, pageNum: 6 }
        };
    },
    mounted() {
        this.getAlgoRankingList(2, 'stockRankList');
        this.getAlgoRankingList(3, 'userRankList');
    },
    methods: {
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChangeStock(val) {
            let pageObj = { page: val / 1, pageNum: 6 };
            this.getAlgoRankingList(2, 'stockRankList', pageObj);
        },
        handleCurrentChangeUser(val) {
            let pageObj = { page: val / 1, pageNum: 6 };
            this.getAlgoRankingList(3, 'userRankList', pageObj);
        },
        handleClick(tab, event) {
            // console.log(tab, event);
        },
        getAlgoRankingList(typeInt, typeList, pageObj = { page: 1, pageNum: 6 }) {
            this.pageObj = pageObj;
            let time = Date.parse(new Date()) / 1000;
            let query = { date: time, page: pageObj.page, limit: pageObj.pageNum, rank_type: typeInt };
            algoRankingApi(query)
                .then((res) => {
                    if (res.code == 200) {
                        this[typeList] = res.info;
                        this[typeList + 'Total'] = res.total;
                    }
                })
                .catch(() => {
                    this[typeList] = [];
                    this[typeList + 'Total'] = 0;
                });
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
