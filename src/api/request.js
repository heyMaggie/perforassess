import axios from 'axios';

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    baseURL: '/api',
    // BASE_URL: '/api',
    timeout: 5000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
});

// 文档中的统一设置post请求头。下面会说到post请求的几种'Content-Type'
service.interceptors.request.use(
    (config) => {
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
            return response.data;
        } else {
            Promise.reject();
        }
    },
    (error) => {
        console.log(error);
        // Message({
        //     message: response.data.msg,
        //     type: 'error'
        // });
        return Promise.reject();
    }
);

export default service;
