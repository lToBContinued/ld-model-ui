<template>
  <div class="login-wrapper">
    <Particles id="tsparticles" :particlesInit="particlesInit" :options="particles" />
    <div class="login-form-wrapper">
      <h1 class="title bold">{{ SETTING.SYSTEM_NAME }}</h1>
      <div class="login" style="width: 50%">
        <zk-form
          ref="loginFormRef"
          :form-config="loginFormConfig"
          v-model:form-data="loginFormData"
          :rules="loginFormRules"
          label-width="80"
        ></zk-form>
        <div class="form-btns">
          <zk-button type="primary" style="width: 100%" :loading="loginLoading" @click="userLogin"
            >登&nbsp;录</zk-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { LoginFormData } from '@/views/login/types/index.ts'
import { particles } from './particles.ts'
import { loadSlim } from 'tsparticles-slim'
import { loginFormConfig } from '@/views/login/configs/formConfigs.ts'
import SETTING from '@/setting/index.ts'
import useUserStore from '@/stores/modules/user.ts'
import ZkForm from '@/components/zk-form.vue'
import { useRouter } from 'vue-router'

const { login } = useUserStore()
const router = useRouter()
const loginLoading = ref(false)
const loginFormRef = ref<InstanceType<typeof ZkForm>>()
const loginFormData = reactive<LoginFormData>({
  username: 'admin',
  password: '123456',
})
const loginFormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

// 粒子初始化
const particlesInit = async (engine: any) => {
  await loadSlim(engine)
}
// 登录
const userLogin = async () => {
  try {
    await loginFormRef.value?.ElFormRef?.validate()
    loginLoading.value = true
    await login(loginFormData)
    ElMessage.success('登录成功')
    router.push({ path: '/' })
    loginLoading.value = false
  } catch (e) {
    loginLoading.value = false
    console.log(e)
  }
}
</script>

<style scoped lang="scss">
.login-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
}

#tsparticles {
  position: absolute;
  z-index: -10;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  background-color: #071e5a;
}

.login-form-wrapper {
  @include flex-center(col-center);

  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: 40%;
  height: 400px;

  background-color: rgb(255 255 255 / 10%);
  backdrop-filter: blur(10px);
  border-radius: 32px;

  .login {
    position: absolute;
    top: 150px;
  }

  .title {
    position: absolute;
    top: 60px;
    left: 50%;
    transform: translateX(-50%);

    font-size: $title-size-s;
    color: #fff;
  }

  .form-btns {
    margin-top: $spacing-size5;
  }
}

::v-deep(.el-form) {
  .el-form-item__label {
    font-size: $font-size-m;
    color: #fff;
  }
}
</style>
