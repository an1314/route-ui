import request from '@/utils/request'

// 查询门店信息
export function storeList(query) {
    const {
        pageSize,
        pageNum
    } = query
    return request({
        url: '/route/store/list',
        method: 'post',
        params:  {
            pageSize,
            pageNum
        },
        data: query
    })
}

// 导出门店信息
export function storeListExport(query) {
    const {
        pageSize,
        pageNum
    } = query
    return request({
        url: '/route/store/listexport',
        method: 'post',
        params:  {
            pageSize,
            pageNum
        },
        data: query
    })
}

