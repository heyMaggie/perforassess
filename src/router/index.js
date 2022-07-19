import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../page/dashboard/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/algoDynamic',
                    component: () => import(/* webpackChunkName: "icon" */ '../page/algoEvaluate/AlgoDynamic.vue'),
                    meta: { title: '算法动态' }
                },
                {
                    path: '/economy',
                    component: () =>
                        import(/* webpackChunkName: "table" */ '../page/algoEvaluate/algoPortraitTable/Economy.vue'),
                    meta: { title: '经济性' }
                },
                {
                    path: '/completeness',
                    component: () =>
                        import(/* webpackChunkName: "tabs" */ '../page/algoEvaluate/algoPortraitTable/Completeness.vue'),
                    meta: { title: '完成度' }
                },
                {
                    path: '/riskDegree',
                    component: () =>
                        import(/* webpackChunkName: "form" */ '../page/algoEvaluate/algoPortraitTable/RiskDegree.vue'),
                    meta: { title: '风险度' }
                },
                {
                    path: '/performance',
                    component: () =>
                        import(/* webpackChunkName: "editor" */ '../page/algoEvaluate/algoPortraitTable/Performance.vue'),
                    meta: { title: '绩效' }
                },
                {
                    path: '/stability',
                    component: (Stability) =>
                        import(/* webpackChunkName: "markdown" */ '../page/algoEvaluate/algoPortraitTable/Stability.vue'),
                    meta: { title: '稳定性' }
                },
                {
                    path: '/manyDays',
                    component: () => import(/* webpackChunkName: "upload" */ '../page/algoEvaluate/ManyDays.vue'),
                    meta: { title: '多日分析' }
                },
                {
                    path: '/contrastive',
                    component: () => import(/* webpackChunkName: "chart" */ '../page/algoEvaluate/Contrastive.vue'),
                    meta: { title: '对比分析' }
                },
                {
                    path: '/userPortrait',
                    component: () => import(/* webpackChunkName: "dragdialog" */ '../page/highOrder/UserPortrait.vue'),
                    meta: { title: '排行榜' }
                },
                {
                    path: '/rankingList',
                    component: () => import(/* webpackChunkName: "drag" */ '../page/highOrder/RankingList.vue'),
                    meta: { title: '用户画像' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '../page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../page/403.vue'),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
