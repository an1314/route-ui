<template>
  <div class="app-container routeact">
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
            accordion
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
          <AMapTemp ref="amap" infowindowType="personInfoWindow" @init="initAMap" class="page"></AMapTemp>
        </el-col>
      </el-col>
      <el-col :span="4" :xs="4" style="min-height: 500px; line-height: 40px; font-size:11px">
        <el-row>
          <el-col :span="14">SFA总人数：</el-col>
          <el-col :span="10">
            <el-input-number v-model="userInfo.sfaNum" size="mini" min="0"  :controls="false" :precision="0" style="width:80px"></el-input-number>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">今日登录人数：</el-col>
          <el-col :span="10">{{ userInfo.loginNum }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="14">登录占比：</el-col>
          <el-col :span="10">{{ userInfo.loginNum , userInfo.sfaNum | percentage }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="14">今日拜访人数：</el-col>
          <el-col :span="10">{{ userInfo.visitNum }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="14">拜访占比：</el-col>
          <el-col :span="10">{{ userInfo.visitNum , userInfo.sfaNum | percentage }}</el-col>
        </el-row>
        <el-col :span="12" :xs="24" :sm="24" :md="24" :lg="24" v-for="person in personList">
          <el-col :span="2">
            <i class="el-icon-user-solid place"></i>
          </el-col>
          <el-col :span="16" @click.native="personClick(person)"  class="user-place">{{ person.userName }}</el-col>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { treeselect } from "@/api/route/organization";
import AMapTemp from "@/views/route/amap/index";
import { userDist, userInfoSum } from "@/api/route/users";
import { routeActForUser } from "@/api/route/routeact";
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
        orgCodes: []
      },

      // 侧边栏人员数据
      userInfo: {
        // sfa 总人数
        sfaNum: 0,

        // 登录人数
        loginNum: 0,

        // 拜访人数
        visitNum: 0
      },

      // 侧边栏人员数据
      personList: [],

      // 地图加载控制
      mapLoading: undefined
    };
  },

  methods: {
    // 高德地图初始化完成触发
    initAMap(map, AMap, AMapUI) {},

    getList() {
      let date = this.$moment(this.queryParams.date).format("YYYY-MM-DD");

      // 获取侧边栏用户信息
      userInfoSum({
        orgCodes: this.queryParams.orgCodes,
        beginTime: date + " 00:00:00",
        endTime: date + " 23:59:59"
      }).then(res => {
        this.userInfo = res.data;
      });
      // 获取人员点分布
      routeActForUser({
        orgCodes: this.queryParams.orgCodes,
        beginTime: date + " 00:00:00",
        endTime: date + " 23:59:59",
        pageSize: 0,
        pageNum: 1
      }).then(res => {
        // 清空地图
        this.$refs.amap.clear();
        this.personList = [];
        // 绘制地图
        if (res.rows && res.rows.length) {
          let persons = res.rows.map(item =>
            Object.assign(item, { lnglat: [item.lon, item.lat] })
          );
          this.$refs.amap.createMassMarker({
            markers: persons,
            img: require("@/assets/markers/icon3.png")
          });
          this.personList = persons;
        }
        this.mapLoading.close();
      });
    },

    // 侧边栏人员点击事件
    personClick(person) {
      let map = this.$refs.amap;
      // 重定位地图
      map.amap.setCenter(person.lnglat);
      // 更改信息窗口数据
      map.infowindowData = person;
      // 打开信息窗口
      this.$set(map.infowindow, "visible", true);
      // 重定位信息窗口
      this.$set(map.infowindow, "position", [person.lon, person.lat]);
    },
    // 获取组织架构树
    getTreeselect() {
      treeselect().then(response => {
        this.organizationOptions = response.data;
        this.queryParams.orgCodes = this.findChildrenParams(
          this.organizationOptions,
          false,
          "orgCode"
        );
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data[this.defaultProps.label].indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      let orgCodes = this.findChildrenParams(data, false, "orgCode");
      this.queryParams.orgCodes = orgCodes;
      //this.getList();
    },
    handleQuery() {
      this.mapLoading = this.$loading({
        target: this.$refs.amap.$el,
        lock: true
      });
      this.getList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.userInfo = {
        sfaNum: 0,
        loginNum: 0,
        visitNum: 0
      };
      this.personList = [];
      this.$refs.amap.clear();
    }
  },
  created() {
    this.getTreeselect();
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

.page {
  overflow-y: auto;
  height: calc(100vh - 220px);
}
</style>