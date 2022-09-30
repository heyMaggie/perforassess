import axios from 'axios';
import { Message } from 'element-ui';

window.baseURL = '';
let path = ''; //传入的请求地址
// process.env.NODE_ENV === 'development' 来判断是否开发环境
if (process.env.NODE_ENV === 'development') {
    // 开发环境
    // baseURL = 'http://192.168.2.105:20080';//志辉
    baseURL = 'http://192.168.2.27:20080'; //洪万
    // baseURL = 'http://192.168.2.212:20080';
    // baseURL = 'http://192.168.1.84:20080';
} else {
    //生产环境
    baseURL = '/api';
    // baseURL: 'http://314590ym44.zicp.vip:20080', 81外网服务！
}
const service = axios.create({
    // baseURL: '/api',
    baseURL: baseURL,
    timeout: 5000,
    // withCredentials: true,
    headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded'
        'Content-Type': 'application/json; charset=utf-8'
    }
});

// 文档中的统一设置post请求头。下面会说到post请求的几种'Content-Type'
service.interceptors.request.use(
    (config) => {
        path = config.url;
        config.headers.Authorization = sessionStorage.getItem('token');
        return config;
    },
    (error) => {
        console.log(error);
        return Promise.reject(error);
    }
);

service.interceptors.response.use(
    (response) => {
        if (response.status === 200) {
            if (response.headers['content-disposition']) {
                return response; //拿响应头
            }
            return response.data;
        } else {
            Promise.reject();
        }
    },
    (error) => {
        console.log(error);
        // Message.error('请求超时');
        Message({
            message: '系统繁忙，请稍后再试',
            type: 'error'
        });
        return Promise.reject();
    }
);

export default service;
