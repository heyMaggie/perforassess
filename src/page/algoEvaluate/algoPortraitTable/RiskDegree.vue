<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>算法评估</el-breadcrumb-item>
                <el-breadcrumb-item>风险度</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-form :inline="true" :model="searchForm" class="demo-form-inline search-row">
            <div class="input-area">
                <el-form-item>
                    <el-select v-model="searchForm.provider" clearable placeholder="厂商">
                        <el-option v-for="item in providerList" :key="item" :label="item" :value="item">{{ item }}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="searchForm.algo_type" clearable placeholder="算法类型" @focus="selectAlgoType">
                        <el-option v-for="item in algoTypeList" :key="item" :label="item" :value="item">{{ item }}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="searchForm.algo_id" clearable placeholder="算法" @focus="selectAlgoList">
                        <el-option v-for="item in algoList" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="searchForm.user_id" clearable placeholder="用户ID" v-if="false">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-date-picker
                        v-model="timeRange"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                    >
                    </el-date-picker>
                </el-form-item>
            </div>
            <div class="button-right">
                <el-button type="primary" @click="onSubmit">确定</el-button>
                <el-button type="plain" @click="downLoad"><img class="iconImg" src="../../../assets/icon/xiazai.png" />导出列表</el-button>
            </div>
        </el-form>
        <div class="table-container">
            <el-empty
                v-if="!tableData.length"
                description="暂无数据"
                style="height: 695px"
                :image="require('../../../assets/img/empty.png')"
            ></el-empty>
            <el-table v-else :data="tableData" size="medium " :row-style="{ height: '56px' }" height="695px">
                <el-table-column prop="algo_name" label="算法名称"> </el-table-column>
                <el-table-column prop="min_jonit_rate" label="最小贴合度"> </el-table-column>
                <el-table-column prop="profit_rate" label="收益率">
                    <template slot-scope="scope"> {{ scope.row.profit_rate }}% </template>
                </el-table-column>
                <el-table-column prop="withdraw_rate" label="回撤比率">
                    <template slot-scope="scope"> {{ scope.row.withdraw_rate }}% </template>
                </el-table-column>
                <el-table-column prop="create_time" width="250" label="创建时间"> </el-table-column>
            </el-table>
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
</template>

<script>
import { fiveDimensionsApi, optionListApi } from '@/api/index';
import dayjs from 'dayjs';
import { export2Excel } from '../../../utils/exportExcel';

export default {
    name: 'riskDegree',
    data() {
        return {
            searchForm: {
                provider: '',
                algo_type: '',
                algo_id: '',
                user_id: localStorage.getItem('ms_username')
            },
            timeRange: [new Date(), new Date()], //筛选时间范围 默认当天
            tableData: [],
            currentPage: 1,
            pageTotal: 0,
            providerList: [],
            algoTypeList: [],
            algoList: [],
            pageObj: { page: 1, pageNum: 5 }
        };
    },
    created() {
        this.getTableData();
        // 获取厂商列表
        let query = {
            choose_type: 1
        };
        this.getOptionList(query, 'providerList', 'provider');
    },
    watch: {
        'searchForm.provider'(newV, oldV) {
            if (!newV) {
                this.searchForm = {
                    provider: '',
                    algo_type: '',
                    algo_id: ''
                };
                this.algoTypeList = [];
                this.algoList = [];
            }
        },
        'searchForm.algo_type'(newV, oldV) {
            if (!newV) {
                this.searchForm.algo_id = '';
                this.algoList = [];
            }
        }
    },
    methods: {
        getTableData(pageObj = { page: 1, pageNum: 5 }) {
            this.pageObj = pageObj;
            let today = dayjs(this.timeRange[0]).format('YYYY-MM-DD');
            let today2 = dayjs(this.timeRange[1]).format('YYYY-MM-DD');
            let start_time = new Date(`${today} 00:00`).getTime() / 1000;
            let end_time = new Date(`${today2} 23:59`).getTime() / 1000;
            // let query = { profile_type: 3, start_time: 1658194200, end_time: 1658244600, page: pageObj.page, limit: pageObj.pageNum };
            let query = { profile_type: 3, start_time, end_time, page: pageObj.page, limit: pageObj.pageNum, ...this.searchForm };
            console.log(query);
            fiveDimensionsApi(query)
                .then((res) => {
                    if (res.code == 200) {
                        this.tableData = res.risk ? res.risk : [];
                        this.tableData.map((item) => {
                            item.create_time = dayjs(item.create_time * 1000).format('YYYY-MM-DD HH:mm:ss');
                        });
                        this.pageTotal = res.total;
                    } else {
                        this.$message.error('查询失败！');
                    }
                })
                .catch(() => {
                    this.tableData = [];
                    this.$message.error('查询失败！');
                });
        },
        getOptionList(query, type, list) {
            optionListApi(query).then((res) => {
                if (res.code == 200) {
                    this[type] = res[list];
                }
            });
        },
        selectAlgoType() {
            // 获取算法类型
            let query = {
                choose_type: 2,
                provider: this.searchForm.provider
            };
            this.getOptionList(query, 'algoTypeList', 'algo_type');
        },
        selectAlgoList() {
            // 获取算法
            let query = {
                choose_type: 3,
                provider: this.searchForm.provider,
                algo_type: this.searchForm.algo_type
            };
            this.getOptionList(query, 'algoList', 'algo_name');
        },
        onSubmit() {
            console.log('submit!', this.searchForm);
            this.getTableData();
        },
        downLoad() {
            export2Excel(
                [
                    { title: '算法名称', key: 'algo_name' },
                    { title: '最小贴合度', key: 'min_jonit_rate' },
                    { title: '收益率', key: 'profit_rate' },
                    { title: '回撤比率', key: 'withdraw_rate' },
                    { title: '创建时间', key: 'create_time' }
                ],
                this.tableData,
                '风险度列表'
            );
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            let pageObj = { page: val / 1, pageNum: 5 };
            this.getTableData(pageObj);
        }
    }
};
</script>
