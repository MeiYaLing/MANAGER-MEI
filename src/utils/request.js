import axios from 'axios'
import router from '../router'
import config from '../config'

import { ElMessage } from 'element-plus'

const TOKEN_ERROR = 'Token认证失败，请重新登录'
const NETWORK_ERROR = '网络请求异常，请稍后重试'

//创建axios的实例对象 添加配置
const service = axios.create({
    baseURL: config.baseApi,
    timeout: 8000
})

//请求的拦截器
service.interceptors.request.use((req) => {
    //  一些公共的请求机制
    const header = req.headers;
    if (!header.Authorization) {
        header.Authorization = 'Mei';
        return req;
    }
})

//响应的拦截器
service.interceptors.response.use((res) => {
    //  一些公共的响应机制
    const { code, data, msg } = res.data;
    if (code === 200) {
        return data;
    } else if (code === 50001) {
        //token认证失败
        ElMessage.error(TOKEN_ERROR);
        setTimeout(() => {
            router.push('/login')
        }, 1500)
        return Promise.reject(TOKEN_ERROR);
    } else {
        ElMessage.error(msg || NETWORK_ERROR);
        return Promise.reject(msg || NETWORK_ERROR);
    }
})

//核心的request函数
function request(options) {
    options.method = options.method || "get";
    if (options.method.toLowerCase == 'get') {
        //统一一下属性是data
        options.params = options.data;
    }

    //取单个api的mock开关
    if (typeof options.mock !== 'undefined') {
        config.mock = options.mock;
    }

    //这一点非常重要 若不注意，会出现p0级别的bug
    if (config.env === 'prod') {
        service.defaults.baseURL = config.baseApi;
    } else {
        service.defaults.baseURL = config.mock ? config.mockApi : config.baseApi;
    }
    return service(options);
}

['get', 'post', 'put', 'delete', 'patch'].forEach((item) => {
    request[item] = (url, data, options) => {
        return request({
            url,
            data,
            method: item,
            ...options
        })
    }
})

export default request