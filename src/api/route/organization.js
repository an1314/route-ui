import request from '@/utils/request'

// 查询组织架构下拉树结构
export function treeselect() {
    return request({
        url: '/route/organization/treeselect',
        method: 'get'
    })
}