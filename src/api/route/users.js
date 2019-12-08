import request from '@/utils/request'

// 查询人员字典
export function userDist(query) {
    const {
        pageSize,
        pageNum
    } = query
    return request({
        url: '/route/users/userdist',
        method: 'post',
        params:  {
            pageSize,
            pageNum
        },
        data: query
    })
}


// 查询用户各项信息汇总
export function userInfoSum(query) {

    return request({
        url: '/route/users/userinfosum',
        method: 'post',
        data: query
    })
}

// 查询未登录人员
export function noLoginUser(query) {

    const {
        pageSize,
        pageNum
    } = query
    return request({
        url: '/route/users/noloaginuser',
        method: 'post',
        params:  {
            pageSize,
            pageNum
        },
        data: query
    })
}

// 导出未登录人员
export function noLoginUserExport(query) {

    const {
        pageSize,
        pageNum
    } = query
    return request({
        url: '/route/users/noloaginuserexport',
        method: 'post',
        params:  {
            pageSize,
            pageNum
        },
        data: query
    })
}
