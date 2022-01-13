import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import App from './App.vue'
import axios from 'axios'
import config from './config'
import request from './utils/request'
import storage from './utils/storage'
import api from './api'
import store from './store'

const app = createApp(App);

//axios
//全局注册request
app.config.globalProperties.$request = request;
app.config.globalProperties.$storage = storage;
app.config.globalProperties.$api = api;
// console.log(config.mockApi)
// axios.get(config.mockApi + "/login").then(
//     (res) => {
//         console.log(res);
//     }
// )

//指令的封装
app.directive('has', {
    beforeMount: (el, binding) => {
        let userAction = storage.getItem('actionList');
        let value = binding.value;
        let hasPermission = userAction.includes(value);
        if (!hasPermission) {
            //若没有该按钮，则隐藏并删除该节点
            el.style.display = 'none';
            setTimeout(() => {
                el.parentNode.removeChild(el);
            }, 0)
        }

    }
})

app.use(router);
app.use(ElementPlus, { size: 'small' })
app.use(store)
app.mount('#app')

//console.log("环境变量", import.meta.env);

