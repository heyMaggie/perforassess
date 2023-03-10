import request from './request';
import request2 from './request2';
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
export const querySzApi = (query) => {
    return request({
        url: '/algo-assess/v1/assess/performance/query-sz-level',
        // url: 'http://192.168.2.105:20080/algo-assess/v1/assess/performance/query-sz-level',
        method: 'post',
        data: query
    });
};
// 上传深市行情
export const uploadSzApi = (query) => {
    return request({
        url: '/algo-assess/v1/assess/upload-sz-level',
        method: 'post',
        data: query
    });
};
// // 沪市行情
export const queryShApi = (query) => {
    return request({
        url: '/algo-assess/v1/assess/performance/query-sh-level',
        method: 'post',
        data: query
    });
};
// 上传沪市行情
export const uploadShApi = (query) => {
    return request({
        url: '/algo-assess/v1/assess/upload-sh-level',
        method: 'post',
        data: query
    });
};
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
// 获取绩效平台目录
export const roleAuthMenu = (query) => {
    return request2({
        // url: '/algo-assess/v1/auth/rolelist',
        url: '/algo-assess/v1/auth/role-auth',
        method: 'post',
        data: query
    });
};
// 1. 系统用户列表   /algo-assess/v1/auth/user-list
export const authUserListApi = (query) => {
    return request2({
        url: '/algo-assess/v1/auth/user-list',
        method: 'post',
        data: query
    });
}; // 2. 系统用户修改   /algo-assess/v1/auth/user-modify
export const authUserModifyApi = (query) => {
    return request2({
        url: '/algo-assess/v1/auth/user-modify',
        method: 'post',
        data: query
    });
}; // 3. 角色列表      /algo-assess/v1/auth/rolelist
export const authRoleListApi = (query) => {
    return request2({
        url: '/algo-assess/v1/auth/rolelist',
        method: 'post',
        data: query
    });
}; // 4. 角色修改      /algo-assess/v1/auth/role-modify
export const authRoleModifyApi = (query) => {
    return request2({
        url: '/algo-assess/v1/auth/role-modify',
        method: 'post',
        data: query
    });
}; // 5. 角色权限      /algo-assess/v1/auth/role-auth
export const authRoleAuthApi = (query) => {
    return request2({
        url: '/algo-assess/v1/auth/role-auth',
        method: 'post',
        data: query
    });
}; // 6. 密码校验      /algo-assess/v1/auth/check-password
export const checkPasswordApi = (query) => {
    return request2({
        url: '/algo-assess/v1/auth/check-password',
        method: 'post',
        data: query
    });
};
// 7. 左边菜单栏      /algo-assess/v1/auth/check-password
export const userAuthListApi = (query) => {
    return request2({
        url: '/algo-assess/v1/auth/user-auth',
        method: 'post',
        data: query
    });
};
