<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 算法评估</el-breadcrumb-item>
                <el-breadcrumb-item>算法动态</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-form :inline="true" :model="searchForm" class="demo-form-inline search-row">
            <div class="input-area">
                <el-form-item>
                    <el-select v-model="searchForm.firm" clearable placeholder="厂商">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="searchForm.algoType" clearable placeholder="算法类型">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="searchForm.algoId" clearable placeholder="算法">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="searchForm.userId" clearable placeholder="用户ID">
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
                <el-button type="primary" @click="onSubmit">查询</el-button
                ><el-button type="plain" @click="onSubmit"><i class="el-icon-upload el-icon--right"></i>下载报告</el-button>
            </div>
        </el-form>
        <div class="container">
            <div class="card"></div>
            <div class="card"></div>
            <div class="card"></div>
            <div class="card"></div>
            <div class="card"></div>
            <div class="card"></div>
            <div class="card"></div>
            <div class="card"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'baseform',
    data() {
        return {
            searchForm: {
                firm: '',
                algoType: '',
                algoId: '',
                userId: '',
                timeRange: []
            },
            tableData: [
                {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄',
                    tag: '家'
                },
                {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄',
                    tag: '家'
                },
                {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄',
                    tag: '公司'
                },
                {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄',
                    tag: '公司'
                }
            ],
            currentPage: 5
        };
    },
    methods: {
        onSubmit() {
            console.log('submit!');
        }
    }
};
</script>
<style scoped lang="less">
.container {
    .card {
        margin-bottom: 12px;
        display: inline-block;

        &:nth-child(1) {
            height: 280px;
            width: 24.4%;
            margin-right: 12px;
        }
        &:nth-child(2) {
            height: 280px;
            width: 74.7%;
            // width: 64.53%;
        }
        &:nth-child(3) {
            height: 280px;
            width: 24.4%;
            margin-right: 12px;
        }
        &:nth-child(4) {
            height: 280px;
            width: 74.7%;
        }
        &:nth-child(5) {
            height: 190px;
            width: 24.4%;
            margin-right: 12px;
        }
        &:nth-child(6) {
            height: 190px;
            width: 24.4%;
            margin-right: 12px;
        }
        &:nth-child(7) {
            height: 190px;
            width: 24.4%;
            margin-right: 12px;
        }
        &:nth-child(8) {
            height: 190px;
            width: 24.4%;
        }
    }
}
</style>
