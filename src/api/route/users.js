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
