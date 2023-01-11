<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>权限管理</el-breadcrumb-item>
                <el-breadcrumb-item>系统用户</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="title">系统用户</div>
            <div class="operate">
                <el-input v-model="user_name" class="selectInput" placeholder="请输入用户名称" @input="filterTable" maxlength="6"
                    ><i slot="prefix" class="el-icon-search"
                /></el-input>
                <el-button type="primary" icon="el-icon-plus" @click="openEditDaiolg(1)">新增用户</el-button>
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
                    <el-table-column prop="id" label="ID" width="80"> </el-table-column>
                    <el-table-column prop="user_id" label="用户ID"> </el-table-column>
                    <el-table-column prop="user_name" label="用户名称">
                        <template slot-scope="scope"
                            ><div class="circle" :class="scope.row.color">{{ scope.row.user_name.substring(0, 1) }}</div>
                            {{ scope.row.user_name }}
                        </template></el-table-column
                    >
                    <el-table-column prop="role_id" label="角色ID"> </el-table-column>
                    <el-table-column prop="role_name" label="角色"> </el-table-column>
                    <el-table-column prop="status" label="用户状态">
                        <template slot-scope="scope">
                            {{ scope.row.status | tableDic('limitStatus') }}
                        </template></el-table-column
                    >
                    <el-table-column prop="create_time" label="创建时间"> </el-table-column>
                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                            <el-button @click="openEditDaiolg(2, scope.row)" type="text" size="small">修改</el-button>
                            <el-button @click="removeConfig(scope.row)" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
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
        <el-dialog
            :title="editTypeStr"
            :visible.sync="dialogFormVisible"
            width="668px"
            :close-on-click-modal="false"
            :before-close="closeEdit"
        >
            <el-form :model="editForm" label-position="top" ref="editFormName" :rules="rules">
                <el-form-item label="" prop="user_id">
                    <span slot="label">用户ID<span class="labTip">（*ID名称只能为数字、字母或字母与数字的组合）</span></span>
                    <el-input v-model.trim="editForm.user_id" :disabled="oper_type == 2" placeholder="请输入用户ID"></el-input>
                </el-form-item>
                <el-form-item label="用户名称" prop="user_name">
                    <el-input v-model.trim="editForm.user_name" placeholder="请输入用户名称"></el-input>
                </el-form-item>
                <el-form-item label="用户状态" prop="status" v-if="oper_type == 2">
                    <el-select v-model="editForm.status" placeholder="请选择用户状态" style="width: 100%" value-key="role_name">
                        <el-option v-for="item in userStatusList" :key="item.key" :label="item.value" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="角色" prop="role">
                    <el-select v-model="editForm.role" placeholder="请选择角色" style="width: 100%" value-key="role_name">
                        <el-option v-for="item in optionRoleList" :key="item.role_id" :label="item.role_name" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="原密码" prop="oldPassword" v-if="oper_type == 2">
                    <el-input v-model.trim="editForm.oldPassword" placeholder="请输入原密码" show-password></el-input>
                </el-form-item>
                <el-form-item label="设置密码" prop="newPassword" :rules="oper_type == 2 ? newPasswordEdit : newPasswordCreate">
                    <el-input v-model.trim="editForm.newPassword" placeholder="请设置新密码" show-password></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="verifyPassword">
                    <el-input v-model.trim="editForm.verifyPassword" placeholder="请确认设置的新密码" show-password></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeEdit">取 消</el-button>
                <el-button type="primary" @click="submitEdit('editFormName')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import md5 from 'js-md5';
import { authUserListApi, authUserModifyApi, authRoleListApi, checkPasswordApi } from '@/api/index';

export default {
    data() {
        let verifyPass = (rule, value, callback) => {
            if (!value && this.editForm.newPassword) {
                callback(new Error('请再次确认设置密码！'));
            } else if (value != this.editForm.newPassword) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        let newPassvali = (rule, value, callback) => {
            if (value && !this.editForm.oldPassword) {
                callback(new Error('请先输入原密码！'));
            } else {
                callback();
            }
        };
        let oldPassvali = (rule, value, callback) => {
            let params = {
                user_id: this.editForm.user_id,
                ori_passwd: md5(value)
            };
            if (value) {
                checkPasswordApi(params).then((res) => {
                    if (res.code == 200) {
                        callback();
                    } else {
                        callback(new Error('原密码错误，请重新输入！'));
                    }
                });
            } else {
                callback();
            }
        };
        let regularIdVali = (rule, value, callback) => {
            let reg = /^[A-Za-z0-9]+$/;
            if (!value.match(reg)) {
                callback(new Error('用户ID只能为数字、字母或字母与数字的组合'));
            } else {
                callback();
            }
        };
        return {
            user_name: '',
            pageObj: { page: 1, limit: 11 },
            pageTotal: 0,
            tableData: [],
            marketType: dict.marketType,
            sharesType: dict.sharesType,
            dialogFormVisible: false,
            editForm: {
                user_id: '',
                user_name: '',
                role: '',
                status: 1,
                oldPassword: '',
                newPassword: '',
                verifyPassword: ''
            },
            oper_type: null, //1-新增2-修改
            editTypeStr: null, //1-新增2-修改
            uploading: false, //上传状态
            rules: {
                user_id: [
                    { required: true, message: '请输入用户ID', trigger: 'blur' },
                    { require: false, validator: regularIdVali }
                ],
                user_name: [{ required: true, message: '请输入用户名称', trigger: 'change' }],
                role: [{ required: true, message: '请选择角色', trigger: 'blur' }],
                status: [{ required: true, message: '请选择用户状态', trigger: 'change' }],
                oldPassword: [{ validator: oldPassvali, trigger: 'blur' }],
                verifyPassword: [{ validator: verifyPass, trigger: 'blur' }]
            },
            newPasswordCreate: [{ required: true, message: '请设置密码！', trigger: 'blur' }],
            newPasswordEdit: [{ validator: newPassvali, trigger: 'blur' }],
            optionRoleList: [], // 角色选项
            userStatusList: dict.limitStatus
        };
    },
    created() {
        this.getTableData();
        this.getRoleList();
    },
    methods: {
        getTableData(pageObj = { page: 1, limit: this.pageObj.limit }) {
            this.uploading = true;
            let colorList = ['circleBlue', 'circleOrange', 'circlePurple'];
            authUserListApi({ ...pageObj, user_name: this.user_name })
                .then((res) => {
                    if (res.code == 200) {
                        res.list.forEach((item) => {
                            item.color = colorList[Math.floor(Math.random() * colorList.length)]; //随机获得
                        });
                        this.tableData = res.list;
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
        openEditDaiolg(type, rowItem) {
            this.oper_type = type;
            if (type == 2) {
                this.editTypeStr = '修改用户';
                this.$nextTick(() => {
                    let { user_name, user_id, status } = rowItem;
                    this.editForm = { ...this.editForm, user_name, user_id, role: { role_name: rowItem.role_name }, status };
                });
            } else {
                this.editTypeStr = '新增用户';
            }
            this.dialogFormVisible = true;
        },
        closeEdit() {
            this.$refs['editFormName'].resetFields();
            this.dialogFormVisible = false;
        },
        submitEdit(editFormName) {
            let oper_type = this.oper_type;
            let { user_name, user_id, role, newPassword, status } = this.editForm;
            let password = newPassword ? md5(newPassword) : '';
            this.$refs[editFormName].validate((valid) => {
                if (valid) {
                    let params = { oper_type, user_name, user_id, role_id: role.role_id, role_name: role.role_name, password, status };
                    authUserModifyApi(params)
                        // authUserModifyApi({ ...this.editForm, oper_type, password: md5(this.editForm.newPassword) })
                        .then((res) => {
                            if (res.code == 200) {
                                this.$message.success(this.editTypeStr + '成功');
                                this.closeEdit();
                                this.getTableData(this.pageObj);
                            } else if (res.code == 320) {
                                this.$message.error('用户id已存在!');
                            } else {
                                this.$message.error(res.msg);
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
        // 删除
        removeConfig(rowItem) {
            let params = {
                oper_type: 3,
                user_id: rowItem.user_id
            };
            this.$confirm('此操作将删除所选用户, 是否继续?', '删除提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                cancelButtonClass: 'is-plain',
                closeOnClickModal: false,
                closeOnPressEscape: false,
                type: 'warning'
            })
                .then(() => {
                    authUserModifyApi(params)
                        .then((res) => {
                            if (res.code == 200) {
                                this.$message.success('删除成功');
                                this.getTableData(this.pageObj);
                            } else {
                                this.$message.error('删除失败');
                            }
                        })
                        .catch((error) => {
                            // this.$message.error(this.editTypeStr + '失败');
                        });
                })
                .catch(() => {});
        },
        // 获取角色列表
        getRoleList(pageObj = { page: 1, limit: 1000 }) {
            authRoleListApi({ ...pageObj, role_name: '', scene: 2 })
                .then((res) => {
                    if (res.code == 200) {
                        this.optionRoleList = res.list;
                        // console.log(this.optionRoleList);
                    }
                })
                .catch(() => {
                    this.tableData = [];
                })
                .finally(() => {});
        },
        // 密码校验
        checkValidity(value) {}
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
    .table-box {
        .circle {
            width: 24px;
            height: 24px;
            border-radius: 100%;
            color: #fff;
            line-height: 24px;
            text-align: center;
            font-size: 14px;
            display: inline-block;
            margin-right: 4px;
        }
        .circleBlue {
            background: linear-gradient(200deg, #60a9ff 0%, #3281ff 100%);
        }
        .circleOrange {
            background: linear-gradient(200deg, #ffb360 0%, #ff8232 100%);
        }
        .circlePurple {
            background: linear-gradient(200deg, #8c60ff 0%, #6732ff 100%);
        }
    }
    .labTip {
        color: #999;
        font-size: 14px;
    }
}
</style>
