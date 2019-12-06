import request from '@/utils/request'
import { buildTreeOfList } from '@/utils/route'

// 查询组织架构下拉树结构
export function treeselect() {
    return  new Promise((req, rej) => {
        return request({
            url: '/route/organization/list',
            method: 'get'
        }).then((request) => {
            req({
                data: buildTreeOfList(request.data, 'orgId', 'parent', '0')
            })
        }).catch(() => {
            rej();
        })
    })
}