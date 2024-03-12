<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">运维后台管理系统</div>
      <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="username">
            <template #prepend>
              <el-button :icon="User"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              type="password"
              placeholder="password"
              v-model="param.password"
              @keyup.enter="submitForm(login)"
          >
            <template #prepend>
              <el-button :icon="Lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm(login)">登录</el-button>
        </div>
        <el-checkbox class="login-tips" v-model="checked" label="记住密码" size="large"/>
        <p class="login-tips">Tips : 用户名和密码随便填。</p>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {useTagsStore} from "../store/tags";
import {usePermissStore} from "../store/permiss";
import {useRouter} from "vue-router";
import type {FormInstance, FormRules} from "element-plus";
import {ElMessage} from "element-plus";
import {Lock, User} from "@element-plus/icons-vue";
import { loginByUserName }  from "../services/auth.service";

interface LoginInfo {
  username: string;
  password: string;
}

const lgStr = localStorage.getItem("login-param");
const defParam = lgStr ? JSON.parse(lgStr) : null;
const checked = ref(lgStr ? true : false);

const router = useRouter();
const param = reactive<LoginInfo>({
  username: defParam ? defParam.username : "",
  password: defParam ? defParam.password : ""
});

const rules: FormRules = {
  username: [
    {
      required: true,
      message: "请输入用户名",
      trigger: "blur"
    }
  ],
  password: [{required: true, message: "请输入密码", trigger: "blur"}]
};
const permiss = usePermissStore();
const login = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid: boolean) => {
    console.log(valid);
    if (valid) {
      // localStorage.setItem("login-param", JSON.stringify(param));
      // 登录成功后，设置token
      // 这里应该向后端发起请求，验证用户名和密码是否正确
      // 如果正确，则返回一个token，并将其存储在localStorage中
      // 如果错误，则提示用户登录失败
      // 这里只是一个示例，实际应用中需要与后端进行交互
      loginByUserName(param.username, param.password).then(res => {
        console.log("haha");
        console.log(res.data.data);
        console.log("haha");
            console.log("success11");
            ElMessage.success("登录成功");
            localStorage.setItem("ms_username", param.username);
            const keys = permiss.defaultList[param.username == "admin" ? "admin" : "user"];
            permiss.handleSet(keys);
            localStorage.setItem("ms_keys", JSON.stringify(keys));
            router.push("/");
            if (checked.value) {
              localStorage.setItem("login-param", JSON.stringify(param));
            } else {
              localStorage.removeItem("login-param");
            }

          })
          .catch(() => {
                ElMessage.error("用户名或密码错误");
            console.log("failed1");
              }
          );


    } else {
      ElMessage.error("登录失败");
      console.log("failed2");
      return false;
    }
  });
};

const tags = useTagsStore();
tags.clearTags();
</script>

<style scoped>
.login-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-image: url(../assets/img/login-bg.jpg);
  background-size: 100%;
}

.ms-title {
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #333;
  font-weight: bold;
  padding-top: 10px;
}

.ms-login {
  width: 350px;
  border-radius: 5px;
  background: #fff;
}

.ms-content {
  padding: 10px 30px 30px;
}

.login-btn {
  text-align: center;
}

.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}

.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #333;
}
</style>
