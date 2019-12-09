<template>
    <el-row style="min-width: 300px">
        <el-row :gutter="2" >
            <el-col :xs="9" :sm="9" :md="9" :lg="9" :xl="9">门店编号: </el-col>
            <el-col :xs="15" :sm="15" :md="15" :lg="15" :xl="15">{{ data['storeCode'] || "　" }}</el-col>
            <el-col :xs="9" :sm="9" :md="9" :lg="9" :xl="9">门店名称: </el-col>
            <el-col :xs="15" :sm="15" :md="15" :lg="15" :xl="15">{{ data['storeName'] || "　"  }}</el-col>
            <el-col :xs="9" :sm="9" :md="9" :lg="9" :xl="9">地址: </el-col>
            <el-col :xs="15" :sm="15" :md="15" :lg="15" :xl="15">{{ data['storeAddress'] || "　"  }}</el-col>
            <el-col :xs="9" :sm="9" :md="9" :lg="9" :xl="9">门店类型: </el-col>
            <el-col :xs="15" :sm="15" :md="15" :lg="15" :xl="15">{{ data['storeType'] || "　"  }}</el-col>
            <el-col :xs="9" :sm="9" :md="9" :lg="9" :xl="9">经度: </el-col>
            <el-col :xs="15" :sm="15" :md="15" :lg="15" :xl="15">{{ data['longitude'] || "　"  }}</el-col>
            <el-col :xs="9" :sm="9" :md="9" :lg="9" :xl="9">纬度: </el-col>
            <el-col :xs="15" :sm="15" :md="15" :lg="15" :xl="15">{{ data['latitude'] || "　"  }}</el-col>
        </el-row>
    </el-row>
</template>

<script>
export default {
    name: "storeinfowindowforlnglat",
    props: {
        // 数据源
        data: {
            type: Object,
            default(){
                return {}
            }
        },
    }
}
</script>

<style>

</style>