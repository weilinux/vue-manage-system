<template>
  <div>
    <div style="margin-top: 5px; margin-bottom: 10px;text-align: center">
      {{ title }}
    </div>

    <div class="flex">
      <el-form inline>
        <el-form-item label="主机名称">
          <el-input v-model="hostName" clearable="clearable" placeholder="输入主机名称查询"
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


    <el-table :data="hostList" height="460" style="width: 100%;">
      <el-table-column label="序号" type="index" width="80"/>
      <el-table-column label="编号" prop="id" width="80"/>
      <el-table-column label="主机名" prop="HostName" width="180"/>
      <el-table-column label="主机地址" prop="HostIP" width="180"/>
      <el-table-column label="主机端口" prop="HostPort" width="180"/>
      <el-table-column fixed="right" label="功能操作" width="350">
        <template #default="scope">
          <el-button
              link
              size="small"
              type="primary"
              @click="ssh_host(scope.row)">SSH
          </el-button>
          <el-button
              link
              size="small"
              type="primary"
              @click="ftp_host(scope.$index, scope.row)">FTP
          </el-button>
          <el-button
              link
              size="small"
              type="primary"
              @click="show_host(scope.row)">详细
          </el-button>
          <el-button
              icon="Edit"
              link
              size="small"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
              :loading="scope.row.loading"
              icon="Delete"
              link
              size="small"
              type="primary"
              @click="delete_host(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <hr class="my-2"/>
    <div class="demo-pagination-block;" style="padding-left: 580px">
      <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          v-model:total="total"
          class="pagination"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange(hostName)"
          @current-change="handleCurrentChange(hostName)"/>
    </div>


    <!--  显示主机详情-->
    <el-dialog v-model="dialogVisible" title="主机详细" width="30%">
      <el-descriptions :column="1" border title="主机详细">
        <el-descriptions-item
            :before-close="closeDialogShow"
            align="left"
            class="cell-item"
            label="主机ID"
            label-align="left"
            label-class-name="my-label"
            title="主机详情"
            width="20px">{{ host.id }}
        </el-descriptions-item>
        <el-descriptions-item align="left" label="主机名" label-align="left">{{ host.HostName }}</el-descriptions-item>
        <el-descriptions-item align="left" label="主机地址" label-align="left">{{ host.HostIP }}</el-descriptions-item>
        <el-descriptions-item align="left" label="主机端口" label-align="left">{{
            host.HostPort
          }}
        </el-descriptions-item>
      </el-descriptions>
      <el-button type="text" @click="$router.back()">返回上一步</el-button>
    </el-dialog>

    <!--  显示主机编辑-->
    <el-dialog v-model="editVisible" title="编辑" width="30%">
      <el-form label-width="70px">
        <el-form-item label="主机编号">
          <el-input v-model=form.id />
        </el-form-item>
        <el-form-item label="主机名">
          <el-input v-model=form.HostName />
        </el-form-item>
        <el-form-item label="主机IP">
          <el-input v-model=form.HostIP />
        </el-form-item>
        <el-form-item label="主机端口">
          <el-input v-model=form.HostPort />
        </el-form-item>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="cancelEdit">取 消</el-button>
					<el-button type="primary" @click="saveEdit">确 定</el-button>
        </span>
      </template>
    </el-dialog>


  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from "vue";
import {delUserHost, getHost, getUserHosts, searchHosts, updateHost} from "./service";
import {Host, HostData } from "./data";
import {ElMessage, ElMessageBox} from "element-plus";
import router from "../../router";


const title = ref("主机列表");
const hostList = ref<Host[]>([]);

const host = ref<Host>({HostIP: "", HostName: "", HostPort: 0, id: 0});
const hostName = ref("");


const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const hide = ref(false);
const inSearchStatus = ref(false);

const dialogVisible = ref(false);
// const add_host = () => route.push({name: "HostNew"});

const show_host = async (row: any) => {
  try {
    await getHost(row.id).then((response: any) => {
      host.value = response.data.data;
      openDialogShow();
    });
  } catch (e) {
    console.error(e);
  }
};


const get_user_hosts = async () => {
  try {
    const response = await getUserHosts(currentPage.value, pageSize.value);
    hostList.value = response.data.data.rows;
    total.value = response.data.data.total;
    console.log(hostList.value);
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

const openDialogShow = () => dialogVisible.value = true;
const closeDialogShow = () => dialogVisible.value = false;


// edit host
const editVisible = ref(false);

const form = reactive<HostData>({
  id: 0,
  HostName: "",
  HostIP: "",
  HostPort: 0
});

const handleEdit = (index: number, row: any) => {
  const {id, HostName, HostIP, HostPort} = row;
  form.id = id;
  form.HostName = HostName;
  form.HostIP = HostIP;
  form.HostPort = HostPort;
  editVisible.value = true;
};


// add host

const delete_host = async (index: number, row: any) => {
  //TODO: 按键文本统一独立成模块变量,再引入使用
  const confirmText = "确实要删除这个主机吗?";
  const confirmTitle = "提示";
  const confirmButton = "确定";
  const cancelButton = "取消";

  row.loading = true;

  const confirm = await ElMessageBox.confirm(confirmText, confirmTitle, {
    confirmButtonText: confirmButton,
    cancelButtonText: cancelButton
  }).catch(() => {
  });

  try {
    if (confirm) {
      await delUserHost(row.id).then(() => {
        console.log("doing");
        hostList.value.splice(index, 1);
      });
    }
  } catch (e) {
    ElMessage.error("删除主机失败!");
  } finally {
    row.loading = false;
  }
};

//TODO: 添加表单验证逻辑，验证用户输入的信息有效
//TODO: 未修改也说是更新成功，显然这里有问题
const saveEdit = () =>  {
  editVisible.value = false;
  try {
    updateHost(form).then(
        () => {
      ElMessage.success("修改主机信息成功!");
      router.go(0)
    });
  } catch (e) {
    ElMessage.error("修改主机信息失败!");
  }
}

const cancelEdit = () => editVisible.value = false;
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