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

Vue.config.productionTip = false;
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});
const i18n = new VueI18n({
    locale: 'zh',
    messages
});

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    document.title = `绩效评估平台`;
    const role = sessionStorage.getItem('role');
    if (to.meta.isAdmin) {
        // 如果是管理员权限则可进入
        role == 3 ? next() : next('/403');
    } else {
        next();
    }
});

new Vue({
    router,
    i18n,
    render: (h) => h(App)
}).$mount('#app');
