import request from '@/utils/request'

// 查询某一周期内人员分布情况
export function routeActForUser(query) {
    const {
        pageSize,
        pageNum
    } = query
    return request({
        url: '/route/routeact/listForUser',
        method: 'post',
        params:  {
            pageSize,
            pageNum
        },
        data: query
    })
}

// 查询一周期内人员门店分布情况
export function routeActList(query) {

    return request({
        url: '/route/routeact/list',
        method: 'post',
        data: query
    })
}