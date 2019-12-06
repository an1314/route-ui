// 将list转化为树形结构， 前提： 按level已经 正序 排过序
export const buildTreeOfList = (list, key, parent, initParentId) =>{
    let noMatchObject = {};
    while(list.length){
        let item = list.pop();
        let child = noMatchObject[item[key]];
        if(child){
            item.children  = child;
            noMatchObject[item[key]] = undefined;
        }
        let parentChildList = noMatchObject[item[parent]] || [];
        parentChildList.push(item);
        noMatchObject[item[parent]] =  parentChildList;
    }
    return noMatchObject[initParentId];
}

// 获得树形数据全部子节点
export const findChildrenParams = (data, islast, findValue, childrenName) => {
    // 数据源
    if(!data){
        return [];
    };
    // 是否只要最下层节点
    if(!islast){
        islast = false
    }
    // 要返回的value
    if(!findValue){
        findValue = 'value'
    }
    // children 的别名
    if(!childrenName){
        childrenName = 'children'
    };

    if(data instanceof Array){
        return data.reduce((array, item) => {
            array = array.concat(findChildrenParams(item, islast, findValue, childrenName))
            return array;
        }, [])
    }else{
        let returnValue = [];
        if(data.children && data.children.length){
            returnValue = returnValue.concat(findChildrenParams(data.children, islast, findValue, childrenName))
        }
        if(returnValue.length || !islast){
            returnValue.push(data[findValue])
        }
        return returnValue;
    }
}