<template>
  <div>
    {{ title }}
  </div>

  <div class="flex">
    <el-form inline>
      <el-form-item label="用户名称">
        <el-input>placeholder="输入用户名称查询"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="add_user">新增用户</el-button>
      </el-form-item>
    </el-form>
  </div>

  <el-table :data="userList" height="460" style="width: 100%">
    <el-table-column label="序号" type="index" width="240"/>
    <el-table-column label="用户编号" prop="id" width="240"/>
    <el-table-column label="名称" prop="UserName" width="240"/>
    <el-table-column fixed="right" label="功能操作" width="340">
      <template #default="scope">
        <el-button
            link
            size="small"
            type="primary"
            @click="show_user(scope.row)">详细
        </el-button>
        <el-button
            link
            size="small"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)">编辑
        </el-button>
        <el-button
            link
            size="small"
            type="primary"
            @click="delete_user(scope.$index, scope.row)">删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <hr class="my-2"/>
  <div class="demo-pagination-block;" style="padding-left: 580px">
    <el-pagination
        v-model:current-page="currentPage"
        v-model:hide-on-single-page="hide"
        v-model:page-size="pageSize"
        v-model:total="total"
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
  </div>

  <!--  显示用户详情-->
  <el-dialog v-model="dialogVisible" title="用户详细" width="30%">
    <el-descriptions :column="1" border title="用户详细">
      <el-descriptions-item
          align="center"
          class="my-content"
          label="用户ID"
          label-align="right"
          label-class-name="my-label"
          :before-close="closeDialogShow"
          title="用户详情"
          width="150px"
          destroy-on-close
      >{{ user.id }}
      </el-descriptions-item>
      <el-descriptions-item align="center" label="用户名" label-align="right">{{ user.UserName }}</el-descriptions-item>
    </el-descriptions>
    <el-button type="text" @click="$router.back()">返回上一步</el-button>
  </el-dialog>

  <!--  显示用户编辑-->
  <el-dialog title="编辑" v-model="editVisible" width="30%">
    <el-form label-width="70px">
      <el-form-item label="用户ID">
        <el-input v-model="form.id"></el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="form.UserName"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
				<span class="dialog-footer">
					<el-button @click="cancelEdit">取 消</el-button>
					<el-button type="primary" @click="saveEdit">确 定</el-button>
				</span>
    </template>
  </el-dialog>

</template>

<script lang="ts" setup>
import {delUser, getUserList, showUser, updateUser} from "../../services/user.service";
import {reactive, ref} from "vue";
import router from "../../router";
import {ElMessage, ElMessageBox} from "element-plus";
import {User, UserData} from "./data";


const title = ref("用户列表");
const userList = ref<User[]>([]);
const user = ref<User>({
  id: 0,
  UserName: ""
});
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const hide = ref(false);

const dialogVisible = ref(false);

const add_user = () => router.push({name: "UserNew"});

const show_user = async (row: any) => {
  try {
    await showUser(row.id).then((response: any) => {
      user.value = response.data.data;
      openDialogShow();
    });
  } catch (e) {
    console.error(e);
  }
};

const delete_user = async (index: number, row: any) => {
  //TODO: 添加loading状态，避免用户频繁点击删除按钮
  //TODO: 按键文本统一独立成模块变量,再引入使用
  const confirmText = "确实要删除这个用户吗?";
  const confirmTitle = "提示";
  const confirmButton = "确定";
  const cancelButton = "取消";

  try {
    const confirm = await ElMessageBox.confirm(confirmText, confirmTitle, {
      confirmButtonText: confirmButton,
      cancelButtonText: cancelButton
    });

    if (confirm) {
      await delUser(row.id).then(() => {
        userList.value.splice(index, 1);
      });
    }
  } catch (e) {
    ElMessage.error("删除用户失败");
  }
};

const get_users = async () => {
  try {
    const response = await getUserList(currentPage.value, pageSize.value);
    userList.value = response.data.data.rows;
    total.value = response.data.data.total;
  } catch (e) {
    console.error("获取用户列表失败");
  }
};
get_users();

const handleSizeChange = () => get_users();
const handleCurrentChange = () => get_users();

const openDialogShow = () => dialogVisible.value = true;
const closeDialogShow = () => dialogVisible.value = false;

const editVisible = ref(false);

const form = reactive<UserData>({
  id: "",
  UserName: ""
});

const handleEdit = (index: number, row: any) => {
  const {id, UserName} = row;
  form.id = id;
  form.UserName = UserName;
  editVisible.value = true;
};

//TODO: 添加表单验证逻辑，验证用户输入的信息有效
//TODO: 未修改也说是更新成功，显然这里有问题
const saveEdit = () => {
  editVisible.value = false;
  try {
    updateUser(form.id, form.UserName).then(
        () => {
          ElMessage.success("更新用户成功");
          // ElMessage.success(`修改第 ${form.index} 行成功`);
          router.go(0);
        }
    );
  } catch (e) {
    ElMessage.error("更新用户失败");
  }
};

const cancelEdit = () => editVisible.value = false;
</script>

<style scoped>
td {
  border: 3px solid grey;
}

.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>