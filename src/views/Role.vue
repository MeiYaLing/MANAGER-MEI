<template>
  <div class="role-manage">
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="form">
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="queryForm.roleName"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd" v-has="'role-create'"
          >新增</el-button
        >
      </div>
      <el-table :data="roleList" style="width: 100%" row-key="_id">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="260">
          <template #default="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)"
              v-has="'role-edit'"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="primary"
              @click="handlePermisson(scope.row)"
              v-has="'role-set-permission'"
              >设置权限</el-button
            >
            <el-button
              type="danger"
              size="mini"
              @click="handleDelete(scope.row)"
              v-has="'role-delete'"
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
      :title="action == 'create' ? '角色新增' : '角色编辑'"
      v-model="showModal"
      :before-close="handleCloseDialog"
    >
      <el-form
        :model="roleForm"
        ref="dialogForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item prop="roleName" label="角色名称">
          <el-input placeholder="请输入角色名称" v-model="roleForm.roleName" />
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-input
            type="textarea"
            placeholder="请输入备注"
            v-model="roleForm.remark"
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
    <el-dialog
      title="设置权限"
      v-model="showPermission"
      :before-close="handlePermissionCloseDialog"
    >
      <el-form label-width="100px">
        <el-form-item prop="curRoleName" label="角色名称">
          {{ curRoleName }}
        </el-form-item>
        <el-form-item prop="curMenuList" label="菜单列表">
          <!-- 树形选择框 -->
          <el-tree
            :data="menuList"
            show-checkbox
            node-key="_id"
            :props="{ label: 'menuName' }"
            default-expand-all
            ref="permissionTree"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handlePermissionClose">取消</el-button>
          <el-button type="primary" @click="handlePermissionSubmit"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import utils from "../utils/utils";
export default {
  name: "Menu",
  data() {
    return {
      queryForm: {
        roleName: "",
      },
      roleList: [],
      columns: [
        {
          label: "角色名称",
          prop: "roleName",
        },
        {
          label: "备注",
          prop: "remark",
        },
        {
          label: "权限列表",
          prop: "permissionList",
          formatter: (row, column, value) => {
            let names = [];
            let list = value.halfCheckedKeys || [];
            list.map((key) => {
              //去掉没有按钮的key
              // console.log(this);
              let actionMap = this.actionMap || {};
              // console.log(actionMap);//?????this.actionMap会获取不到
              if (actionMap[key]) {
                //小心this指向会丢失，需要使用箭头函数
                names.push(actionMap[key]);
              }
            });
            return names.join(",");
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
      pager: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
      showModal: false,
      action: "create",
      roleForm: {},
      rules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur",
          },
        ],
      },
      showPermission: false,
      curRoleName: "",
      curRoleId: "",
      menuList: [],
      item: {},
    };
  },
  mounted() {
    this.getRoleList();
    this.getMenuList();
  },
  methods: {
    //获取角色列表
    async getRoleList() {
      const { list, page } = await this.$api.roleList({
        ...this.queryForm,
        ...this.pager,
      });
      this.roleList = list;
      this.pager = page;
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
        Object.assign(this.roleForm, row);
      });
    },
    //删除
    async handleDelete(row) {
      await this.$api.roleSubmit({ _id: row._id, action: "delete" });
      this.$message.success("删除成功");
      this.getRoleList();
    },
    //查询
    handleQuery() {
      this.getRoleList();
    },
    //重置
    handleReset(form) {
      //对指定表单进行重置
      this.$refs[form].resetFields();
    },
    //新增对话框右上角的小叉
    handleCloseDialog() {
      //重置新增对话框
      this.handleReset("dialogForm");
      //隐藏新增对话框
      this.showModal = false;
    },
    //新增对话框中的取消
    handleClose() {
      //重置新增对话框
      this.handleReset("dialogForm");
      //隐藏新增对话框
      this.showModal = false;
    },
    //新增对话框中的确认
    handleSubmit() {
      this.$refs.dialogForm.validate(async (vaild) => {
        if (vaild) {
          //提交接口
          let { action, roleForm } = this;
          let params = { ...roleForm, action };
          await this.$api.roleSubmit(params);
          this.showModal = false;
          this.handleReset("dialogForm");
          let msg = action == "create" ? "新增成功" : "编辑成功";
          this.$message.success(msg);
          this.getRoleList();
        }
      });
    },
    //设置权限对话框的右上角小叉
    handlePermissionCloseDialog() {
      this.showPermission = false;
    },
    //设置权限对话框的取消按钮
    handlePermissionClose() {
      this.showPermission = false;
    },
    //设置权限对话框的确认按钮
    async handlePermissionSubmit() {
      //获取全选菜单
      let nodes = this.$refs.permissionTree.getCheckedNodes();
      //获取半选菜单
      let halfKeys = this.$refs.permissionTree.getHalfCheckedKeys();
      let checkedKeys = [];
      let parentKeys = [];
      nodes.map((node) => {
        if (!node.children) {
          //按钮
          checkedKeys.push(node._id);
        } else {
          //菜单
          parentKeys.push(node._id);
        }
      });

      let params = {
        _id: this.curRoleId,
        permissionList: {
          checkedKeys,
          halfCheckedKeys: parentKeys.concat(halfKeys),
        },
      };
      await this.$api.updatePermission(params);
      this.showPermission = false;
      this.$message.success("设置成功");
      this.getRoleList();
    },
    //点击设置权限按钮
    handlePermisson(row) {
      this.showPermission = true;
      this.curRoleName = row.roleName;
      this.curRoleId = row._id;
      //获取选中的值
      const { checkedKeys } = row.permissionList;
      this.$nextTick(() => {
        //设置树选框被选中的数据
        this.$refs.permissionTree.setCheckedKeys(checkedKeys);
      });
    },
    //获取菜单列表
    async getMenuList() {
      let list = await this.$api.menuList();
      this.menuList = list;
      //获取权限列表的数据
      this.getActionMap(list);
    },
    getActionMap(list) {
      let actionMap = {};
      //递归：一层一层获取按钮的父亲菜单（有children和action）
      const deep = (arr) => {
        while (arr.length) {
          let item = arr.pop();
          if (item.children && item.action) {
            //有按钮子数据
            actionMap[item._id] = item.menuName;
          }
          if (item.children && !item.action) {
            //没有按钮
            deep(item.children);
          }
        }
      };
      //开始递归
      //需要深拷贝，防止修改menuList的值
      deep(JSON.parse(JSON.stringify(list)));
      this.actionMap = actionMap;
    },
    //翻页
    handleCurrentChange(current) {
      this.pager.pageNum = current;
      this.getRoleList();
    },
  },
};
</script>

<style lang="scss">
</style>
