<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24" class="page">
        <div class="head-container">
          <el-input
            v-model="organizationName"
            placeholder="请输入组织架构名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="organizationOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            check-on-click-node
            highlight-current
            :filter-node-method="filterNode"
            ref="tree"
            @node-click="handleNodeClick"
          >
             <span slot-scope="{ node, data }">
                <span class="el-tree-node__label" :title="node.label">{{ node.label }}</span>
             </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="16" :xs="20" style="min-height: 500px">
        <el-col :span="24">
          <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
            <el-form-item label="人员" prop="persons">
              <el-select
                v-model="queryParams.persons"
                value-key="value"
                multiple
                filterable
                collapse-tags
                remote
                reserve-keyword
                placeholder="请输入人员姓名"
                :remote-method="remoteMethod"
                :loading="personSelectloading"
              >
                <el-option
                  v-for="item in personData"
                  :key="item.value"
                  :label="item.label"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="24">
          <AMapTemp ref="amap" @init="initAMap" style="height:700px"></AMapTemp>
        </el-col>
      </el-col>
      <el-col :span="4" :xs="4" style="min-height: 500px; line-height: 40px; font-size:11px">
        <el-col :span="12"  v-for="person in personList">
          <el-col :span="2">
            <i class="el-icon-user-solid place"></i>
          </el-col>
          <el-col :span="16">{{ person.name }}</el-col>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { treeselect } from "@/api/route/organization";
import AMapTemp from "@/views/route/amap/index";
import { userDist } from "@/api/route/users"
export default {
  name: "routecustomer",
  components: {
    AMapTemp
  },
  data() {
    return {
      // 侧边栏组织架构晒选条件
      organizationName: undefined,

      // 组织架构数据源
      organizationOptions: undefined,

      defaultProps: {
        children: "children",
        label: "orgNameCn"
      },

      // 查询参数
      queryParams: {
        // 日期
        persons: [],

        // 组织架构
        orgCodes: [],
      },

      // 侧边栏人员数据
      userInfo: {
        // sfa 总人数
        sfaUserNum: 0,

        // 登录人数
        loginUserNum: 0,

        // 拜访人数
        visitUserNum: 0
      },

      // 侧边栏人员数据
      personList: [
        {
          color: "red",
          name: "张三"
        },
        {
          color: "red",
          name: "张三"
        }
      ],

      // 下拉框检索值
      selectQuery: '',

      // 人员下拉框源数据
      personSource: [],

      // 地图加载控制
      mapLoading: undefined,

      // 人员下拉框加载控制
      personSelectloading: false,

      // 人员下拉框展示人员数量
      distPageSize: 50
    };
  },
  computed: {
      // 转换人员数据源为下拉框可用格式 index 0 为下拉框键值， index 1 为对象键值 
      personData(){
        let mapping = [
            ['value', 'value'],
            ['label', 'label']
        ]
        return this.personSource.map(item => Object.assign(item, mapping.reduce((obj, child)=> {
            obj[child[0]] = item[child[1]]
            return obj
        }, {})))
      }
  },
  methods: {
    // 高德地图初始化完成触发
    initAMap(map, AMap, AMapUI) {},

    // 获取人员下拉框数据
    getUserDist(callback){
      userDist({
        pageSize: this.distPageSize,
        name: this.selectQuery,
        orgCodes: this.queryParams.orgCodes,
        pageNum: 1
      }).then(res => {
        this.personSource = res.rows;
        if(callback){
          callback()
        }
      })
    },

    // 获取组织架构树
    getTreeselect(callback) {
      treeselect().then(response => {
         this.organizationOptions = response.data;
         this.queryParams.orgCodes = this.findChildrenParams(this.organizationOptions, false, 'orgCode')
          callback();
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data[this.defaultProps.label].indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      let orgCodes = this.findChildrenParams(data, false, 'orgCode')
      this.queryParams.orgCodes = orgCodes;
      this.selectQuery = ''
      this.getUserDist();
      //this.getList();
    },
    // 搜索点击事件
    handleQuery() {
      this.mapLoading = this.$loading({
        target: this.$refs.amap.$el,
        lock: true
      });
      console.log(this.queryParams.persons);
    },
    // 重置点击事件
    resetQuery() {
      this.resetForm("queryForm")
      this.handleQuery();
    },
    remoteMethod(query) {
        this.selectQuery = query
        this.personSelectloading = true;
        this.getUserDist(() => this.personSelectloading = false)
    }
  },
  created() {
    this.getTreeselect(this.getUserDist);
  },
  filters: {
  },
  watch: {
    // 根据名称筛选部门树
    organizationName(val) {
      this.$refs.tree.filter(val);
    }
  }
};
</script>

<style>
.page{
  overflow-y: scroll;
  height: calc(100vh - 120px);
}
.place {
  color: rgb(38, 67, 197);
}
</style>