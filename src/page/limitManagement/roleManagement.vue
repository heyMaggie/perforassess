<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>权限管理</el-breadcrumb-item>
                <el-breadcrumb-item>角色管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="title">角色管理</div>
            <div class="operate">
                <el-input v-model="role_name" class="selectInput" placeholder="请输入角色名称" @input="filterTable" maxlength="6"
                    ><i slot="prefix" class="el-icon-search"
                /></el-input>
                <el-button type="primary" icon="el-icon-plus" @click="openEditDaiolg(1)">新增角色</el-button>
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
                    <el-table-column type="index" label="ID"> </el-table-column>
                    <el-table-column prop="role_id" label="角色ID" width="100"> </el-table-column>
                    <el-table-column prop="role_name" label="角色名称" width="150"> </el-table-column>
                    <el-table-column prop="role_desc" label="权限" :show-overflow-tooltip="true"> </el-table-column>
                    <el-table-column prop="status" label="状态" width="100">
                        <template slot-scope="scope">
                            {{ scope.row.status | tableDic('limitStatus') }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="create_time" label="创建时间" width="200"> </el-table-column>
                    <el-table-column label="操作" width="100">
                        <!--  v-if="scope.row.status == 1" -->
                        <template slot-scope="scope">
                            <el-button @click="openEditDaiolg(2, scope.row)" type="text" size="small" :disabled="scope.row.status != 1"
                                >修改</el-button
                            >
                            <el-button @click="removeConfig(scope.row)" type="text" size="small" :disabled="scope.row.status != 1"
                                >删除</el-button
                            >
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
            <el-form :model="editForm" label-position="top" ref="roleFormName" :rules="roleRules">
                <el-row>
                    <el-col :span="11"
                        ><el-form-item label="角色ID" prop="role_id">
                            <el-input
                                v-model.trim="editForm.role_id"
                                :disabled="oper_type == 2"
                                placeholder="请输入角色ID"
                                oninput="value=value.replace(/[^\d]/g,'')"
                            ></el-input> </el-form-item
                    ></el-col>
                    <el-col :span="2"><div>&nbsp;</div></el-col>
                    <el-col :span="11"
                        ><el-form-item label="角色名称" prop="role_name">
                            <el-input v-model="editForm.role_name" placeholder="请输入角色名称"></el-input> </el-form-item
                    ></el-col>
                </el-row>

                <div class="tree-box">
                    权限
                    <el-tree
                        :data="treelogData"
                        default-expand-all
                        show-checkbox
                        node-key="index"
                        :indent="0"
                        :props="defaultProps"
                        :highlight-current="false"
                        :render-content="renderContent"
                        @check-change="handleCheckChange"
                        :check-strictly="true"
                        ref="menuTree"
                    >
                    </el-tree>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeEdit">取 消</el-button>
                <el-button type="primary" @click="submitEdit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { authRoleListApi, authRoleModifyApi, authRoleAuthApi, roleAuthMenu } from '@/api/index';
export default {
    data() {
        return {
            role_name: '',
            pageObj: { page: 1, limit: 12 },
            pageTotal: 0,
            tableData: [],
            marketType: dict.marketType,
            sharesType: dict.sharesType,
            dialogFormVisible: false,
            editForm: {
                role_id: '',
                role_name: ''
            },
            oper_type: null, //1-新增2-修改3-删除
            editTypeStr: null, //1-新增2-修改
            uploading: false, //上传状态
            isCheckTreeKeys: [], // 选中的树
            roleRules: {
                role_id: [{ required: true, message: '请输入角色代码', trigger: 'blur' }],
                role_name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
            },
            addLimitList: [], // 新增时的权限列表
            treelogData: [], // 权限列表
            defaultProps: {
                children: 'children',
                label: 'name'
            }
        };
    },
    beforeCreate() {
        let user_type = sessionStorage.getItem('user_type') / 1;
        let params = { oper_type: 1, user_type };
        roleAuthMenu(params).then((res) => {
            if (res.code == 200) {
                this.addLimitList = JSON.parse(res.role_auth).list;
            } else {
                this.addLimitList = [];
            }
        });
    },
    created() {
        this.getTableData(); //获取列表
        this.changeCss();
    },

    methods: {
        getTableData(pageObj = { page: 1, limit: this.pageObj.limit }) {
            this.uploading = true;
            authRoleListApi({ ...pageObj, role_name: this.role_name, scene: 1 })
                .then((res) => {
                    if (res.code == 200) {
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
                this.editTypeStr = '修改角色';
                let rowData = JSON.parse(JSON.stringify(rowItem));
                this.editForm = rowData;
                // console.log(rowData);
                this.localTreeData(JSON.parse(rowData.role_auth));
                this.$nextTick(() => {
                    this.$refs.menuTree.setCheckedKeys(this.isCheckTreeKeys);
                });
            } else {
                // this.localTreeData(this.addLimitList);
                this.editTypeStr = '新增角色';
                this.$nextTick(() => {
                    this.localTreeData(this.addLimitList);
                    this.$refs.menuTree.setCheckedKeys(this.isCheckTreeKeys);
                });
            }

            this.dialogFormVisible = true;
        },
        closeEdit() {
            this.dialogFormVisible = false;
            this.$refs['roleFormName'].resetFields();
        },
        submitEdit() {
            let list = this.$refs.menuTree.getCheckedKeys();
            this.circulTreeChange(this.treelogData, list);
            let params = {
                oper_type: this.oper_type,
                ...this.editForm,
                role_auth: JSON.stringify(this.treelogData)
            };
            console.log(this.treelogData, JSON.stringify(this.treelogData));
            this.$refs['roleFormName'].validate((valid) => {
                if (valid) {
                    authRoleModifyApi(params)
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
        // 定义tree的样式
        renderContent(h, { node, data, store }) {
            this.$nextTick(() => {
                this.changeCss();
            });
            // 树节点的内容区的渲染 Function
            let classname = '';
            // 由于项目中有三级菜单也有四级级菜单，就要在此做出判断
            if (node.level === 4 && node.childNodes.length === 0) {
                classname = 'foo';
            }
            if (node.level === 3 && node.childNodes.length === 0) {
                classname = 'foo';
            }
            if (node.level === 2 && node.childNodes.length === 0) {
                classname = 'foo';
            }

            // if (node.level === 1 && node.childNodes.length === 0) {
            //     classname = 'foo';
            // }
            return h(
                'p',
                {
                    class: classname
                    // class: classname
                },
                node.label
            );
        },
        changeCss() {
            //将子节点横向排列方法
            var levelName = document.getElementsByClassName('foo'); // levelname是上面的最底层节点的名字
            for (var i = 0; i < levelName.length; i++) {
                // cssFloat 兼容 ie6-8  styleFloat 兼容ie9及标准浏览器
                levelName[i].parentNode.style.cssFloat = 'left'; // 最底层的节点，包括多选框和名字都让他左浮动
                levelName[i].parentNode.style.styleFloat = 'left';
                levelName[i].parentNode.onmouseover = function () {
                    this.style.backgroundColor = '#fff';
                };
            }
        },
        handleExpand() {
            // let role_auth =
            //     '{"list":[{"level_one_name":"Dashboard","auth":1,"second_menu":null,"cmpt":[{"name":"dashboard测试控件","auth":1},{"name":"dashboard测试控件2","auth":1}]},{"level_one_name":"算法评估","auth":1,"second_menu":[{"level_two_name":"算法动态","auth":1,"third_menu":null,"cmpt":[{"name":"查看历史","auth":1}]},{"level_two_name":"算法画像","auth":1,"third_menu":[{"level_three_name":"经济性","auth":1,"cmpt":[{"name":"导出列表","auth":1}]},{"level_three_name":"完成度","auth":1,"cmpt":[{"name":"导出列表","auth":1}]},{"level_three_name":"风险度","auth":1,"cmpt":[{"name":"导出列表","auth":1}]},{"level_three_name":"绩效","auth":1,"cmpt":[{"name":"导出列表","auth":1}]},{"level_three_name":"稳定性","auth":1,"cmpt":[{"name":"导出列表","auth":1}]}],"cmpt":null},{"level_two_name":"多日分析","auth":1,"third_menu":null,"cmpt":[{"name":"下载报告","auth":1}]},{"level_two_name":"对比分析","auth":1,"third_menu":null,"cmpt":[{"name":"下载报告","auth":1}]}],"cmpt":null},{"level_one_name":"高阶评估","auth":1,"second_menu":[{"level_two_name":"用户画像","auth":1,"third_menu":null,"cmpt":null},{"level_two_name":"排行榜","auth":1,"third_menu":null,"cmpt":null}],"cmpt":null},{"level_one_name":"权限管理","auth":0,"second_menu":[{"level_two_name":"角色管理","auth":0,"third_menu":null,"cmpt":null},{"level_two_name":"系统用户","auth":0,"third_menu":null,"cmpt":null}],"cmpt":null},{"level_one_name":"配置信息","auth":0,"second_menu":[{"level_two_name":"算法配置","auth":0,"third_menu":null,"cmpt":null},{"level_two_name":"股票配置","auth":0,"third_menu":null,"cmpt":null},{"level_two_name":"用户配置","auth":0,"third_menu":null,"cmpt":null}],"cmpt":null}]}';
            // console.log(JSON.parse(role_auth));
            // // 节点被展开时触发的事件
            // // 因为该函数执行在renderContent函数之前，所以得加this.$nextTick()
            // this.$nextTick(() => {
            //     this.changeCss();
            // });
        },
        // 递归获取初始化控件目录，用于展示前端
        circulControl(arr = []) {
            if (!arr || !arr.length) return;
            arr.forEach((fitem, findex) => {
                if (fitem.auth == 1) {
                    this.isCheckTreeKeys.push(fitem.index);
                }
                if (fitem.children && fitem.children.length) {
                    this.circulControl(fitem.children);
                } else if (fitem['cmpt']) {
                    fitem['cmpt'].forEach((cmitem, cmindex) => {
                        cmitem.index = `${fitem.name}-${cmitem.name}-${cmindex}`;
                    });
                    fitem.children = fitem['cmpt'];
                    this.circulControl(fitem['cmpt']);
                }
            });
        },
        // 递归获取改变后的控件目录，用于传给后端
        circulTreeChange(arr, list) {
            arr.forEach((fitem, findex) => {
                if (list.indexOf(fitem.index) != -1) {
                    fitem.auth = 1;
                } else {
                    fitem.auth = 0;
                }
                if (fitem.children && fitem.children.length) {
                    this.circulTreeChange(fitem.children, list);
                }
            });
        },
        // 删除
        removeConfig(rowItem) {
            let params = {
                oper_type: 3,
                role_id: rowItem.role_id
            };
            this.$confirm('此操作将删除所选角色, 是否继续?', '删除提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                cancelButtonClass: 'is-plain',
                closeOnClickModal: false,
                closeOnPressEscape: false,
                type: 'warning'
            })
                .then(() => {
                    authRoleModifyApi(params)
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
        //
        handleCheckChange(data, checked, indeterminate) {
            // console.log(data, checked, indeterminate);
            console.log(this.$refs.menuTree.getCheckedKeys(), 'this.$refs.menuTree');
            // this.$refs.menuTree
        },
        // 从本地数据初始化树形
        localTreeData(list = []) {
            this.treelogData = [];
            this.isCheckTreeKeys = [];
            this.treelogData = list;
            this.circulControl(this.treelogData);
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
}
.tree-box {
    height: 616px;
    overflow-y: auto;
    .el-tree {
        ::v-deep .el-tree-node {
            position: relative;
            padding-left: 16px; // 缩进量
        }
        ::v-deep .el-tree-node__children {
            padding-left: 16px; // 缩进量
        }
    }
}
/deep/.el-dialog {
    margin-top: 3.5vh !important;
}
</style>
