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
            <el-form-item label="未登录天数" prop="noLoginDay">
              <el-select v-model="queryParams.noLoginDay" value-key="value" placeholder="请选择">
                <el-option
                  v-for="item in noLoginDayTypeList"
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
        <el-row :gutter="10" class="mb8" type="flex" justify="end">
          <el-col :span="16">
            <el-col :span="4.5">
              <!--v-hasPermi="['system:config:export']"  -->
              <el-button
                type="warning"
                icon="el-icon-download"
                size="mini"
                @click="handleExport"
                :loading="exportLoading"
              >导出</el-button>
            </el-col>
          </el-col>

          <el-col :span="3">{{ showOrgName }} - {{ queryParams.noLoginDay.label }}</el-col>
          <el-col :span="4" :offset="1">未登录系统总人数 {{ total }}</el-col>
        </el-row>
        <el-table v-loading="loading" :data="userList" >
          <el-table-column label="大区群" align="center" min-width="100" prop="largeRegionGroup" />
          <el-table-column label="大区" align="center" min-width="100" prop="largeRegion" show-overflow-tooltip/>
          <el-table-column label="小区" align="center" min-width="100" prop="smallRegion" show-overflow-tooltip />
          <el-table-column label="单元" align="center" min-width="100" prop="unit" show-overflow-tooltip />
          <el-table-column label="DOM" align="center" min-width="100" prop="dom" show-overflow-tooltip />
          <el-table-column label="DSS" align="center" min-width="100" prop="dss" show-overflow-tooltip />
          <el-table-column label="业代账号" align="center" min-width="100" prop="userCode" />
          <el-table-column label="业代姓名" align="center" min-width="100" prop="userName" />
          <el-table-column label="业代手机" align="center" min-width="100" prop="tel" />
          <el-table-column label="主管姓名" align="center" min-width="100" prop="managerCode" />
          <el-table-column label="主管手机" align="center" min-width="100" prop="managerUserName" />
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
import { noLoginUser, noLoginUserExport } from "@/api/route/users";
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
        // 未登录天数
        noLoginDay: {
          value: "2",
          label: "7天"
        },

        // 组织架构
        orgCodes: [],

        // 分页参数
        pageNum: 1,
        pageSize: 10
      },

      // 未登录天数数据源
      noLoginDayTypeList: [
        {
          value: "1",
          label: "3天"
        },
        {
          value: "2",
          label: "7天"
        },
        {
          value: "3",
          label: "一个月"
        },
        {
          value: "4",
          label: "三个月以上"
        }
      ],

      // 用于表头显示组织架构
      showOrgName: "总部",

      // 数据总条数
      total: 0,

      // 表格数据源
      userList: [],

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
    // 获取开始结束时间
    getBeginEnd() {
      switch (this.queryParams.noLoginDay.value) {
        // 三天到七天
        case "1":
          return {
            beginTime: this.$moment()
              .subtract(7, "days")
              .format("YYYY-MM-DD hh:mm:ss"),
            endTime: this.$moment()
              .subtract(3, "days")
              .format("YYYY-MM-DD hh:mm:ss")
          };
        // 七天到一个月
        case "2":
          return {
            beginTime: this.$moment()
              .subtract(1, "months")
              .format("YYYY-MM-DD hh:mm:ss"),
            endTime: this.$moment()
              .subtract(7, "days")
              .format("YYYY-MM-DD hh:mm:ss")
          };
        // 一个月到三个月
        case "3":
          return {
            beginTime: this.$moment()
              .subtract(3, "months")
              .format("YYYY-MM-DD hh:mm:ss"),
            endTime: this.$moment()
              .subtract(1, "months")
              .format("YYYY-MM-DD hh:mm:ss")
          };
        // 三个月以上
        default:
          return {
            beginTime: "1999-01-01 00:00:00",
            endTime: this.$moment()
              .subtract(3, "months")
              .format("YYYY-MM-DD hh:mm:ss")
          };
      }
    },
    // 查询
    getList() {
      this.loading = true;
      noLoginUser(
        Object.assign(
          {
            orgCodes: this.queryParams.orgCodes,
            pageNum: this.queryParams.pageNum,
            pageSize: this.queryParams.pageSize
          },
          this.getBeginEnd()
        )
      ).then(res => {
        this.userList = res.rows;
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
      this.userList = [];
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
      const queryParams = Object.assign(
        {},
        this.queryParams,
        this.getBeginEnd()
      );
      this.$confirm("是否确认导出所有参数数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.exportLoading = true;
          return noLoginUserExport(queryParams);
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
.place {
  color: rgb(38, 67, 197);
}
</style>