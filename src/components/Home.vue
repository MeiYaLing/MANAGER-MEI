<template>
  <div class="basic-layout">
    <div :class="['nav-side', isCollapse ? 'fold' : 'unfold']">
      <div class="logo">
        <img src="./../assets/logo.png" alt="" />
        <span>Manage</span>
      </div>
      <!-- 菜单部分 -->
      <el-menu
        default-active="2"
        class="nav-menu"
        background-color="#001529"
        text-color="#fff"
        :collapse="isCollapse"
        router
      >
        <tree-menu :userMenu="userMenu"></tree-menu>
        <!-- <el-sub-menu index="1">
          <template #title>
            <el-icon class="el-icon-setting">
              <setting></setting>
            </el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="1-1">用户管理</el-menu-item>
          <el-menu-item index="1-2">菜单管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <el-icon class="el-icon-setting">
              <setting></setting>
            </el-icon>
            <i class="el-icon-setting"></i> 
            <span>审批管理</span>
          </template>
          <el-menu-item index="2-1">休假管理</el-menu-item>
          <el-menu-item index="2-2">待我审批</el-menu-item>
        </el-sub-menu> -->
      </el-menu>
    </div>
    <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
      <div class="nav-top">
        <div class="nav-left">
          <fold class="menu-fold" @click="toggle"></fold>
          <div class="bread">
            <Breadcrumb />
          </div>
        </div>
        <div class="user-info">
          <el-badge :is-dot="noticeCount > 0 ? true : false" class="user-badge">
            <!-- <el-icon class="el-icon-bell"><bell></bell></el-icon> -->
            <i class="el-icon-bell"></i>
          </el-badge>
          <el-dropdown @command="handleLogout">
            <span class="user-link">
              {{ userInfo.userName }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email"
                  >邮箱：{{ userInfo.userEmail }}</el-dropdown-item
                >
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { Setting, Fold, Bell, ArrowDown } from "@element-plus/icons";
import TreeMenu from "./TreeMenu.vue";
import Breadcrumb from "./Breadcrumb.vue";
export default {
  name: "Home",
  components: {
    setting: Setting,
    fold: Fold,
    bell: Bell,
    ArrowDown,
    TreeMenu,
    Breadcrumb,
  },
  data() {
    return {
      userInfo: this.$store.state.userInfo,
      isCollapse: false,
      noticeCount: 0,
      userMenu: [],
    };
  },
  mounted() {
    this.getNoticeCount();
    this.getMenuList();
  },
  methods: {
    handleLogout(key) {
      // console.log(key);
      if (key === "email") {
        return;
      } else {
        this.$store.commit("saveUserInfo", "");
        this.userInfo = null;
        this.$router.push("/login");
      }
    },
    toggle() {
      this.isCollapse = !this.isCollapse;
    },
    async getNoticeCount() {
      const res = await this.$api.noticeCount();
      this.noticeCount = res;
    },
    async getMenuList() {
      const res = await this.$api.menuList();
      this.userMenu = res;
    },
  },
};
</script>

<style lang="scss">
.basic-layout {
  position: relative;
  .nav-side {
    position: fixed;
    width: 200px;
    height: 100vh;
    background-color: #001529;
    color: #fff;
    // overflow-y: auto;
    transition: width 0.5s;
    .logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 50px;
      img {
        margin: 0 15px;
        width: 32px;
        height: 32px;
      }
    }
    .nav-menu {
      .menu-setting {
        width: 20px;
        height: 20px;
        margin-right: 12px;
      }
      border-right: none;
      height: calc(100vh - 50px);
    }
    &.fold {
      width: 64px;
    }
    &.unfold {
      width: 200px;
    }
  }
  .content-right {
    margin-left: 200px;
    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      padding: 0 20px;
      .nav-left {
        display: flex;
        align-items: center;
        .menu-fold {
          width: 25px;
          height: 25px;
          margin-right: 15px;
        }
        z-index: 10;
      }
      .user-info {
        .user-badge {
          line-height: 30px;
          margin-right: 15px;
        }
        .user-link {
          cursor: pointer;
          color: #409fff;
        }
      }
    }
    .wrapper {
      background: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);
      .main-page {
        height: 100%;
        background-color: #fff;
      }
    }
    &.fold {
      margin-left: 64px;
    }
    &.unfold {
      margin-left: 200px;
    }
  }
}
</style>
