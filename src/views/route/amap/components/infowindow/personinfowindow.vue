<template>
    <el-row style="min-width: 300px">
        <el-row :gutter="10" v-for="item in data" :key="item[label]">
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">{{ item[label] }}</el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">{{ item[val] }}</el-col>
        </el-row>
    </el-row>
</template>

<script>
export default {
    name: "personinfowindow",
    props: {
        // 数据源
        data: {
            type: Array,
            default(){
                return []
            }
        },
        // 遍历生成dom文档时 label值
        label: {
            type: String,
            default(){
                return 'label';
            }
        },
        // 遍历生成dom文档时 val值
        val: {
            type: String,
            default(){
                return 'value'
            }
        }
    }
}
</script>

<style>

</style>