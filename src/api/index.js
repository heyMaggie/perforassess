import request from './request';
// 五个维度列表
export const fiveDimensionsApi = (query) => {
    return request({
        url: '/algo-assess/v1/assess/profile',
        method: 'post',
        data: query
    });
};
// 下拉选项列表
export const optionListApi = (query) => {
    return request({
        url: '/algo-assess/v1/assess/select',
        method: 'post',
        data: query
    });
};
// 算法动态
export const dynamicApi = (query) => {
    return request({
        url: '/algo-assess/v1/assess/dynamic',
        method: 'post',
        data: query
    });
};
// dashboard 1
export const dashboardSummarydApi = (query) => {
    return request({
        url: '/algo-assess/v1/dashboard/summary',
        method: 'post',
        data: query
    });
};
// dashboard 2
export const dashboardAlgolistApi = (query) => {
    return request({
        url: '/algo-assess/v1/dashboard/algolist',
        method: 'post',
        data: query
    });
};
// 多日分析
export const analyseAlgoApi = (query) => {
    return request({
        url: '/algo-assess/v1/assess/analyse',
        method: 'post',
        data: query
    });
};
// 对比分析
export const mulitAnalyseApi = (query) => {
    return request({
        url: '/algo-assess/v1/assess/mulit-analyse',
        method: 'post',
        data: query
    });
};
// 算法总体评分排行榜
export const algoRankingApi = (query) => {
    return request({
        url: '/algo-assess/v1/assess/ranking',
        method: 'post',
        data: query
    });
};

// 登录
export const loginApi = (query) => {
    return request({
        url: '/algo-assess/v1/assess/login',
        method: 'post',
        data: query
    });
};
// 用户画像
export const userProfileApi = (query) => {
    return request({
        url: '/algo-assess/v1/user/profile',
        method: 'post',
        data: query
    });
};
// 股票配置列表查询
export const stockConfigListApi = (query) => {
    return request({
        // url: '/algo-assess/v1/config/serurity-list',
        url: '/algo-assess/v1/assess/security-list',
        method: 'post',
        data: query
    });
};
// 股票配置更新
export const stockUpdateApi = (query) => {
    return request({
        url: '/algo-assess/v1/config/security/update',
        method: 'post',
        data: query
    });
};
// 股票配置导出
export const exportSecurityApi = (query) => {
    return request({
        url: '/algo-assess/v1/config/security/export',
        method: 'post',
        data: query
    });
};
// 股票配置导入
export const importSecurityApi = (query) => {
    return request({
        url: '/algo-assess/v1/config/security/import',
        method: 'post',
        data: query,
        timeout: 30000
    });
};
// 用户配置列表查询
export const userConfigListApi = (query) => {
    return request({
        url: '/algo-assess/v1/config/user/list',
        method: 'post',
        data: query
    });
};
// 用户配置列表查询
export const userUpdateApi = (query) => {
    return request({
        url: '/algo-assess/v1/config/user/update',
        method: 'post',
        data: query
    });
};
// 用户配置列表导出
export const exporUsertApi = (query) => {
    return request({
        url: '/algo-assess/v1/config/user/export',
        method: 'post',
        data: query
    });
};
// 用户配置导入
export const imporUsereApi = (query) => {
    return request({
        url: '/algo-assess/v1/config/user/import',
        method: 'post',
        data: query,
        timeout: 30000
    });
};
// 退出登录
export const logoutApi = (query) => {
    return request({
        url: '/algo-assess/v1/assess/logout',
        method: 'post',
        data: query
    });
};
// 深市行情
// export const logoutApi = (query) => {
//     return request({
//         url: '/algo-assess/v1/assess/logout',
//         method: 'post',
//         data: query
//     });
// };
// // 沪市行情
// export const logoutApi = (query) => {
//     return request({
//         url: '/algo-assess/v1/assess/logout',
//         method: 'post',
//         data: query
//     });
// };
// 母单信息
export const queryAlgoApi = (query) => {
    return request({
        url: '/algo-assess/v1/assess/performance/query-algo',
        // url: 'http://192.168.7.56:20080/algo-assess/v1/assess/performance/query-algo',
        method: 'post',
        data: query
    });
};
// 上传母单信息
export const algoFixApi = (query) => {
    return request({
        url: '/algo-assess/v1/assess/performance/algo-fix',
        method: 'post',
        data: query
    });
};
// 子单信息
export const queryChildApi = (query) => {
    return request({
        url: '/algo-assess/v1/assess/performance/query-child',
        method: 'post',
        data: query
    });
};
// 上传子单信息
export const childFixApi = (query) => {
    return request({
        url: '/algo-assess/v1/assess/performance/child-fix',
        method: 'post',
        data: query
    });
};
