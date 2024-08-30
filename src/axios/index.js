// 封装axios，统一发送请求
import axios from "axios";

const request = axios.create({
    baseURL : import.meta.env.VITE_BASIC_URL
})

// 响应拦截器
request.interceptors.response.use(function (response) {
    // const code = response.data.status;
    // if (code !== 2000){
    //     Notification({
    //         title: '错误',
    //         type:"error",
    //         message: response.data.msg,
    //         offset: 100,
    //         position: 'bottom-left'
    //     });
    //
    //     if (code === 50014){
    //         MessageBox.confirm('您的登录已过期', '提示', {
    //             distinguishCancelAndClose: true,
    //             confirmButtonText: '重新登录',
    //             cancelButtonText: '退出登录',
    //             type: 'warning'
    //         }).then(() => {
    //             stores.commit("logout")
    //             router.push({name:"Login"}).catch(err=>{router.push({name:"Login"})})
    //         }).catch(action =>{
    //             if (action === "cancel"){
    //                 stores.commit("logout")
    //                 if (router.currentRoute.path === "/" || router.currentRoute.path === ""){
    //                     router.go(0)
    //                 }else {
    //                     router.push({name:"index"}).catch(err=>{router.push({name:"index"})})
    //                 }
    //             }
    //         })
    //     }
    //     return Promise.reject(new Error());
    // }else {
    //     return response;
    // }
    return response;
}, function (error) {
    // const code = error.response.status;
    // if (code === 500){
    //     router.push({
    //         name:'error500'
    //     })
    // }else if (code === 403){
    //     router.push({
    //         name:'error403'
    //     })
    // }

    return Promise.reject(error.status);
});
export default request
