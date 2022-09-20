<template>
    <div class="sidebar">
        <!-- default-active="dashboard"  -->
        <el-menu
            class="sidebar-el-menu apiview"
            :default-active="activeIndex"
            router
            :default-openeds="['dashboard', '2', '2-2', '3', '4']"
            @select="handleSelect"
        >
            <!-- 引入组件 -->
            <menu-tree :menuData="menuList"></menu-tree>
        </el-menu>
    </div>
</template>

<script>
import MenuTree from '../components/MentTree.vue';
export default {
    components: {
        MenuTree
    },
    data() {
        return {
            activeIndex: 'dashboard',
            menuList: [
                {
                    icon: 'icon1',
                    index: 'dashboard',
                    name: 'Dashboard'
                },
                {
                    icon: 'icon2',
                    index: '2',
                    name: '算法评估',
                    children: [
                        {
                            index: 'algoDynamic',
                            name: '算法动态'
                        },
                        {
                            index: '2-2',
                            name: '算法画像',
                            children: [
                                {
                                    index: 'economy',
                                    name: '经济性'
                                },
                                {
                                    index: 'completeness',
                                    name: '完成度'
                                },
                                {
                                    index: 'riskDegree',
                                    name: '风险度'
                                },
                                {
                                    index: 'performance',
                                    name: '绩效'
                                },
                                {
                                    index: 'stability',
                                    name: '稳定性'
                                }
                            ]
                        },
                        {
                            index: 'manyDays',
                            name: '多日分析'
                        },
                        {
                            index: 'contrastive',
                            name: '对比分析'
                        }
                    ]
                },
                {
                    icon: 'icon3',
                    index: '3',
                    name: '高阶评估',
                    children: [
                        {
                            index: 'userPortrait',
                            name: '用户画像'
                        },
                        {
                            index: 'rankingList',
                            name: '排行榜'
                        }
                    ]
                },
                {
                    icon: 'icon3',
                    index: '4',
                    name: '配置信息',
                    children: [
                        {
                            index: 'stockConfig',
                            name: '股票配置'
                        },
                        // {
                        //     index: 'algoConfig',
                        //     name: '算法配置'
                        // },
                        {
                            index: 'userConfig',
                            name: '用户配置'
                        }
                    ]
                }
            ]
        };
    },
    computed: {},
    created() {
        this.activeIndex = this.$route.path.replace('/', '');
    },
    methods: {}
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
