<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>修复数据</el-breadcrumb-item>
                <el-breadcrumb-item>母单信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="transfer">
                <div class="tips"></div>
                <div class="transfile" v-has="3">
                    <el-upload
                        action=""
                        :show-file-list="false"
                        :on-change="handleUpload"
                        :auto-upload="false"
                        accept=".csv"
                        class="upload-demo"
                    >
                        <el-button size="medium" type="text" slot="trigger"
                            ><img src="../../assets/icon/upDt.png" class="icon-button" />母单信息上传</el-button
                        ></el-upload
                    >
                </div>
            </div>
            <div class="title">母单信息</div>
            <div class="operate">
                <div>
                    <span class="label-text">证券ID：</span>
                    <el-input v-model="searchForm.secId" class="selectInput" placeholder="请输入证券ID" maxlength="8"></el-input>
                    <span class="label-text" style="margin-left: 32px">母单ID：</span>
                    <el-input
                        v-model="searchForm.algoId"
                        class="selectInput"
                        placeholder="请输入母单ID"
                        maxlength="16"
                        onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)));"
                    ></el-input>
                </div>

                <el-button type="" plain @click="queryData">查询</el-button>
            </div>
            <div class="table-box">
                <el-table
                    v-loading="uploading"
                    :data="tableData"
                    size="medium "
                    :row-style="{ height: '48px', background: '#fff' }"
                    height="645px"
                    :header-cell-style="{
                        background: '#F2F3F5 !important'
                    }"
                    ><el-empty description="暂无数据" slot="empty" :image="require('../../assets/img/empty.png')"></el-empty>
                    <el-table-column prop="id" width="80" label="序号"> </el-table-column>
                    <el-table-column prop="basketId" label="篮子ID"> </el-table-column>
                    <el-table-column prop="algoId" label="母单ID"
                        ><template slot-scope="scope">
                            <span>{{ scope.row.algoId }}</span>
                            <span class="signTxt" :class="scope.row.fixFlag == 1 ? 'fixTxt' : 'normalTxt'">{{
                                scope.row.fixFlag == 1 ? '修复' : '正常'
                            }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="algorithmId" label="算法ID"> </el-table-column>
                    <!-- <el-table-column prop="sec_name" label="证券代码"> </el-table-column> -->
                    <el-table-column prop="secId" label="证券代码"> </el-table-column>
                    <el-table-column prop="algoOrderQty" label="订单数量"> </el-table-column>
                    <el-table-column prop="transTime" label="交易时间"> </el-table-column>
                    <el-table-column prop="startTime" label="母单开始时间"> </el-table-column>
                    <el-table-column prop="endTime" label="母单结束时间"> </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" width="180"> </el-table-column>
                </el-table>
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[10, 20, 30, 40]"
                    :current-page="pageObj.page"
                    :page-size="pageObj.limit"
                    layout=" ->, prev, pager, next, total, jumper"
                    :total="pageTotal"
                >
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { queryAlgoApi, algoFixApi } from '@/api/index';
export default {
    data() {
        return {
            searchForm: {
                algoId: '',
                secId: ''
            },
            pageObj: { page: 1, limit: 12 },
            pageTotal: 0,
            tableData: [],
            uploading: false //上传状态
        };
    },
    created() {
        this.getTableData();
    },
    methods: {
        getTableData(pageObj = { page: 1, limit: this.pageObj.limit }) {
            this.uploading = true;
            let pageQuery = {
                pageId: pageObj.page,
                pageNum: pageObj.limit
            };
            let { algoId, secId } = this.searchForm;
            let transAlgoId = !algoId ? 0 : algoId;
            queryAlgoApi({ ...pageQuery, secId, algoId: transAlgoId / 1 })
                .then((res) => {
                    if (res.code == 200 || res.code == 0) {
                        this.tableData = res.data;
                        this.pageTotal = res.total;
                        this.pageObj = pageObj;
                    }
                })
                .catch(() => {
                    this.tableData = [];
                    this.pageTotal = 0;
                })
                .finally(() => {
                    this.uploading = false;
                });
        },

        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            let pageObj = { page: val / 1, limit: this.pageObj.limit };
            this.getTableData(pageObj);
        },
        queryData() {
            this.getTableData();
        },

        handleUpload(file) {
            this.uploading = true;
            let formData = new FormData();
            formData.append('file', file.raw);
            formData.append('key', file.name);
            algoFixApi(formData)
                .then((res) => {
                    if (res.code == 200) {
                        this.$message.success(res.msg);
                        this.getTableData();
                        this.uploading = false;
                    } else {
                        this.$message.error(res.msg);
                        this.uploading = false;
                    }
                })
                .catch(() => {
                    this.uploading = false;
                });
        }
    }
};
</script>

<style scoped lang="less">
.container {
    background: #fff;
    border-radius: 12px;
    padding: 37px 48px;

    .transfer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: -10px;

        .el-button--text {
            padding: 4px;
            &:hover {
                background: #e6f0ff;
            }
        }

        .icon-button {
            width: 14px;
            height: 14px;
            margin-right: 5px;
        }
    }
    .title {
        font-size: 14px;
        font-family: SourceHanSansSC-Medium, SourceHanSansSC;
        font-weight: 500;
        color: #333333;
        // line-height: 20px;
        &::before {
            content: '';
            display: inline-block;
            width: 4px;
            height: 11px;
            background: #3281ff;
            margin-right: 6px;
            margin-left: -10px;
        }
    }
    .transfile {
        display: flex;
    }
    .operate {
        display: flex;
        justify-content: space-between;
        align-content: center;
        margin-top: 15px;
        margin-bottom: 20px;
        .label-text {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
            line-height: 20px;
        }
        .selectInput {
            width: 208px;

            /deep/.el-input__prefix {
                top: 25%;
            }
        }
    }
    .row-edit {
        color: #3382ff;
        cursor: pointer;
        margin-left: 5px;
    }
    .signTxt {
        display: inline-block;
        width: 32px;
        height: 17px;
        line-height: 17px;
        border-radius: 4px;
        font-size: 12px;
        text-align: center;
        margin-left: 4px;
    }
    .normalTxt {
        background: rgba(50, 129, 255, 0.14);
        color: #3281ff;
    }
    .fixTxt {
        background: rgba(250, 211, 55, 0.14);
        color: #fad337;
    }
}
</style>
