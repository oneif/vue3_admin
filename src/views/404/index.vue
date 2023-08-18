<template>
    <div class="box">
        <img src="@/assets/images/error_images/404.png" alt="">
        <div>
            <h2>抱歉，您访问的页面不存在~🤷‍♂️🤷‍♀️</h2>
            <p>请检查你的 url 是否正确，或者点击下面按钮回到首页</p>
            <el-button color="#4527a0" @click="gohome">返回首页</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
let router = useRouter()
const gohome = () => router.push('/home')
</script>

<style scoped lang="scss">
.box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    img {
        margin-right: 30px;
    }

    h2 {
        display: block;
        font-size: 32px;
        font-weight: 900;
        color: #000;
        margin-bottom: 20px;
    }

    .el-button {
        margin-top: 40px;
        border-radius: 20px;
    }
}
</style>