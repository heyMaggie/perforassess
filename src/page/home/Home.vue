<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content-box">
            <!-- <v-tags></v-tags> -->
            <div class="content">
                <transition name="move" mode="out-in">
                    <keep-alive :include="tagsList">
                        <router-view></router-view>
                    </keep-alive>
                </transition>
                <el-backtop target=".content"></el-backtop>
            </div>
        </div>
    </div>
</template>

<script>
import vHead from './Header.vue';
import vSidebar from './Sidebar.vue';
import vTags from './Tags.vue';
export default {
    data() {
        return {
            tagsList: [
                'algoDynamic',
                'economy',
                'completeness',
                'riskDegree',
                'performance',
                'stability',
                'manyDays',
                'contrastive',
                'userPortrait'
            ]
        };
    },
    components: {
        vHead,
        vSidebar,
        vTags
    },
    created() {}
};
</script>

<style scoped lang="less">
/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
/deep/ input[type='number'] {
    -moz-appearance: textfield;
}
</style>
