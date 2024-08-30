import request from "@/axios";

const getResourceApi = function (){
    return request({
        url:"release-experiment-1.21.21.01.cpack",
        responseType: 'arraybuffer',
        method:"get"
    })
}

export default{
    getResource: getResourceApi
}
