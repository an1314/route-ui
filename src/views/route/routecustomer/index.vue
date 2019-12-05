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
      <el-col :span="4" :xs="4" style="min-height: 500px; line-height: 40px">
        <el-col :span="10" :offset="2" v-for="person in personList">
          <el-col :span="3">
            <i class="el-icon-user-solid place"></i>
          </el-col>
          <el-col :offset="1" :span="18">{{ person.name }}</el-col>
        </el-col>
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
        // 日期
        persons: [],
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

      // 人员下拉框源数据
      personSource: [
        {
            code: '1',
            name: 'a'
        },
        {
            code: '2',
            name: 'b'
        },
        {
            code: '3',
            name: 'd'
        },
        {
            code: '4',
            name: 'e'
        }
      ],

      // 地图加载控制
      mapLoading: undefined,

      // 人员下拉框加载控制
      personSelectloading: false
    };
  },
  computed: {
      // 转换人员数据源为下拉框可用格式 index 0 为下拉框键值， index 1 为对象键值 
      personData(){
        let mapping = [
            ['value', 'code'],
            ['label', 'name']
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
        if (query !== '') {
            this.loading = true;
            setTimeout(() => {
            this.loading = false;
            this.options = this.list.filter(item => {
                return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
            }, 200);
        } else {
            this.options = [];
        }
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
</style>