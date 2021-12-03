/**
 * 环境变量的封装
 */
const env = import.meta.env.MODE || "prod"

const EnvConfig = {
    dev: {
        baseApi: '/api',
        mockApi: 'https://www.fastmock.site/mock/02a09ee010b84b423affdad4219820f4/api'
    },
    test: {
        baseApi: '//test.future.com/api',
        mockApi: 'https://www.fastmock.site/mock/02a09ee010b84b423affdad4219820f4/api'
    },
    prod: {
        baseApi: '//future.com/api',
        mockApi: 'https://www.fastmock.site/mock/02a09ee010b84b423affdad4219820f4/api'
    },
}

export default {
    env,
    mock: true,
    ...EnvConfig[env],
    namespace: 'manage'
}