<template>
  <div>
    <div style="margin-top: 40px;">
      {{ title }}
    </div>

    <div class="flex">
      <el-form :model="searchForm" inline>
        <el-form-item label="主机名称">
          <el-input v-model="hostName" placeholder="输入主机名称查询" clearable="clearable"
                    @clear="handleSearchCancel"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleFilter">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="add_host">新增主机</el-button>
        </el-form-item>
      </el-form>
    </div>


    <el-table :data="hostList" style="width: 100%;" height="460">
      <el-table-column type="index" label="序号" width="80"/>
      <el-table-column prop="ID" label="编号" width="80"/>
      <el-table-column prop="HostName" label="主机名" width="180"/>
      <el-table-column prop="HostIP" label="主机地址" width="180"/>
      <el-table-column prop="HostPort" label="主机端口" width="180"/>
      <el-table-column fixed="right" label="功能操作" width="350">
        <template #default="scope">
          <el-button
              link
              type="primary"
              size="small"
              @click="ssh_host(scope.row)">SSH
          </el-button>
          <el-button
              link
              type="primary"
              size="small"
              @click="show_host(scope.$index, scope.row)">FTP
          </el-button>
          <el-button
              link
              type="primary"
              size="small"
              @click="show_host(scope.$index, scope.row)">详细
          </el-button>
          <el-button
              link
              type="primary"
              icon="Edit"
              size="small"
              @click="edit_host(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
              link
              type="primary"
              icon="Delete"
              size="small"
              @click="delete_host(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <hr class="my-2"/>
    <div class="demo-pagination-block;" style="padding-left: 580px">
      <el-pagination
          class="pagination"
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          v-model:total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange(hostName)"
          @current-change="handleCurrentChange(hostName)"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {getUserHosts, searchHosts} from "./service";
import {Host} from "./data";


const title = ref("主机列表");
const hostList = ref<Host[]>([]);

const hostObj = ref<host>({});
const hostName = ref("");


const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const hide = ref(false);
const inSearchStatus = ref(false);


const add_host = () => route.push({name: "HostNew"});


const get_user_hosts = async () => {
  try {
    const response = await getUserHosts(currentPage.value, pageSize.value);
    hostList.value = response.data.data.rows;
    total.value = response.data.data.total;
  } catch (e) {
    console.error("获取主机列表失败！");
  }
};
get_user_hosts();

const handleFilter = async () => {
  if (currentPage.value !== 1 && !inSearchStatus.value) {
    currentPage.value = 1;
  }
  try {
    const response = await searchHosts(hostName.value, currentPage.value, pageSize.value);
    hostList.value = response.data.data.rows;
    total.value = response.data.data.total;
  } catch (e) {
    console.error("过滤主机列表失败！");
  }
  inSearchStatus.value = true;
};

const handleSearchCancel = () => {
  inSearchStatus.value = false;
  currentPage.value = 1;
  get_user_hosts();
};

const handleSizeChange = (hostName: string) => hostName ? handleFilter() : get_user_hosts();
const handleCurrentChange = (hostName: string) => hostName ? handleFilter() : get_user_hosts();

</script>

<style scoped>
td {
  border: 3px solid grey;
}

.demo-pagination-block + {
  margin-top: 10px;
}

.demo-pagination-block .pagination {
  margin-bottom: 16px;
}

.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>