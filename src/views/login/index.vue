<template>
    <div class="login-container flx-center">
        <div class="login-box">
            <div class="login-left">
                <img src="@/assets/images/login_left0.png" alt="login" />
            </div>
            <div class="login-form">
                <div class="login-logo">
                    <img class="login-icon" src="../../../public/huawei_logo.png" alt="" />
                    <h2 class="logo-text">灵犀后台</h2>
                </div>
                <el-form ref="loginFormRef" :model="loginForm" :rules="rules" size="large">
                    <el-form-item prop="username">
                        <el-input v-model="loginForm.username">
                            <template #prefix>
                                <el-icon class="el-input__icon">
                                    <user />
                                </el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" v-model="loginForm.password" show-password autocomplete="new-password">
                            <template #prefix>
                                <el-icon class="el-input__icon">
                                    <lock />
                                </el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-form>
                <div class="login-btn">
                    <el-button round @click="login" size="large" type="primary" :loading="loading">
                        登录
                    </el-button>
                    <el-button round @click="resetForm(loginFormRef)" size="large">重置</el-button>
                </div>
            </div>
        </div>
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
    userStore.userLogin(loginForm).then(_resp => {
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
const resetForm = (formEl: any) => {
    if (!formEl) return;
    formEl.resetFields();
};

</script>

<style scoped lang="scss">
// .login_container {
//     width: 100%;
//     height: 100vh;
//     background: url('@/assets/images/background.jpg') no-repeat;
//     background-size: cover;
// }

// .login_form {
//     position: relative;
//     width: 70%;
//     top: 30vh;
//     background: url('@/assets/images/login_form.png') no-repeat;
//     background-size: cover;
//     padding: 40px;

//     h1 {
//         font-size: 40px;
//         color: #fff;
//     }

//     h2 {
//         font-size: 20px;
//         color: #fff;
//         margin: 20px 0;
//     }

//     .el-input {
//         max-width: 500px;
//     }

//     .el-button {
//         display: block;
//         width: 100%;
//     }
// }

.login-container {
    position: relative;
    min-width: 550px;
    height: 100%;
    width: 100%;
    min-height: 500px;
    background-color: #eeeeee;
    background-image: url("@/assets/images/login_bg.svg");
    background-position: 50%;
    background-size: 100% 100%;
    background-size: cover;

    .login-box {
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 70%;
        height: 70%;
        padding: 0 50px;
        background-color: hsl(0deg 0% 100% / 80%);
        border-radius: 10px;

        .login-left {
            width: 800px;

            img {
                width: 100%;
                height: 100%;
            }
        }

        .login-form {
            width: 430px;
            min-width: 350px;
            padding: 50px 40px 45px;
            border-radius: 10px;
            box-shadow: 2px 3px 7px rgb(0 0 0 / 20%);

            .login-logo {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 45px;

                .login-icon {
                    width: 60px;
                    height: 52px;
                }

                .logo-text {
                    padding: 0 0 0 25px;
                    margin: 0;
                    font-size: 42px;
                    font-weight: bold;
                    color: #34495e;
                    white-space: nowrap;
                }
            }

            .el-form-item {
                margin-bottom: 30px;
            }

            .login-btn {
                display: flex;
                justify-content: space-between;
                width: 100%;
                margin-top: 40px;
                white-space: nowrap;

                .el-button {
                    width: 185px;
                }
            }
        }
    }
}
</style>