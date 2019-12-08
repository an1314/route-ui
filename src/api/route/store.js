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

// 插入门店信息
export function inserStore(params) {
    return request({
        url: '/route/store/insert',
        method: 'post',
        data: params
    })
}

// 修改门店信息
export function updateStore(params) {
    return request({
        url: '/route/store/update',
        method: 'put',
        data: params
    })
}


// 删除门店
export function deleteStores(codes) {
    return request({
        url: '/route/store/delete/'+codes,
        method: 'delete',
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

