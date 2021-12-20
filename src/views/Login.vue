<template>
  <div class="login-wrapper">
    <div class="modal">
      <el-form :model="user" :rules="rules" status-icon ref="userForm">
        <div class="title">登录页</div>
        <el-form-item prop="userName">
          <el-input
            type="text"
            :prefix-icon="users"
            v-model="user.userName"
          ></el-input>
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input
            type="password"
            :prefix-icon="view"
            v-model="user.userPwd"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-login" @click="login"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { User, View } from "@element-plus/icons";

export default {
  name: "login",
  data() {
    return {
      user: {
        userName: "",
        userPwd: "",
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        userPwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    // gotoHome() {
    //   this.$router.push("/welcome");
    // },
    login() {
      this.$refs.userForm.validate((res) => {
        if (res) {
          //调用登录验证接口
          this.$api.login(this.user).then((res) => {
            console.log(res);
            //存储用户信息
            this.$store.commit("saveUserInfo", res);
            this.$router.push("/welcome");
          });
        }
      });
    },
  },
  computed: {
    users() {
      return User;
    },
    view() {
      return View;
    },
  },
  mounted() {
    // this.$request({
    //   method: "get",
    //   url: "/login",
    //   data: {
    //     name: "jason",
    //   },
    // }).then((res) => {
    //   console.log(res);
    // });
    // this.$request
    //   .get("/login", { name: "Jason" }, { mock: true })
    //   .then((res) => {
    //     console.log(res);
    //   });
    // this.$storage.setItem("user", { name: "张三", age: "18" });
    // console.log(this.$storage.getItem("user"));
    // this.$storage.clearAll();
  },
};
</script>

<style lang="scss">
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f9fcff;
  width: 100vw;
  height: 100vh;
  .modal {
    width: 500px;
    padding: 35px;
    background: #fff;
    box-shadow: 0px 0px 10px 3px #c7c9cb4d;
    .title {
      font-size: 35px;
      line-height: 1.5;
      text-align: center;
    }
    .btn-login {
      width: 100%;
    }
  }
}
</style>
