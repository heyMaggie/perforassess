<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>修复数据</el-breadcrumb-item>
                <el-breadcrumb-item>深市行情</el-breadcrumb-item>
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
                            ><img src="../../assets/icon/upDt.png" class="icon-button" />行情信息上传</el-button
                        ></el-upload
                    >
                </div>
            </div>
            <div class="title">深市行情</div>
            <div class="operate">
                <div>
                    <span class="label-text">股票ID：</span>
                    <el-input v-model="securityId" class="selectInput" placeholder="请输入股票ID" maxlength="8"></el-input>
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
                    <el-table-column prop="seculityId" width="120" label="股票ID"
                        ><template slot-scope="scope">
                            <span>{{ scope.row.seculityId }}</span>
                            <span class="signTxt" :class="scope.row.fixFlag == 1 ? 'fixTxt' : 'normalTxt'">{{
                                scope.row.fixFlag == 1 ? '修复' : '正常'
                            }}</span>
                        </template></el-table-column
                    >
                    <el-table-column prop="orgiTime" width="120" label="快照时间"> </el-table-column>
                    <el-table-column prop="lastPrice" width="80" label="最新价"> </el-table-column>
                    <el-table-column prop="askPrice" label="申卖价" :show-overflow-tooltip="true"> </el-table-column>
                    <el-table-column prop="askVol" label="申卖量" :show-overflow-tooltip="true"> </el-table-column>
                    <el-table-column prop="bidPrice" label="申买价" :show-overflow-tooltip="true"> </el-table-column>
                    <el-table-column prop="bidVol" label="申买量" :show-overflow-tooltip="true"> </el-table-column>
                    <el-table-column prop="totalTradeVol" label="成交总量" width="100"> </el-table-column>
                    <el-table-column prop="totalAskVol" label="委托买入总量" width="120"> </el-table-column>
                    <el-table-column prop="totalBidVol" label="委托卖出总量" width="110"> </el-table-column>
                </el-table>
                <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :pageId-sizes="[10, 20, 30, 40]"
                    :current-page="pageObj.pageId"
                    :pageId-size="pageObj.pageNum"
                    layout=" ->, prev, pager, next, total, jumper"
                    :page-count="maxCount"
                >
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { querySzApi, uploadSzApi } from '@/api/index';
export default {
    data() {
        return {
            securityId: '',
            pageObj: { pageId: 1, pageNum: 12 },
            // 最大页码
            maxCount: 0,
            tableData: [],
            uploading: false //上传状态
        };
    },
    created() {
        this.getTableData();
    },
    methods: {
        getTableData(pageObj = { pageId: 1, pageNum: this.pageObj.pageNum }) {
            this.uploading = true;
            querySzApi({ ...pageObj, securityId: this.securityId })
                .then((res) => {
                    if (res.code == 200) {
                        this.tableData = res.data;
                        this.maxCount = Math.ceil(res.total / this.pageObj.pageNum);
                        this.pageObj = pageObj;
                    }
                })
                .catch(() => {
                    this.tableData = [];
                    this.maxCount = 0;
                })
                .finally(() => {
                    this.uploading = false;
                });
        },

        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            let pageObj = { pageId: val / 1, pageNum: this.pageObj.pageNum };
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
            uploadSzApi(formData)
                .then((res) => {
                    if (res.code == 200) {
                        this.$message.success('上传成功');
                        this.getTableData();
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
