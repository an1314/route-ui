<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
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
            <el-form-item label="日期" prop="date">
              <el-date-picker
                v-model="queryParams.date"
                size="small"
                style="width: 240px"
                value-format="yyyy-MM-dd"
                type="date"
              ></el-date-picker>
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
        <el-row>
          <el-col :span="14">SFA总人数：</el-col>
          <el-col :span="10">
            <el-input v-model="userInfo.sfaUserNum" type="number" size="small"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">今日登录人数：</el-col>
          <el-col :span="10">{{ userInfo.loginUserNum }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="14">登录占比：</el-col>
          <el-col :span="10">{{ userInfo.loginUserNum , userInfo.sfaUserNum | percentage }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="14">今日拜访人数：</el-col>
          <el-col :span="10">{{ userInfo.visitUserNum }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="14">拜访占比：</el-col>
          <el-col :span="10">{{ userInfo.visitUserNum , userInfo.sfaUserNum | percentage }}</el-col>
        </el-row>
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
  name: "routeact",
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
        date: new Date(),

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

      // 地图加载控制
      mapLoading: undefined,

      // 人员下拉框展示人员数量
      distPageSize: 50
    };
  },

  methods: {
    // 高德地图初始化完成触发
    initAMap(map, AMap, AMapUI) {},

    // 获取人员下拉框数据
    getUserDist(query){
      userDist({
        pageSize: this.distPageSize,
        name: query,
        orgCodes: this.queryParams.orgCodes,
        pageNum: 1
      }).then(res => {
        this.personList = res.data;
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
      //this.getList();
    },
    handleQuery() {
      this.mapLoading = this.$loading({
        target: this.$refs.amap.$el,
        lock: true
      });
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    }
  },
  created() {
    this.getTreeselect(this.getUserDist);
  },
  filters: {
    percentage(val1, val2) {
      if (val2 && val2 != "0") {
        return ((parseInt(val1) / parseInt(val2)) * 100).toFixed(2) + "%";
      } else {
        return "0%";
      }
    }
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
.place {
  color: rgb(38, 67, 197);
}
</style>