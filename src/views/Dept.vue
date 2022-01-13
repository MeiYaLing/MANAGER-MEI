<template>
  <div class="dept-manage">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="queryForm">
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            v-model="queryForm.deptName"
            placeholder="请输入部门名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getDeptList">查询</el-button>
          <el-button type="primary" @click="handleReset('queryForm')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </div>
      <el-table
        :data="deptList"
        style="100%"
        row-key="_id"
        :tree-props="{ children: 'children' }"
        stripe
      >
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        ></el-table-column>
        <el-table-column label="操作" width="260">
          <template #default="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row._id)"
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
      v-model="showModal"
      :title="action == 'create' ? '部门创建' : '部门编辑'"
      :before-close="handleCloseDialog"
    >
      <el-form
        :model="deptForm"
        :rules="rules"
        ref="dialogForm"
        label-width="100px"
      >
        <el-form-item label="上级部门" prop="parentId">
          <el-cascader
            v-model="deptForm.parentId"
            placeholder="请选择上级部门"
            :options="deptList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
            :show-all-levels="true"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            v-model="deptForm.deptName"
            placeholder="请输入部门名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="userName">
          <el-select
            placeholder="请选择负责人"
            v-model="deptForm.userName"
            @change="handleUser"
          >
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="`${item.userId}/${item.userName}/${item.userEmail}`"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input
            placeholder="请输入邮箱"
            v-model="deptForm.userEmail"
            disabled
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import utils from "../utils/utils";
export default {
  name: "dept",
  data() {
    return {
      queryForm: {
        deptName: "",
      },
      pager: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
      deptList: [],
      columns: [
        {
          label: "部门名称",
          prop: "deptName",
        },
        {
          label: "负责人",
          prop: "userName",
        },
        {
          label: "更新时间",
          prop: "updateTime",
          formatter(row, column, value) {
            return utils.formatDate(new Date(value));
          },
        },
        {
          label: "创建时间",
          prop: "createTime",
          formatter(row, column, value) {
            return utils.formatDate(new Date(value));
          },
        },
      ],
      showModal: false,
      action: "create",
      deptForm: {
        parentId: [null],
      },
      rules: {
        parentId: [
          {
            required: true,
            message: "请选择上级部门",
            trigger: "blur",
          },
        ],
        deptName: [
          {
            required: true,
            message: "请输入部门名称",
            trigger: "blur",
          },
        ],
        userName: [
          {
            required: true,
            message: "请选择负责人",
            trigger: "blur",
          },
        ],
      },
      userList: [],
    };
  },
  mounted() {
    this.getDeptList();
    this.getAllUserList();
  },
  methods: {
    //查询部门列表
    async getDeptList() {
      let { page, list } = await this.$api.getDeptList({
        ...this.queryForm,
        ...this.pager,
      });
      this.deptList = list;
      this.pager = page;
    },
    //分页
    handleCurrentChange(current) {
      this.pager.pageNum = current;
      this.getDeptList();
    },
    //重置
    handleReset(form) {
      this.$refs[form].resetFields();
    },
    //新增
    handleAdd() {
      this.showModal = true;
      this.action = "create";
    },
    //编辑
    handleEdit(row) {
      this.showModal = true;
      this.action = "edit";
      this.$nextTick(() => {
        Object.assign(this.deptForm, row);
      });
    },
    //删除
    async handleDelete(_id) {
      await this.$api.deptSubmit({ _id, action: "delete" });
      this.$message.success("删除成功");
      this.getDeptList();
    },
    //关闭对话框
    handleCloseDialog() {
      this.showModal = false;
      this.handleReset("dialogForm");
    },
    //对话框中的请取消按钮
    handleClose() {
      this.showModal = false;
      this.handleReset("dialogForm");
    },
    //对话框中的请确认按钮
    handleSubmit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          console.log(this.deptForm);
          let params = { ...this.deptForm, action: this.action };
          //   delete params.userEmail;
          let res = await this.$api.deptSubmit(params);
          if (res) {
            this.$message.success("操作成功");
            this.getDeptList();
            this.handleClose();
          } else {
            this.$message.success("操作失败！");
          }
        }
      });
    },
    //获取负责人信息
    async getAllUserList() {
      let list = await this.$api.userAllList();
      this.userList = list;
    },
    //选择负责人时带出负责人的邮箱信息
    handleUser(info) {
      console.log(info);
      let [userId, userName, userEmail] = info.split("/");
      Object.assign(this.deptForm, { userId, userName, userEmail });
    },
  },
};
</script>
