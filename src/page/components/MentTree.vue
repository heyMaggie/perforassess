<template>
    <div class="container-ment">
        <template v-for="(menu, index) in this.menuData">
            <el-submenu :key="menu.index" :index="menu.index" v-if="menu.children">
                <template slot="title">
                    <i :class="menu.icon"></i>
                    <span slot="title" class="span4">{{ menu.name }}</span>
                </template>
                <menu-tree :menuData="menu.children"></menu-tree>
            </el-submenu>
            <el-menu-item :key="index" :index="menu.index" v-else>
                <i :class="menu.icon"></i>
                <span slot="title">{{ menu.name }}</span>
            </el-menu-item>
        </template>
    </div>
</template>

<script>
export default {
    props: ['menuData'],
    name: 'MenuTree'
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
