<template>
    <div class="login_container">
        <el-row>
            <el-col :span="14" :xs="0"></el-col>
            <el-col :span="10" :xs="24">
                <el-form ref="form" label-width="80px" class="login_form">
                    <h1>Hello</h1>
                    <h2>欢迎来到硅谷甄选</h2>
                    <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
                    <el-input type="password" :prefix-icon="Lock" v-model="loginForm.password" show-password></el-input>
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
import { ElNotification } from 'element-plus'



let loginForm = reactive({
    'username': 'admin',
    'password': 'atguigu123 '
})
const userStore = useUserStore()
let router = useRouter()
// 控制加载状态
let loading = ref(false)
const login = () => {
    loading.value = true
    userStore.userLogin(loginForm).then(resp => {
        // 成功的回调 跳转到首页
        router.push('/')
        console.log(resp);

        ElNotification({
            title: '登录成功',
            message: 'resp.message',
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
        margin-bottom: 20px;
    }

    .el-button {
        display: block;
        width: 100%;
    }
}
</style>