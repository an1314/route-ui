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
      <el-col :span="20" :xs="24" style="min-height: 500px">
        <el-col :span="24">
          <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px">
            <el-form-item label="门店编号/名称" prop="storeName">
              <el-input v-model.trim="queryParams.storeName"></el-input>
            </el-form-item>
            <el-form-item label="门店类型" prop="storeTypes">
              <el-select v-model="queryParams.storeTypes" placeholder="请选择" multiple filterable collapse-tags>
                <el-option
                  v-for="item in storeTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="门店状态" prop="storeStatus">
              <el-select v-model="queryParams.storeStatus" placeholder="请选择">
                <el-option
                  v-for="item in storeStatusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <!--v-hasPermi="['system:config:export']"  -->
              <el-button
                type="warning"
                icon="el-icon-download"
                size="mini"
                @click="handleExport"
                :loading="exportLoading"
              >导出</el-button>
            </el-col>
          </el-row>
        </el-col>

        <el-table v-loading="loading" :data="storeList">
          <el-table-column label="大区群" align="center" prop="largeRegionGroup" />
          <el-table-column label="大区" align="center" prop="largeRegion" />
          <el-table-column label="小区" align="center" prop="smallRegion" show-overflow-tooltip  />
          <el-table-column label="单元" align="center" prop="unit" show-overflow-tooltip />
          <el-table-column label="DOM" align="center" prop="dom" show-overflow-tooltip />
          <el-table-column label="DSS" align="center" prop="dss" show-overflow-tooltip  />
          <el-table-column label="SFACODE" align="center" prop="sfaCode" />
          <el-table-column label="门店编号" align="center" prop="storeCode" show-overflow-tooltip />
          <el-table-column label="门店名称" align="center" prop="storeName" show-overflow-tooltip  />
          <el-table-column label="门店地址" align="center" prop="storeAddress" show-overflow-tooltip />
          <el-table-column label="门店类型" align="center" prop="storeType" />
          <el-table-column label="门店状态" align="center" prop="storeStatus">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.storeStatus ? 'success' : 'error'"
                disable-transitions
              >{{scope.row.storeStatus ? '有效': '无效'}}</el-tag>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { treeselect } from "@/api/route/organization";
import AMapTemp from "@/views/route/amap/index";
import { storeList, storeListExport } from "@/api/route/store";
export default {
  name: "nologinpersons",
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
        // 门店类型
        storeTypes: [],

        // 门店状态
        storeStatus: "",

        // 门店名称
        storeName: "",

        // 组织架构
        orgCodes: [],

        // 分页参数
        pageNum: 1,
        pageSize: 10
      },

      // 门店类型集合
      storeTypeList: [
        {
          value: "Grocery",
          label: "Grocery"
        },
        {
          value: "Mini",
          label: "Mini"
        },
        {
          value: "Kiosk",
          label: "Kiosk"
        },
        {
          value: "Mini High",
          label: "Mini High"
        },
        {
          value: "CVS",
          label: "CVS"
        },
        {
          value: "Super Low",
          label: "Super Low"
        },
        {
          value: "Super High",
          label: "Super High"
        },
        {
          value: "Hyper",
          label: "Hyper"
        },
        {
          value: "WS",
          label: "WS"
        },
        {
          value: "Super",
          label: "Super"
        },
        {
          value: "SmallMini",
          label: "SmallMini"
        },
        {
          value: "其他",
          label: "其他"
        },
        {
          value: "HM",
          label: "HM"
        },
        {
          value: "Large SM",
          label: "Large SM"
        },
        {
          value: "C&C",
          label: "C&C"
        },
        {
          value: "Small SM",
          label: "Small SM"
        },
        {
          value: "LargeMini",
          label: "LargeMini"
        },
        {
          value: "Prestige SM",
          label: "Prestige SM"
        },
        {
          value: "Premium SM",
          label: "Premium SM"
        },
        {
          value: "Club",
          label: "Club"
        },
        {
          value: "PCS",
          label: "PCS"
        },
        {
          value: "DS",
          label: "DS"
        },
        {
          value: "Others (WS,virtual…)",
          label: "Others (WS,virtual…)"
        },
        {
          value: "eCOM",
          label: "eCOM"
        }
      ],

      // 门店状态集合
      storeStatusList: [
        {
          value: "",
          label: "全部"
        },
        {
          value: true,
          label: "有效"
        },
        {
          value: false,
          label: "无效"
        }
      ],

      // 用于表头显示组织架构
      showOrgName: "总部",

      // 数据总条数
      total: 0,

      // 表格数据源
      storeList: [],

      // 表格加载控制
      loading: false,

      // 导出加载控制
      exportLoading: false
    };
  },
  computed: {},
  methods: {
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
      // 获取节点下级
      let orgCodes = this.findChildrenParams(data, false, "orgCode");
      this.queryParams.orgCodes = orgCodes;
      this.showOrgName = data.orgNameCn;
      //this.getList();
    },
    // 查询
    getList() {
      this.loading = true;
      storeList(this.queryParams).then(res => {
        this.storeList = res.rows;
        this.total = res.total;
        this.loading = false;
      });
    },
    // 搜索点击事件
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    // 重置点击事件
    resetQuery() {
      this.resetForm("queryForm");
      this.storeList = [];
      this.total = 0;
      //this.handleQuery();
    },
    remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.options = this.list.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options = [];
      }
    },
    handleExport() {
      const queryParams = this.queryParams;

      this.$confirm("是否确认导出所有参数数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.exportLoading = true;
          return storeListExport(queryParams);
        })
        .then(response => {
          this.exportLoading = false;
          this.download(response.msg);
        })
        .catch(function() {});
    }
  },
  created() {
    this.getTreeselect();
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
.place {
  color: rgb(38, 67, 197);
}
</style>