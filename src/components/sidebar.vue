<template>
  <div class="sidebar">
    <el-menu
        class="sidebar-el-menu"
        :default-active="onRoutes"
        :collapse="sidebar.collapse"
        background-color="#324157"
        text-color="#bfcbd9"
        active-text-color="#20a0ff"
        unique-opened
        router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-sub-menu :index="item.index" :key="item.index" v-permiss="item.permiss">
            <template #title>
              <el-icon>
                <component :is="item.icon"></component>
              </el-icon>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-sub-menu
                  v-if="subItem.subs"
                  :index="subItem.index"
                  :key="subItem.index"
                  v-permiss="item.permiss"
              >
                <template #title>{{ subItem.title }}</template>
                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">
                  {{ threeItem.title }}
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item v-else :index="subItem.index" v-permiss="item.permiss">
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index" v-permiss="item.permiss">
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {useSidebarStore} from "../store/sidebar";
import {useRoute} from "vue-router";

const items = [
  {
    icon: "Odometer",
    index: "/dashboard",
    title: "系统概览",
    permiss: "1"
  },
  {
    icon: "Calendar",
    index: "1",
    title: "主机管理",
    permiss: "2",
    subs: [
      {
        index: "/table",
        title: "主机列表",
        permiss: "2"
      },
      {
        index: "/import",
        title: "主机监控",
        permiss: "2"
      },
      {
        index: "/export",
        title: "告警信息",
        permiss: "2"
      }
    ]
  },
  {
    icon: "DocumentCopy",
    index: "/tabs",
    title: "容器管理",
    permiss: "3"
  },
  {
    icon: "Edit",
    index: "3",
    title: "中间件",
    permiss: "4",
    subs: [
      {
        index: "/form",
        title: "消息队列",
        permiss: "5"
      },
      {
        index: "/upload",
        title: "缓存系统",
        permiss: "6"
      },
      {
        index: "4",
        title: "数据库",
        permiss: "7",
        subs: [
          {
            index: "/editor",
            title: "关系数据库",
            permiss: "8"
          },
          {
            index: "/markdown",
            title: "NoSQL数据库",
            permiss: "9"
          }
        ]
      }
    ]
  },
  {
    icon: "Setting",
    index: "/icon",
    title: "应用管理",
    permiss: "10"
  },
  {
    icon: "PieChart",
    index: "/charts",
    title: "计划任务",
    permiss: "11"
  },
  {
    icon: "Warning",
    index: "5",
    title: "权限管理",
    permiss: "13",
    subs: [
      {
        index: "/permission",

        title: "用户列表",
        permiss: "13"
      },
      {
        index: "/permission-page",
        title: "角色列表",
        permiss: "13"
      },
      {
        index: "/permission2",
        title: "权限管理",
        permiss: "13"
      }
    ]
  },
  {
    icon: "CoffeeCup",
    index: "/donate",
    title: "设置",
    permiss: "14"
  }
];

const route = useRoute();
const onRoutes = computed(() => {
  return route.path;
});

const sidebar = useSidebarStore();
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}

.sidebar > ul {
  height: 100%;
}
</style>
