<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu apiview" :default-active="onRoutes" router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title" class="span4">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">{{
                                    threeItem.title
                                }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index + 'i'">{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '@/utils/bus';
export default {
    data() {
        return {
            items: [
                {
                    icon: 'el-icon-lx-home',
                    index: 'dashboard',
                    title: 'Dashboard'
                },
                {
                    icon: 'el-icon-lx-calendar',
                    index: '3',
                    title: '算法评估',
                    subs: [
                        {
                            index: 'algoDynamic',
                            title: '算法动态'
                        },
                        {
                            index: '3-2',
                            title: '算法画像',
                            subs: [
                                {
                                    index: 'economy',
                                    title: '经济性'
                                },
                                {
                                    index: 'completeness',
                                    title: '完成度'
                                },
                                {
                                    index: 'riskDegree',
                                    title: '风险度'
                                },
                                {
                                    index: 'performance',
                                    title: '绩效'
                                },
                                {
                                    index: 'stability',
                                    title: '稳定性'
                                }
                            ]
                        },
                        {
                            index: 'manyDays',
                            title: '多日分析'
                        },
                        {
                            index: 'contrastive',
                            title: '对比分析'
                        }
                    ]
                },
                {
                    icon: 'el-icon-rank',
                    index: '6',
                    title: '高阶评估',
                    subs: [
                        {
                            index: 'userPortrait',
                            title: '用户画像'
                        },
                        {
                            index: 'rankingList',
                            title: '排行榜'
                        }
                    ]
                }
            ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', (msg) => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
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
            color: #3281ff;
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
</style>
