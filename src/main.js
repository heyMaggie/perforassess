import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/color-dark.css'; //深色主题
// import './assets/css/theme-green/color-green.css'; //浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
import './assets/css/main.less';
// import echarts from 'echarts'; //引入echarts
import 'echarts-liquidfill';
import './utils/index';
import '../theme/index.css';
import store from './store/index';

Vue.config.productionTip = false;
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});
const i18n = new VueI18n({
    locale: 'zh',
    messages
});

function has(btnLimitArr = [], type) {
    let isExist = false;
    // 获取用户按钮权限
    if (type == undefined || type == null) {
        return false;
    }
    btnLimitArr.forEach((item) => {
        console.log(item.type, type, item.auth);
        if (item.type == type && item.auth == 1) {
            isExist = true;
            return;
        }
    });

    return isExist;
}

Vue.directive('has', {
    // 查询 新增 上传 导出列表 下载报告 删除 分别返回1，2，3，4，5，6
    inserted(el, data) {
        // 获取页面按钮权限
        const btnLimitArr = router.currentRoute.meta.cmpt;
        if (!has(btnLimitArr, data.value)) {
            if (el) {
                el.parentNode.removeChild(el);
            }
        }
    }
});

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    document.title = `绩效评估平台`;
    const role = sessionStorage.getItem('role');
    const token = sessionStorage.getItem('token');
    const metaList = JSON.parse(sessionStorage.getItem('metaList'));
    // 没有登录
    if (!token && to.fullPath != '/login') {
        next('/login');
    } else {
        // 如果是管理员权限则可进入
        next();
        metaList.forEach((item) => {
            if (item.index == to.fullPath.replace('/', '')) {
                to.meta.cmpt = item.cmptList;
                return;
            }
        });
        // role == 3 ? next() :;
        // if (role == 3) {
        //     next();
        //     metaList.forEach((item) => {
        //         if (item.index == to.fullPath.replace('/', '')) {
        //             to.meta.cmpt = item.cmptList;
        //         }
        //     });
        // } else {
        //     next('/403');
        // }
    }
});

new Vue({
    router,
    i18n,
    store,
    render: (h) => h(App)
}).$mount('#app');
