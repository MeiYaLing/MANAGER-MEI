<template>
  <template v-for="menu in userMenu">
    <el-sub-menu
      v-if="
        menu.children &&
        menu.children.length > 0 &&
        menu.children[0].menuType == 1
      "
      :key="menu._id"
      :index="menu.path"
    >
      <template #title>
        <!-- <el-icon :class="menu.icon">
          <setting></setting>
        </el-icon> -->
        <i :class="menu.icon"></i>
        <span>{{ menu.menuName }}</span>
      </template>
      <tree-menu :userMenu="menu.children"></tree-menu>
    </el-sub-menu>
    <el-menu-item v-else :key="menu._id" :index="menu.path">{{
      menu.menuName
    }}</el-menu-item>
  </template>
</template>
<script>
import { Setting } from "@element-plus/icons";

export default {
  name: "TreeMenu",
  components: {
    setting: Setting,
  },
  props: {
    userMenu: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>
