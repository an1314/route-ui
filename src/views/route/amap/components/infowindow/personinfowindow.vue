<template>
    <el-row style="min-width: 300px">
        <el-row :gutter="10" >
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">员工编号: </el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">{{ data['userCode'] || "　" }}</el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">员工姓名: </el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">{{ data['userName'] || "　"}}</el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">主管编号: </el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">{{ data['managerUserCode'] || "　" }}</el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">主管姓名: </el-col>
            <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">{{ data['managerUserName'] || "　" }}</el-col>
        </el-row>
    </el-row>
</template>

<script>
export default {
    name: "personinfowindow",
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