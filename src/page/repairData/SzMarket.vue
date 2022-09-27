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
                <div class="transfile">
                    <el-upload
                        action=""
                        :show-file-list="false"
                        :on-change="handleUpload"
                        :auto-upload="false"
                        accept=".xml"
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
                    <el-input v-model="sec_id" class="selectInput" placeholder="请输入股票ID" maxlength="8"></el-input>
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
                    <el-table-column prop="sec_id" label="股票ID"> </el-table-column>
                    <el-table-column prop="update_time" label="快照时间"> </el-table-column>
                    <el-table-column prop="sec_name" label="最新价"> </el-table-column>
                    <el-table-column prop="sec_name" label="申卖价"> </el-table-column>
                    <el-table-column prop="sec_name" label="申卖量"> </el-table-column>
                    <el-table-column prop="sec_name" label="申买价"> </el-table-column>
                    <el-table-column prop="sec_name" label="申买量"> </el-table-column>
                    <el-table-column prop="sec_name" label="成交总量"> </el-table-column>
                    <el-table-column prop="sec_name" label="委托买入总量"> </el-table-column>
                    <el-table-column prop="sec_name" label="委托卖出总量"> </el-table-column>
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
import { stockConfigListApi, importSecurityApi } from '@/api/index';
export default {
    data() {
        return {
            sec_id: '',
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
            stockConfigListApi({ ...pageObj, sec_id: this.sec_id })
                .then((res) => {
                    if (res.code == 200) {
                        this.tableData = res.infos;
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
            importSecurityApi(formData)
                .then((res) => {
                    if (res.code == 200) {
                        this.$message.success('上传成功');
                        this.getTableData();
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
}
</style>
