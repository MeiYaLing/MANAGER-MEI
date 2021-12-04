<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form :inline="true" :model="user" ref="form">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="user.userId" placeholder="请输入用户ID"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="user.userName"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="user.state">
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary">新增</el-button>
        <el-button type="danger" @click="handlePatchDelete">批量删除</el-button>
      </div>
      <el-table
        :data="userList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" size="mini">编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="pager.total"
        class="pagination"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { onMounted, reactive, getCurrentInstance, ref } from "vue";
export default {
  name: "User",
  setup() {
    //获取全局对象，类似于options api里面的this
    const { proxy } = getCurrentInstance();

    //生命周期函数
    onMounted(() => {
      console.log("init...");
      getUserList();
    });

    //查询数据的条件
    const user = reactive({
      state: 0,
    });

    //解決报错:User.vue:102 Uncaught (in promise) TypeError: Assignment to constant variable.
    /**方式1：
     * const userList = reactive({
         arr: [],
       });
       userList.arr = list;
     */
    /**
     * 方式2：
     * const userList = ref([]);
     * userList.value = list;
     */
    //用户列表
    const userList = ref([]);

    //表格的抬头
    const columns = reactive([
      {
        label: "用户ID",
        prop: "userId",
      },
      {
        label: "用户名",
        prop: "userName",
      },
      {
        label: "用户邮箱",
        prop: "userEmail",
      },
      {
        label: "用户角色",
        prop: "role",
        formatter(row, column, value) {
          return {
            0: "管理员",
            1: "普通用户",
          }[value];
        },
      },
      {
        label: "用户状态",
        prop: "state",
        formatter(row, column, value) {
          return {
            1: "在职",
            2: "离职",
            3: "试用期",
          }[value];
        },
      },
      {
        label: "注册时间",
        prop: "createTime",
      },
      {
        label: "最后登录时间",
        prop: "lastLoginTime",
      },
    ]);

    //分页信息的配置
    const pager = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 10,
    });

    //获取用户列表
    const getUserList = async () => {
      let params = { ...user, ...pager };
      console.log(params);
      const { page, list } = await proxy.$api.userList(params);
      pager.total = page.total;
      userList.value = list;
    };
    //查询按钮
    const handleQuery = () => {
      getUserList();
    };
    //重置按钮
    const handleReset = () => {
      proxy.$refs.form.resetFields();
    };
    //分页点击
    const handleCurrentChange = (current) => {
      pager.pageNum = current;
      getUserList();
    };
    //用户单个删除
    const handleDelete = async (row) => {
      const res = await proxy.$api.userDelete({
        userIds: [row.userId],
      });
      if (res.nModified > 0) {
        proxy.$message.success("删除成功！");
        getUserList();
      } else {
        proxy.$message.error("删除失败！");
      }
    };
    //用户批量删除
    const checkUsersId = ref([]);
    const handlePatchDelete = async () => {
      if (checkUsersId.value.length == 0) {
        proxy.$message.error("请选择要删除的用户！");
        return;
      }
      const res = await proxy.$api.userDelete({
        userIds: checkUsersId.value,
      });
      if (res.nModified > 0) {
        proxy.$message.success("删除成功！");
        getUserList();
      } else {
        proxy.$message.error("删除失败！");
      }
    };
    const handleSelectionChange = (list) => {
      let arr = [];
      list.forEach((ele) => {
        arr.push(ele.userId);
      });
      checkUsersId.value = arr;
    };

    return {
      user,
      userList,
      columns,
      handleQuery,
      handleReset,
      pager,
      handleCurrentChange,
      handleDelete,
      handlePatchDelete,
      checkUsersId,
      handleSelectionChange,
    };
  },
};
</script>

<style lang="scss">
</style>
