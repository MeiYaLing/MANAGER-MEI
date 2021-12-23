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
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate">新增</el-button>
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
            <el-button type="primary" size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
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
    <el-dialog
      :title="action == 'add' ? '用户新增' : '用户编辑'"
      v-model="showModal"
      :before-close="handleCloseDialog"
    >
      <el-form
        :model="userForm"
        ref="dialogForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item prop="userName" label="用户名">
          <el-input
            placeholder="请输入用户名"
            v-model="userForm.userName"
            :disabled="action === 'edit'"
          />
        </el-form-item>
        <el-form-item prop="userEmail" label="邮箱">
          <el-input
            placeholder="请输入邮箱"
            v-model="userForm.userEmail"
            :disabled="action === 'edit'"
          >
            <template #append>@jason.com</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机号">
          <el-input placeholder="请输入手机号" v-model="userForm.mobile" />
        </el-form-item>
        <el-form-item prop="job" label="岗位">
          <el-input placeholder="请输入岗位" v-model="userForm.job" />
        </el-form-item>
        <el-form-item prop="state" label="状态">
          <el-select v-model="userForm.state">
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="roleList" label="系统角色">
          <el-select
            v-model="userForm.roleList"
            placeholder="请选择用户系统角色"
            multiple
            style="width: 100%"
          >
            <el-option
              v-for="role in roleList"
              :key="role._id"
              :value="role._id"
              :label="role.roleName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="deptId" label="部门">
          <el-cascader
            v-model="userForm.deptId"
            placeholder="请选择部门"
            :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { onMounted, reactive, getCurrentInstance, ref, toRaw } from "vue";
import utils from "../utils/utils";
export default {
  name: "User",
  setup() {
    //获取全局对象，类似于options api里面的this
    const { proxy } = getCurrentInstance();

    //生命周期函数
    onMounted(() => {
      console.log("init...");
      getUserList();
      getRoleList();
      getDeptList();
    });

    //查询数据的条件(默认展示在职状态的)
    const user = reactive({
      state: 1,
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
        formatter(row, column, value) {
          return utils.formatDate(new Date(value));
        },
      },
      {
        label: "最后登录时间",
        prop: "lastLoginTime",
        formatter(row, column, value) {
          return utils.formatDate(new Date(value));
        },
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
    const handleReset = (form) => {
      proxy.$refs[form].resetFields();
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
      if (res.modifiedCount > 0) {
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
      if (res.modifiedCount > 0) {
        proxy.$message.success("删除成功！");
        getUserList();
      } else {
        proxy.$message.error("删除失败！");
      }
    };
    //多选框事件处理
    const handleSelectionChange = (list) => {
      let arr = [];
      list.forEach((ele) => {
        arr.push(ele.userId);
      });
      checkUsersId.value = arr;
    };

    //新增用户功能控制
    const showModal = ref(false);

    //用户新增按钮
    const handleCreate = () => {
      showModal.value = true;
      action.value = "add";
    };

    //用户新增对象
    const userForm = reactive({
      state: 1,
    });

    //新增用户的规则
    const rules = reactive({
      userName: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur",
        },
      ],
      userEmail: [
        {
          required: true,
          message: "请输入用户邮箱",
          trigger: "blur",
        },
      ],
      deptId: [
        {
          required: true,
          message: "请选择部门",
          trigger: "blur",
        },
      ],
      mobile: [
        {
          pattern: /1[3-9]\d{9}/,
          message: "请输入正确的手机格式",
          trigger: "blur",
        },
      ],
    });

    //获取角色列表
    const roleList = ref([]);
    const getRoleList = async () => {
      const res = await proxy.$api.getRoleList();
      roleList.value = res;
    };

    //获取部门列表
    const deptList = ref([]);
    const getDeptList = async () => {
      const { list } = await proxy.$api.getDeptList();
      deptList.value = list;
    };

    //新增用户弹框中的取消按钮
    const handleClose = () => {
      showModal.value = false;
      handleReset("dialogForm");
    };

    //新增用户弹框中的确认按钮
    const action = ref("add");
    const handleSubmit = () => {
      proxy.$refs.dialogForm.validate(async (vaild) => {
        if (vaild) {
          let params = toRaw(userForm);
          console.log(params);
          params.userEmail += "@jason.com";
          params.action = action.value;
          let res = await proxy.$api.userSubmit(params);
          if (res) {
            showModal.value = false;
            if (action.value === "add") {
              proxy.$message.success("新增用户成功！");
            } else {
              proxy.$message.success("编辑用户成功！");
            }
            handleReset("dialogForm");
            getUserList();
          }
        }
      });
    };

    //编辑用户
    const handleEdit = (row) => {
      action.value = "edit";
      showModal.value = true;
      //把查询到的状态转成数值
      row.state = Number(row.state);
      proxy.$nextTick(() => {
        Object.assign(userForm, row);
      });
    };

    const handleCloseDialog = () => {
      handleReset("dialogForm");
      showModal.value = false;
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
      showModal,
      handleCreate,
      userForm,
      rules,
      getRoleList,
      roleList,
      deptList,
      getDeptList,
      handleClose,
      handleSubmit,
      handleEdit,
      action,
      handleCloseDialog,
    };
  },
};
</script>

<style lang="scss">
</style>
