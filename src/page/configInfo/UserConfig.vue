<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>配置信息</el-breadcrumb-item>
                <el-breadcrumb-item>用户配置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="title">用户配置</div>
            <div class="transfer">
                <div class="tips">关于用户级别的说明******</div>
                <div class="">
                    <el-button class="first" size="medium" type="text"
                        ><img src="../../assets/icon/upDt.png" class="icon-button" />用户信息上传</el-button
                    >
                    <el-button type="text" size="medium"
                        ><img src="../../assets/icon/downDt.png" class="icon-button" />用户信息导出</el-button
                    >
                </div>
            </div>
            <div class="operate">
                <el-input v-model="user_id" class="selectInput" placeholder="请输入用户ID" @input="filterTable" maxlength="18"
                    ><i slot="prefix" class="el-icon-search"
                /></el-input>
                <el-button type="primary" icon="el-icon-plus" @click="openEditDaiolg(1)">新增用户</el-button>
            </div>
            <div class="table-box">
                <el-table
                    :data="tableData"
                    size="medium "
                    :row-style="{ height: '48px', background: '#fff' }"
                    height="620px"
                    :header-cell-style="{
                        background: '#F2F3F5 !important'
                    }"
                    ><el-empty description="暂无数据" slot="empty" :image="require('../../assets/img/empty.png')"></el-empty>
                    <el-table-column prop="id" label="序号"> </el-table-column>
                    <el-table-column prop="user_id" label="用户ID"> </el-table-column>
                    <el-table-column prop="user_name" label="用户名称"> </el-table-column>
                    <el-table-column prop="grade" label="固定用户级别">
                        <template slot-scope="scope">
                            <span>{{ scope.row.grade }}</span>
                            <i class="el-icon-edit row-edit" @click="openEditDaiolg(2, 'market', scope.row)"></i>
                        </template>
                    </el-table-column>
                    <el-table-column prop="edit_time" label="修改时间"> </el-table-column>
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
            <el-form :model="editForm" label-position="top" ref="editFormId">
                <el-row>
                    <el-col :span="11"
                        ><el-form-item label="用户ID">
                            <el-input
                                v-model="editForm.user_id"
                                :disabled="oper_type == 2"
                                placeholder="请输入用户ID"
                            ></el-input> </el-form-item></el-col
                    ><el-col :span="2"><div>&nbsp;</div></el-col>
                    <el-col :span="11">
                        <el-form-item label="用户名称">
                            <el-input v-model="editForm.user_name" :disabled="oper_type == 2" placeholder="请输入用户名称"></el-input>
                        </el-form-item> </el-col
                ></el-row>
                <el-row>
                    <el-col :span="11"
                        ><el-form-item label="固定用户级别">
                            <el-select
                                v-model="editForm.grade"
                                placeholder="请选择用户级别"
                                style="width: 100%"
                                :disabled="oper_type == 2 && rowEditType != 'market'"
                            >
                                <el-option v-for="item in gradeType" :key="item.key" :value="item.value" :label="item.value"></el-option>
                            </el-select> </el-form-item></el-col
                    ><el-col :span="2"><div>&nbsp;</div></el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelEdit">取 消</el-button>
                <el-button type="primary" @click="submitEdit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { userConfigListApi, userUpdateApi } from '@/api/index';
export default {
    data() {
        return {
            user_id: '',
            pageObj: { page: 1, limit: 10 },
            pageTotal: 10,
            tableData: [],
            gradeType: dict.gradeType,
            dialogFormVisible: false,
            editForm: {
                user_id: '',
                user_name: '',
                grade: ''
            },
            oper_type: null, //1-新增2-修改
            editTypeStr: null, //1-新增2-修改
            rowEditType: null //编辑的类型
        };
    },
    created() {
        this.getTableData();
    },
    methods: {
        filterTable() {
            this.getTableData();
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            let pageObj = { page: val / 1, limit: 10 };
            this.getTableData(pageObj);
        },
        openEditDaiolg(type, editStr, rowItem) {
            this.oper_type = type;
            if (type == 2) {
                this.editTypeStr = '修改';
                this.rowEditType = editStr;
                this.editForm = rowItem;
            } else {
                this.editTypeStr = '新增';
            }
            this.dialogFormVisible = true;
        },
        getTableData(pageObj = { page: 1, limit: 10 }) {
            userConfigListApi({ ...pageObj, user_id: this.user_id })
                .then((res) => {
                    if (res.code == 200) {
                        this.tableData = res.infos;
                        this.pageTotal = res.total;
                    }
                })
                .catch(() => {
                    this.tableData = [];
                    this.pageTotal = 0;
                });
        },
        cancelEdit() {
            this.$nextTick(() => {
                this.$refs['editFormId'].clearValidate();
                this.$refs['editFormId'].resetFields();
            });
            this.dialogFormVisible = false;
        },
        submitEdit() {
            let oper_type = this.oper_type;
            userUpdateApi({ lists: [this.editForm], oper_type })
                .then((res) => {
                    if (res.code == 200) {
                        this.$message.success(this.editTypeStr + '成功');
                    } else {
                        this.$message.error(this.editTypeStr + '失败');
                    }
                    console.log(this.$refs['editFormId']);
                    this.$refs['editFormId'].clearValidate();
                    this.dialogFormVisible = false;
                })
                .catch((error) => {
                    // this.$message.error(this.editTypeStr + '失败');
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
    .transfer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        .tips {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
        }
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
