import request from '@/utils/request'


// 查询用户覆盖
export function routeCustomerData(query) {

    return request({
        url: '/route/routecustomer/stores',
        method: 'post',
        data: query
    })
}

