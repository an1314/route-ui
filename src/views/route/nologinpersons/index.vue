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
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
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
        <el-col :span="24" style="margin-bottom: 10px">
          <el-row type="flex" justify="end">
            <el-col :span="2">{{ '总部' }} - {{ queryParams.noLoginDay.label }} </el-col>
            <el-col :span="4" :offset="1"> 未登录系统总人数 {{ total }}</el-col>
          </el-row>
        </el-col>
        <el-table v-loading="loading" :data="userList">
          <el-table-column label="大区群" align="center" prop="userId" />
          <el-table-column label="大区" align="center" prop="userName" />
          <el-table-column label="小区" align="center" prop="nickName" />
          <el-table-column label="单元" align="center" prop="dept.deptName" />
          <el-table-column label="DOM" align="center" prop="phonenumber" />
          <el-table-column label="DSS" align="center" prop="phonenumber" />
          <el-table-column label="业代姓名" align="center" prop="phonenumber" />
          <el-table-column label="业代手机" align="center" prop="phonenumber" />
          <el-table-column label="主管账号" align="center" prop="phonenumber" />
          <el-table-column label="主管姓名" align="center" prop="phonenumber" />
          <el-table-column label="主管手机" align="center" prop="phonenumber" />
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
        label: "label"
      },

      // 查询参数
      queryParams: {
        // 未登录天数
        noLoginDay: {
          value: "2",
          label: "7天"
        },

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

      // 数据总条数
      total: 0,

      // 表格数据源
      userList: [],

      // 表格加载控制
      loading: false
    };
  },
  computed: {},
  methods: {
    // 获取组织架构树
    getTreeselect() {
      // treeselect().then(response => {
      //   this.organizationOptions = response.data;
      // });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.orgId = data.id;
      this.getList();
    },
    getList() {},
    // 搜索点击事件
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    // 重置点击事件
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
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
    }
  },
  created() {
    this.getList();
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
</style>