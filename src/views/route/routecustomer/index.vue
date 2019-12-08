<template>
  <div class="app-container routecustomer">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24" >
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
            accordion
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
          <AMapTemp ref="amap" infowindowType="storeInfoWindow" @init="initAMap" class="page"></AMapTemp>
        </el-col>
      </el-col>
      <el-col :span="4" :xs="4" style="min-height: 500px; line-height: 40px; font-size:11px">
        <el-col :span="12" v-for="person in personList">
          <el-col :span="2">
            <i class="el-icon-user-solid" :style="'color:'+person.color"></i>
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
import { userDist } from "@/api/route/users";
import { routeCustomerData } from "@/api/route/routecustomer";
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

        // 组织架构所选层级
        orgLevel: '0'
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
      ],

      // 下拉框检索值
      selectQuery: "",

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
    personData() {
      let mapping = [["value", "value"], ["label", "label"]];
      return this.personSource.map(item =>
        Object.assign(
          item,
          mapping.reduce((obj, child) => {
            obj[child[0]] = item[child[1]];
            return obj;
          }, {})
        )
      );
    }
  },
  methods: {
    // 高德地图初始化完成触发
    initAMap(map, AMap, AMapUI) {},

    // 获取用户覆盖
    getList() {

      
      if(!this.queryParams.persons.length && new Set(['0', '1', '2', '3']).has(this.queryParams.orgLevel)){
        this.$message({
          message: '请选择单元层级和DSS层级',
          type: 'warning'
        });
        this.mapLoading.close();
        return;
      }

      routeCustomerData({
        orgCodes: this.queryParams.orgCodes,
        userCodes: this.queryParams.persons.map(item => item.value)
      }).then(res => {
        
        // 清空地图
        this.$refs.amap.clear();

        // 绘制地图
        if (res.data && res.data.length) {
          res.data.forEach((item, index) => {
            // 获取颜色数据
            let colorObj = this.markerList[index%this.markerList.length];
            let markers = item.stores.map(child =>
              Object.assign(child, { lnglat: [child.longitude, child.latitude], userName:item.userName })
            );
            this.$refs.amap.createMassMarker({
              markers: markers,
              img: colorObj.img
            });
            Object.assign(item, {color: colorObj.color})
          });
        }else{
          this.$message({
            message: '无匹配门店数据',
            type: 'success'
          });
        }
        this.personList = res.data|| [];
        this.mapLoading.close();
      });
    },

    // 获取人员下拉框数据
    getUserDist(callback) {
      userDist({
        pageSize: this.distPageSize,
        name: this.selectQuery,
        orgCodes: this.queryParams.orgCodes,
        pageNum: 1
      }).then(res => {
        this.personSource = res.rows;
        if (callback) {
          callback();
        }
      });
    },

     // 侧边栏人员点击事件
    personClick(person){
      let map =  this.$refs.amap;
      if(person.stores && person.stores.length){
        // 重定位地图
        map.amap.setCenter(person.stores[0].lnglat);
      }else{
        this.$message({
          message: '无匹配门店数据',
          type: 'success'
        });
      }      
    },

    // 获取组织架构树
    getTreeselect(callback) {
      treeselect().then(response => {
        this.organizationOptions = response.data;
        this.queryParams.orgCodes = this.findChildrenParams(
          this.organizationOptions,
          false,
          "orgCode"
        );
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
      let orgCodes = this.findChildrenParams(data, false, "orgCode");
      this.queryParams.orgCodes = orgCodes;
      this.queryParams.orgLevel = data.orgLevel
      this.selectQuery = "";
      this.getUserDist();
      //this.getList();
    },
    // 搜索点击事件
    handleQuery() {
      this.mapLoading = this.$loading({
        target: this.$refs.amap.$el,
        lock: true
      });
      this.getList();
    },
    // 重置点击事件
    resetQuery() {
      this.resetForm("queryForm");
      this.personList = [];
      this.$refs.amap.clear();
      //this.handleQuery();
    },
    remoteMethod(query) {
      this.selectQuery = query;
      this.personSelectloading = true;
      this.getUserDist(() => (this.personSelectloading = false));
    }
  },
  created() {
    this.getTreeselect(this.getUserDist);
  },
  filters: {},
  watch: {
    // 根据名称筛选部门树
    organizationName(val) {
      this.$refs.tree.filter(val);
    }
  }
};
</script>

<style lang="scss" scoped>

  .page {
    overflow-y: auto;
    height: calc(100vh - 220px);
  }

</style>