<template>
    <div class="login_container">
        <el-row>
            <el-col :span="14" :xs="0"></el-col>
            <el-col :span="10" :xs="24">
                <el-form ref="loginFormRef" class="login_form" :model="loginForm" :rules="rules">
                    <h1>Hello</h1>
                    <h2>欢迎来到硅谷甄选</h2>
                    <el-form-item prop="username">
                        <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" :prefix-icon="Lock" v-model="loginForm.password" show-password></el-input>
                    </el-form-item>
                    <el-button :loading="loading" type="primary" size="default" @click="login">登录</el-button>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import useUserStore from '@/store/modules/user'
import { useRouter } from 'vue-router'
import { ElNotification, FormRules } from 'element-plus'
import { getTime } from '@/utils/time'



let loginForm = reactive({
    'username': 'admin',
    'password': 'atguigu123'
})
// 表单验证规则
const rules = reactive<FormRules>({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 4, max: 10, message: '用户名在4-10位之间', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度至少六位', trigger: 'blur' }
    ]
})
// 表单验证
let loginFormRef = ref()
const userStore = useUserStore()
let router = useRouter()
// 控制加载状态
let loading = ref(false)
// 控制显示信息
let message = getTime()
const login = async () => {
    await loginFormRef.value.validate()
    loading.value = true
    userStore.userLogin(loginForm).then(resp => {
        // 成功的回调 跳转到首页
        router.push('/')

        ElNotification({
            title: `Hi,${message}`,
            message: '欢迎回来',
            type: 'success',
            duration: 3000,
        })
        loading.value = false
    }, err => {
        loading.value = false

        console.log(err);
        // 失败的回调
        ElNotification({
            title: 'Error',
            message: err.data,
            type: 'error',
            duration: 3000,
        })
    });

}

</script>

<style scoped lang="scss">
.login_container {
    width: 100%;
    height: 100vh;
    background: url('@/assets/images/background.jpg') no-repeat;
    background-size: cover;
}

.login_form {
    position: relative;
    width: 70%;
    top: 30vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;

    h1 {
        font-size: 40px;
        color: #fff;
    }

    h2 {
        font-size: 20px;
        color: #fff;
        margin: 20px 0;
    }

    .el-input {
        max-width: 500px;
    }

    .el-button {
        display: block;
        width: 100%;
    }
}
</style>