<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>配置信息</el-breadcrumb-item>
                <el-breadcrumb-item>股票配置</el-breadcrumb-item>
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
                        class="upload-demo first"
                    >
                        <el-button size="medium" type="text" slot="trigger"
                            ><img src="../../assets/icon/upDt.png" class="icon-button" />股票信息上传</el-button
                        ></el-upload
                    >
                    <el-button type="text" size="medium" @click="exportFile"
                        ><img src="../../assets/icon/downDt.png" class="icon-button" />股票信息导出</el-button
                    >
                </div>
            </div>
            <div class="title">股票配置</div>
            <div class="operate">
                <el-input v-model="sec_id" class="selectInput" placeholder="请输入股票ID" @input="filterTable" maxlength="6"
                    ><i slot="prefix" class="el-icon-search"
                /></el-input>
                <el-button type="primary" icon="el-icon-plus" @click="openEditDaiolg(1)">新增股票</el-button>
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
                    <el-table-column prop="id" label="序号"> </el-table-column>
                    <el-table-column prop="sec_id" label="股票ID"> </el-table-column>
                    <el-table-column prop="sec_name" label="股票名称"> </el-table-column>
                    <el-table-column prop="fund_type" label="市值">
                        <template slot-scope="scope">
                            <span>{{ scope.row.fund_type | tableDic('marketType') }}</span>
                            <i class="el-icon-edit row-edit" @click="openEditDaiolg(2, 'market', scope.row)"></i>
                        </template>
                    </el-table-column>
                    <el-table-column prop="stock_type" label="股价类型">
                        <template slot-scope="scope">
                            <span>{{ scope.row.stock_type | tableDic('sharesType') }}</span>
                            <i class="el-icon-edit row-edit" @click="openEditDaiolg(2, 'shares', scope.row)"></i>
                        </template>
                    </el-table-column>
                    <el-table-column prop="update_time" label="修改时间"> </el-table-column>
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
        <el-dialog :title="editTypeStr" :visible.sync="dialogFormVisible" width="789px">
            <el-form :model="editForm" label-position="top" ref="formName" :rules="rules">
                <el-row>
                    <el-col :span="11"
                        ><el-form-item label="股票ID" prop="sec_id">
                            <el-input
                                v-mode.trim="editForm.sec_id"
                                :disabled="oper_type == 2"
                                placeholder="请输入股票代码"
                            ></el-input> </el-form-item></el-col
                    ><el-col :span="2"><div>&nbsp;</div></el-col>
                    <el-col :span="11">
                        <el-form-item label="股票名称" prop="sec_name">
                            <el-input v-model.trim="editForm.sec_name" :disabled="oper_type == 2" placeholder="请输入股票名称"></el-input>
                        </el-form-item> </el-col
                ></el-row>
                <el-row>
                    <el-col :span="11"
                        ><el-form-item label="市值" prop="fund_type">
                            <el-select
                                v-model="editForm.fund_type"
                                placeholder="请选择市值"
                                style="width: 100%"
                                :disabled="oper_type == 2 && rowEditType != 'market'"
                            >
                                <el-option v-for="item in marketType" :key="item.key" :label="item.value" :value="item.key"></el-option>
                            </el-select> </el-form-item></el-col
                    ><el-col :span="2"><div>&nbsp;</div></el-col>
                    <el-col :span="11"
                        ><el-form-item label="股价类型" prop="stock_type">
                            <el-select
                                v-model="editForm.stock_type"
                                placeholder="请选择股价类型"
                                style="width: 100%"
                                :disabled="oper_type == 2 && rowEditType != 'shares'"
                            >
                                <el-option v-for="item in sharesType" :key="item.key" :label="item.value" :value="item.key"></el-option>
                            </el-select> </el-form-item></el-col
                ></el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeEdit">取 消</el-button>
                <el-button type="primary" @click="submitEdit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { stockConfigListApi, stockUpdateApi, exportSecurityApi, importSecurityApi } from '@/api/index';
export default {
    data() {
        return {
            sec_id: '',
            pageObj: { page: 1, limit: 12 },
            pageTotal: 0,
            tableData: [],
            marketType: dict.marketType,
            sharesType: dict.sharesType,
            dialogFormVisible: false,
            editForm: {
                sec_id: '',
                sec_name: '',
                fund_type: '',
                stock_type: ''
            },
            oper_type: null, //1-新增2-修改
            editTypeStr: null, //1-新增2-修改
            rowEditType: null, //编辑的类型
            uploading: false, //上传状态
            rules: {
                sec_id: [{ required: true, message: '请输入股票代码', trigger: 'blur' }],
                sec_name: [{ required: true, message: '请输入股票名称', trigger: 'blur' }],
                fund_type: [{ required: true, message: '请选择市值', trigger: 'blur' }],
                stock_type: [{ required: true, message: '请选择股价类型', trigger: 'blur' }]
            }
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
        filterTable() {
            this.getTableData();
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            let pageObj = { page: val / 1, limit: this.pageObj.limit };
            this.getTableData(pageObj);
        },
        openEditDaiolg(type, editStr, rowItem) {
            this.oper_type = type;
            if (type == 2) {
                this.editTypeStr = '修改';
                this.rowEditType = editStr;
                this.$nextTick(() => {
                    let rowData = JSON.parse(JSON.stringify(rowItem));
                    this.editForm = rowData;
                });
            } else {
                this.editTypeStr = '新增';
            }
            this.dialogFormVisible = true;
        },
        closeEdit() {
            this.dialogFormVisible = false;
            this.$refs['formName'].resetFields();
        },
        submitEdit() {
            let oper_type = this.oper_type;
            this.$refs['formName'].validate((valid) => {
                if (valid) {
                    stockUpdateApi({ lists: [this.editForm], oper_type })
                        .then((res) => {
                            if (res.code == 200) {
                                this.$message.success(this.editTypeStr + '成功');
                                this.getTableData(this.pageObj);
                                this.closeEdit();
                            } else {
                                this.$message.error(this.editTypeStr + '失败');
                            }
                        })
                        .catch((error) => {
                            // this.$message.error(this.editTypeStr + '失败');
                        });
                } else {
                    return false;
                }
            });
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
        },
        exportFile() {
            exportSecurityApi().then((res) => {
                let title = res.headers['content-disposition'];
                title = title.substring(title.indexOf('=') + 1);
                let blob = new Blob([res.data], {
                    type: 'text/xml;charset=utf-8' // 这边的类型需要改
                });
                let url = window.URL.createObjectURL(blob);
                let link = document.createElement('a');
                link.style.display = 'none';
                link.setAttribute('download', title);
                link.href = url;
                document.body.appendChild(link);
                link.click();
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
        .first {
            margin-right: 10px;
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
        .selectInput {
            width: 396px;

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
