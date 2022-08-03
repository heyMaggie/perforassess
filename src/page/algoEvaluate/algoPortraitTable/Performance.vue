<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 算法评估</el-breadcrumb-item>
                <el-breadcrumb-item>绩效</el-breadcrumb-item>
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
                    <el-select v-model="searchForm.user_id" clearable placeholder="用户ID">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-date-picker
                        v-model="searchForm.timeRange"
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
            </div>
        </el-form>
        <div class="table-container">
            <el-table :data="tableData" size="medium " :row-style="{ height: '56px' }" height="695px">
                <el-table-column prop="user_id" label="用户ID"> </el-table-column>
                <el-table-column prop="algo_name" label="算法名称"> </el-table-column>
                <el-table-column prop="vwap_dev" label="VWAP滑点值">
                    <template slot-scope="scope"> {{ scope.row.vwap_dev }}% </template>
                </el-table-column>
                <el-table-column prop="profit_rate" label="绩效收益率">
                    <template slot-scope="scope"> {{ scope.row.profit_rate }}% </template>
                </el-table-column>
                <el-table-column prop="create_time" label="创建时间">
                    <template slot-scope="scope">{{ scope.row.create_time | formatDate }}</template>
                </el-table-column>
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
export default {
    name: 'Performance',
    data() {
        return {
            searchForm: {
                provider: '',
                algo_type: '',
                algo_id: '',
                user_id: ''
            },
            timeRange: [], //筛选时间范围
            tableData: [],
            currentPage: 1,
            pageTotal: 0,
            providerList: [],
            algoTypeList: [],
            algoList: [],
            pageObj: { page: 1, pageNum: 2 }
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
    methods: {
        getTableData(pageObj = { page: 1, pageNum: 2 }) {
            this.pageObj = pageObj;
            let start_time = Date.parse(this.timeRange[0]) / 1000 || '';
            let end_time = Date.parse(this.timeRange[1]) / 1000 || '';
            // let query = { profile_type: 1, page: 1, limit: 10, start_time, end_time, ...this.searchForm };
            let query = { profile_type: 4, start_time: 1658194200, end_time: 1658244600, page: pageObj.page, limit: pageObj.pageNum };
            console.log(query);
            fiveDimensionsApi(query).then((res) => {
                if (res.code == 200) {
                    this.tableData = res.assess;
                    this.pageTotal = res.total;
                } else {
                    this.$message.error('查询失败！');
                }
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
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            let pageObj = { page: val / 1, pageNum: 2 };
            this.getTableData(pageObj);
        }
    }
};
</script>
