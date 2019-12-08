import request from '@/utils/request'

// 查询一周期内计划路线
export function routeDetailList(query) {

    return request({
        url: '/route/routedetail/list',
        method: 'post',
        data: query
    })
}