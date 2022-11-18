<template>
    <div class="sidebar">
        <!-- default-active="dashboard"  -->
        <el-menu
            class="sidebar-el-menu apiview"
            :default-active="activeIndex"
            router
            :default-openeds="['dashboard', '2', '2-2', '3', '4', '5', '6']"
        >
            <!-- 引入组件 -->
            <menu-tree :menuData="menuList"></menu-tree>
        </el-menu>
    </div>
</template>

<script>
import MenuTree from '../../components/MentTree.vue';
import { roleType } from '../../utils/roleMenuList.js';
import { userAuthListApi } from '@/api/index';
export default {
    components: {
        MenuTree
    },
    data() {
        return {
            activeIndex: 'dashboard',
            menuList: [],
            metaList: [] //组件权限表
        };
    },
    computed: {},

    beforeCreate() {
        let user_type = sessionStorage.getItem('user_type') / 1;
        let params = { user_id: localStorage.getItem('ms_username'), user_type };
        userAuthListApi(params).then((res) => {
            if (res.code == 200) {
                let role_auth = JSON.parse(res.auth).list;
                let allMenuList = this.doubleCircul(role_auth, roleType());
                // sessionStorage.setItem('allMenuList', JSON.stringify(allMenuList));
                this.menuList = JSON.parse(JSON.stringify(allMenuList));
                this.memuCircul(this.menuList);
                sessionStorage.setItem('metaList', JSON.stringify(this.metaList));
            } else {
                this.$router.push('/404');
                this.menuList = [];
            }
        });
    },
    created() {},
    mounted() {
        this.activeIndex = this.$route.path.replace('/', '');
    },
    methods: {
        // 递归获取控件目录
        doubleCircul(arr, roleArr) {
            arr.forEach((item, i) => {
                roleArr.forEach((jtem, j) => {
                    if (item.name == jtem.name) {
                        arr[i] = { ...item, icon: jtem.icon || null, index: jtem.index };
                    }

                    if (item.children && jtem.children) {
                        this.doubleCircul(item.children, jtem.children);
                        return;
                    }
                });
            });
            return arr;
        },
        // 递归获取菜单目录
        memuCircul(arr) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].auth == 0) {
                    arr.splice(i, 1);
                    i = i - 1;
                } else {
                    if (arr[i].children) {
                        this.memuCircul(arr[i].children);
                    }
                    if (arr[i].cmpt) {
                        this.metaList.push({ name: arr[i].name, cmptList: arr[i].cmpt, index: arr[i].index });
                    }
                }
            }
        }
    }
};
</script>

<style scoped lang="less">
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 60px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 184px;
}
.sidebar > ul {
    height: 100%;
}

.apiview:deep(.el-menu-item:hover) {
    background-color: #fff !important;
    color: #3281ff !important;
}
.apiview:deep(.el-menu-item.is-active) {
    background-color: rgba(50, 129, 255, 0.08) !important;
    color: #3281ff !important;
    border-radius: 8px;
}
.apiview {
    padding: 0 16px !important;
    .el-menu-item,
    /deep/.el-submenu__title {
        padding-left: 8px !important;
        height: 45px;
        line-height: 45px;
        margin-top: 8px;
        min-width: 10px !important;
    }
    /deep/.el-submenu__title {
        &:hover {
            background-color: #fff !important;
            color: #3281ff !important;
        }
    }
    /deep/ .el-submenu.is-active {
        .span4 {
            color: none;
        }
    }
    /deep/ .el-submenu {
        .el-menu-item,
        .el-submenu {
            // padding: 0px 36px !important;
            padding-left: 36px !important;
            .el-submenu__title {
                padding-left: 0px !important;
            }
            .el-menu-item {
                margin-left: -36px;
                padding-left: 50px !important;
            }
        }
    }
}

.icon1 {
    background: url(../../assets/icon/dash.png);
    background-repeat: no-repeat;
    background-size: 16px 16px;
    width: 16px;
    height: 16px;
    margin-right: 10px;
}
.icon2 {
    background: url(../../assets/icon/algo.png);
    background-repeat: no-repeat;
    background-size: 16px 16px;
    width: 16px;
    height: 16px;
    margin-right: 10px;
}
.icon3 {
    background: url(../../assets/icon/high.png);
    background-repeat: no-repeat;
    background-size: 16px 16px;
    width: 16px;
    height: 16px;
    margin-right: 10px;
}
.el-menu-item *,
.span4 {
    line-height: 0;
}
.apiview .el-menu-item,
/deep/.el-submenu__title {
    display: flex !important;
    align-items: center !important;
    // align-content: center;
}
</style>
