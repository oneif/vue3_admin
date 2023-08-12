<template>
    <el-button size="default" circle @click="refresh">
        <SvgIcon :iconName="'refresh'" :color="'black'" />
    </el-button>
    <el-button size="default" circle @click="fullScreen">
        <SvgIcon :iconName="'full-screen'" :width="'20px'" :height="'20px'" />
    </el-button>
    <el-button size="default" circle>
        <SvgIcon :iconName="'exit-full-screen'" :width="'20px'" :height="'20px'" />
    </el-button>
    <img :src="userStore.avatar">
    <el-dropdown>
        <span class="el-dropdown-link">
            {{ userStore.username }}
            <SvgIcon :iconName="'arrow-down'" style="vertical-align:top;" />
        </span>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import useUserStore from '@/store/modules/user'
import useLayoutSettingStore from '@/store/modules/setting'

let layoutSettingStore = useLayoutSettingStore()
let router = useRouter()

// 刷新按钮的回调
const refresh = () => {
    layoutSettingStore.updateRefresh()
}
// 全屏按钮的回调
const fullScreen = () => {
    // DOM对象的一个属性 可以用来判断当前页面是否处于全屏状态
    let full = document.fullscreenElement
    if (full) document.exitFullscreen()
    else document.documentElement.requestFullscreen()
}
let userStore = useUserStore()

// 退出登录
const logout = async () => {
    await userStore.userLogout()
    // 跳转到登录页面
    router.push('/login')
}

</script>

<style lang="scss" scoped>
.el-button {
    width: 32px;
    height: 32px;
}

img {
    width: 36px;
    height: 36px;
    margin: 0 10px;
    border-radius: 50%;
}
</style>