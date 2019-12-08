<template>
  <div class="app-container routedetail">
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
            <el-form-item label="日期" prop="date">
              <el-date-picker
                v-model="queryParams.date"
                size="small"
                style="width: 240px"
                value-format="yyyy-MM-dd"
                type="date"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="出行方式" prop="planType">
              <el-select v-model="queryParams.planType" placeholder="请选择">
                <el-option
                  v-for="item in planTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
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
        <el-col :span="24" style="margin-bottom: 10px">
          <el-row type="flex" justify="end">
            <el-col :span="8" :xs="14" :sm="12" :md="10">
              <el-radio v-model="planTypeRadio" label="0">计划路线</el-radio>
              <el-radio v-model="planTypeRadio" label="1">实际路线</el-radio>
              <el-radio v-model="planTypeRadio" label="2">路线对比</el-radio>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="[24, 0, 12][parseInt(planTypeRadio)]">
          <AMapTemp ref="detailamap" infowindowType="storeInfoWindow" @init="initPlanAMap" class="page"></AMapTemp>
        </el-col>
        <el-col :span="[0, 24, 12][parseInt(planTypeRadio)]">
          <AMapTemp ref="actamap" infowindowType="storeInfoWindow" @init="initDetailAMap" class="page"></AMapTemp>
        </el-col>
      </el-col>
      <el-col :span="4" :xs="4" style="min-height: 500px; line-height: 40px; font-size:11px">
        <el-col :span="12" v-for="person in personList">
          <el-col :span="2">
            <i class="el-icon-user-solid" :style="'color:'+person.color.color"></i>
          </el-col>
          <el-col :span="16" @click.native="personClick(person)" class="user-place">{{ person.label }}</el-col>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { treeselect } from "@/api/route/organization";
import AMapTemp from "@/views/route/amap/index";
import { userDist } from "@/api/route/users";
import { routeActList } from '@/api/route/routeact';
import { routeDetailList } from '@/api/route/routedetail'
export default {
  name: "organization",
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
        // 人员
        persons: [],

        // 日期
        date: new Date(),

        // 组织架构
        orgCodes: [],

        // 出行方式
        planType: "line"
      },

      // 侧边栏人员数据
      personList: [],

      // 人员下拉框源数据
      personSource: [],

      // 实际路线地图加载控制
      actMapLoading: undefined,

      // 计划路线地图加载控制
      detailMapLoading: undefined,

      // 人员下拉框加载控制
      personSelectloading: false,

      // 出行方式数据源
      planTypeList: [
        {
          value: "line",
          label: "直线"
        },
        {
          value: "warking",
          label: "步行"
        },
        {
          value: "riding",
          label: "骑行"
        },
        {
          value: "driving",
          label: "驾车"
        }
      ],

      // 下拉框检索值
      selectQuery: "",

      // 路线类型选择
      planTypeRadio: "0",

      // 人员下拉框展示人员数量
      distPageSize: 50,

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
    // 实际路线高德地图初始化完成触发
    initPlanAMap(map, AMap, AMapUI) {
    },

    // 计划路线高德地图初始化完成触发
    initDetailAMap(map, AMap, AMapUI) {
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
    getList(){
      let date = this.$moment(this.queryParams.date).format("YYYY-MM-DD");


      // 获取人员颜色及图标
      const len = this.markerList.length;
      let personList = [];
      if(this.queryParams.persons.length == 0){
        // 未选择人员，将获取的下拉框数据作为人员数据
        this.personList = this.personData.map((item, index) => {
        return Object.assign({
            color: this.markerList[index%len]
          }, item);
        });
        this.$message({
            message: '所选组织架构人员过多，将获取前五十人查询数据',
            type: 'warning'
        });
      }else{
        this.personList = this.queryParams.persons.map((item, index) => {
        return Object.assign({
            color: this.markerList[index%len]
          }, item);
        });
      }
      
      // 获取人员计划路线
      routeDetailList({
        orgCodes: this.queryParams.orgCodes,
        beginTime: date + " 00:00:00",
        endTime: date + " 23:59:59",
        userCodes: this.personList.map(item => item.value)
      }).then(res => {
        // 清空地图
        this.$refs.detailamap.clear();
        // 绘制地图
        if (res.data && res.data.length) {
          res.data.forEach((item, index) => {
            let personColor = this.personList.find(child => child.value == item.userCode);
            this.$refs.detailamap.createLine(item.stores, this.queryParams.planType, personColor.color.color, undefined, item.userName);       
            personColor.detail = item.stores;
            Object.assign(item, personColor.color.color)
          });
          this.$refs.detailamap.amap.setFitView();
        }else{
          this.$message({
            message: '无匹配门店计划',
            type: 'success'
          });
        }
        this.datailMapLoading.close();
      });

      // 获取人员门店分布
      routeActList({
        orgCodes: this.queryParams.orgCodes,
        beginTime: date + " 00:00:00",
        endTime: date + " 23:59:59",
        userCodes: this.personList.map(item => item.value)
      }).then(res => {
        // 清空地图
        this.$refs.actamap.clear();
        // 绘制地图
        if (res.data && res.data.length) {
          
          res.data.forEach((item, index) => {
            let personColor = this.personList.find(child => child.value == item.userCode);
            this.$refs.actamap.createLine(item.stores, this.queryParams.planType, personColor.color.color, undefined, item.userName);
            personColor.act = item.stores;
            Object.assign(item, {color: personColor.color.color})
          });
          this.$refs.actamap.amap.setFitView();
        }else{
          this.$message({
            message: '无匹配门店拜访',
            type: 'success'
          });
        }
        this.actMapLoading.close();
      });
  
    },

    // 侧边栏人员点击事件
    personClick(person){
      let actmap =  this.$refs.actamap;
      if(person.act && person.act.length){
        // 重定位地图
        actmap.amap.setCenter(person.act[0].lnglat);
      }else{
        this.$message({
          message: '无匹配门店拜访',
          type: 'success'
        });
      }
      


      let detailmap =  this.$refs.detailamap;
      if(person.detail && person.detail.length){
        // 重定位地图
        detailmap.amap.setCenter(person.detail[0].lnglat);
      }else{
        this.$message({
          message: '无匹配门店计划',
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
      this.selectQuery = "";
      this.getUserDist();
      //this.getList();
    },
    // 搜索点击事件
    handleQuery() {
      this.datailMapLoading = this.$loading({
        target: this.$refs.detailamap.$el,
        lock: true
      });
      this.actMapLoading = this.$loading({
        target: this.$refs.actamap.$el,
        lock: true
      });
      this.getList();
    },
    // 重置点击事件
    resetQuery() {
      this.resetForm("queryForm");
      this.personList = [];
      this.$refs.actamap.clear();
      this.$refs.detailamap.clear();
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

<style>
  .page {
    overflow-y: auto;
    height: calc(100vh - 250px);
  }
</style>