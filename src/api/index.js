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
