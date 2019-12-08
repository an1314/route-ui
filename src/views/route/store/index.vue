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
              <el-select
                v-model="queryParams.storeTypes"
                placeholder="请选择"
                multiple
                filterable
                collapse-tags
              >
                <el-option
                  v-for="item in storeTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="门店状态" prop="storeStatus">
              <el-select v-model="queryParams.storeStatus" placeholder="请选择" clearable>
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
            <!--  v-hasPermi="['system:config:add']" -->
            <el-col :span="1.5">
              <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
            </el-col>
            <!--  v-hasPermi="['system:config:edit']" -->
            <el-col :span="1.5">
              <el-button
                type="success"
                icon="el-icon-edit"
                size="mini"
                :disabled="single"
                @click="handleUpdate"
              >修改</el-button>
            </el-col>
            <!--  v-hasPermi="['system:config:remove']" -->
            <el-col :span="1.5">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleDelete"
              >删除</el-button>
            </el-col>
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

        <el-table v-loading="loading" :data="storeList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="大区群" align="center" prop="largeRegionGroup" />
          <el-table-column label="大区" align="center" prop="largeRegion" show-overflow-tooltip/>
          <el-table-column label="小区" align="center" prop="smallRegion" show-overflow-tooltip />
          <el-table-column label="单元" align="center" prop="unit" show-overflow-tooltip />
          <el-table-column label="DOM" align="center" prop="dom" show-overflow-tooltip />
          <el-table-column label="DSS" align="center" prop="dss" show-overflow-tooltip />
          <el-table-column label="SFACODE" align="center" prop="sfaCode" />
          <el-table-column label="门店编号" align="center" prop="storeCode" show-overflow-tooltip />
          <el-table-column label="门店名称" align="center" prop="storeName" show-overflow-tooltip />
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
          <el-table-column
            label="操作"
            align="center"
            width="120"
            class-name="small-padding fixed-width"
          >
            <!-- v-hasPermi="['system:user:edit']" -->
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改</el-button>
              <!-- v-hasPermi="['system:user:remove']" -->
              <el-button
                v-if="scope.row.userId !== 1"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除</el-button>
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
        <!-- 添加或修改参数配置对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="600px">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="门店编号" prop="storeCode">
                  <el-input v-model="form.storeCode" placeholder="请输入门店编号" :disabled="!form.storeCode" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="门店名称" prop="storeName">
                  <el-input v-model="form.storeName" placeholder="请输入门店名称" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="SFACODE" prop="sfaCode">
                  <el-input v-model="form.sfaCode" placeholder="请输入SFACODE" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="门店地址" prop="storeAddress">
                  <el-input v-model="form.storeAddress" placeholder="请输入门店地址" />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="门店类型" prop="storeType">
                  <el-select v-model="form.storeType" placeholder="请选择">
                    <el-option
                      v-for="item in storeTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="组织架构" prop="orgCode">
                  <treeselect
                    v-model="form.orgCode"
                    :options="organizationOptions"
                    :normalizer="normalizer"
                    placeholder="请选择组织架构"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="状态">
                  <el-radio-group v-model="form.storeStatus">
                    <el-radio
                      v-for="item in storeStatusList"
                      :key="item.value"
                      :label="item.value"
                    >{{item.label}}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="经度" prop="longitude">
                  <el-input v-model="form.longitude" placeholder="请输入经度" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="纬度" prop="latitude">
                  <el-input v-model="form.latitude" placeholder="请输入纬度" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { treeselect } from "@/api/route/organization";
import AMapTemp from "@/views/route/amap/index";
import Treeselect from "@riophae/vue-treeselect";
import { storeList, storeListExport, deleteStores, updateStore, inserStore } from "@/api/route/store";
export default {
  name: "nologinpersons",
  components: {
    AMapTemp,
    Treeselect
  },
  data() {
    var validateFloat = (rule, value, callback) => {
      let pattern = /^(([1-9]\d*)|0)(\.\d*)?$/;
      if (value && !pattern.test(value)) {
        callback(new Error("请输入浮点数"));
      } else {
        callback();
      }
    };
    return {
      // 侧边栏组织架构晒选条件
      organizationName: undefined,

      // 组织架构数据源
      organizationOptions: undefined,

      // 编辑框title
      title: "",

      // 表单参数
      form: {},
      // 表单校验
      rules: {
        storeName: [
          { required: true, message: "参数键名不能为空", trigger: "blur" }
        ],
        longitude: [{ validator: validateFloat, trigger: "blur" }],
        latitude: [{ validator: validateFloat, trigger: "blur" }]
      },

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
      exportLoading: false,

      // 编辑框显示控制
      open: false,

      // 选中数组
      stores: [],

      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true
    };
  },
  computed: {},
  methods: {
    // 表单重置
    reset() {
      this.form = {
        storeCode: undefined,
        storeName: undefined,
        storeAddress: undefined,
        sfaCode: undefined,
        orgCode: undefined,
        storeType: undefined,
        storeStatus: true
      };
      this.resetForm("form");
    },
    // 树形下拉框 value mapping
    normalizer(node) {
      return {
        id: node.orgCode,
        label: node.orgNameCn,
        children: node.children
      };
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
    // 导出 excel
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
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加参数";
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.stores = selection;
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();

      this.form = Object.assign({}, row.storeCode ? row : this.stores[0]);
      this.open = true;
      this.title = "修改参数";
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.storeCode != undefined) {
            updateStore(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            inserStore(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const codes = row.storeCode || this.stores.map(item => item.storeCode).join(",");
      this.$confirm('是否确认删除参数编号为"' + codes + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return deleteStores(codes);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
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