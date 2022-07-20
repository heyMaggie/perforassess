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
            // component: () => import( '../components/common/Home.vue'),
            component: () => import('../page/home/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import('../page/dashboard/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/algoMoreEchart',
                    component: () => import('../page/dashboard/detail/AlgoMoreEchart.vue'),
                    meta: { title: '算法绩效列表详情页' }
                },
                {
                    path: '/algoGrade',
                    component: () => import('../page/dashboard/detail/AlgoGrade.vue'),
                    meta: { title: '算法总体评分排行榜详情页' }
                },
                {
                    path: '/algoDynamic',
                    component: () => import('../page/algoEvaluate/AlgoDynamic.vue'),
                    meta: { title: '算法动态' }
                },
                {
                    path: '/economy',
                    component: () => import('../page/algoEvaluate/algoPortraitTable/Economy.vue'),
                    meta: { title: '经济性' }
                },
                {
                    path: '/completeness',
                    component: () => import('../page/algoEvaluate/algoPortraitTable/Completeness.vue'),
                    meta: { title: '完成度' }
                },
                {
                    path: '/riskDegree',
                    component: () => import('../page/algoEvaluate/algoPortraitTable/RiskDegree.vue'),
                    meta: { title: '风险度' }
                },
                {
                    path: '/performance',
                    component: () => import('../page/algoEvaluate/algoPortraitTable/Performance.vue'),
                    meta: { title: '绩效' }
                },
                {
                    path: '/stability',
                    component: (Stability) => import('../page/algoEvaluate/algoPortraitTable/Stability.vue'),
                    meta: { title: '稳定性' }
                },
                {
                    path: '/manyDays',
                    component: () => import('../page/algoEvaluate/ManyDays.vue'),
                    meta: { title: '多日分析' }
                },
                {
                    path: '/contrastive',
                    component: () => import('../page/algoEvaluate/Contrastive.vue'),
                    meta: { title: '对比分析' }
                },
                {
                    path: '/userPortrait',
                    component: () => import('../page/highOrder/UserPortrait.vue'),
                    meta: { title: '排行榜' }
                },
                {
                    path: '/rankingList',
                    component: () => import('../page/highOrder/RankingList.vue'),
                    meta: { title: '用户画像' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import('../page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: () => import('../page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import('../page/403.vue'),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import('../page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
