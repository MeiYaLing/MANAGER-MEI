import request from '../utils/request'
export default {
    //登录
    login(params) {
        return request({
            url: "/users/login",
            method: "post",
            data: params,
            mock: false
        })
    },
    //待审批通知数量
    noticeCount() {
        return request({
            url: "/leave/count",
            method: "get",
            data: {},
            mock: true
        })
    },
    //菜单列表
    menuList() {
        return request({
            url: "/menu/list",
            method: "get",
            data: {},
            mock: false
        })
    },
    //用户列表
    userList(params) {
        return request({
            url: "/users/list",
            method: "get",
            data: params,
            mock: false
        })
    },
    //用户删除
    userDelete(params) {
        return request({
            url: "/users/delete",
            method: "post",
            data: params,
            mock: false
        })
    },
    //角色名称列表
    getRoleList() {
        return request({
            url: "/roles/allList",
            method: "get",
            mock: true
        })
    },
    //部门列表
    getDeptList() {
        return request({
            url: "/dept/list",
            method: "get",
            mock: true
        })
    },
    //用户创建/编辑
    userSubmit(params) {
        return request({
            url: "/users/operate",
            method: "post",
            data: params,
            mock: false
        })
    },
    //菜单创建/编辑/删除
    menuSubmit(params) {
        return request({
            url: "/menu/operate",
            method: "post",
            data: params,
            mock: false
        })
    },
}