export default {
    formatDate(date, rule) {
        let fmt = rule || "yyyy-MM-dd hh:mm:ss";
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, date.getFullYear());
        }

        const o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        }

        for (let k in o) {
            if (new RegExp(`(${k})`).test(fmt)) {
                const val = o[k] + '';
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? val : ("00" + val).substr(val.length));
            }
        }
        return fmt;
    },

    //递归拼接菜单的路由信息
    getRouterInfo(menuList) {
        let routers = [];
        const deep = (menuList) => {
            while (menuList.length) {
                let item = menuList.pop();
                if (item.action) {
                    //有按钮则说明是菜单
                    routers.push({
                        name: item.component,
                        path: item.path,
                        meta: {
                            title: item.menuName
                        },
                        component: item.component
                    })
                } else if (item.children && !item.action) {
                    deep(item.children);
                }
            }
        }
        deep(menuList);
        return routers;
    }
}