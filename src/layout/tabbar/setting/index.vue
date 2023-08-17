<template>
    <el-button size="default" circle @click="refresh">
        <SvgIcon :iconName="'refresh'" :color="'black'" />
    </el-button>
    <el-button size="default" circle @click="fullScreen">
        <SvgIcon :iconName="flag ? 'exit-full-screen' : 'full-screen'" :width="'20px'" :height="'20px'" />
    </el-button>


    <el-switch v-model="dark" :active-icon="Sunny" :inactive-icon="Moon" inline-prompt @change="changeDark"
        style="--el-switch-on-color: #2c2c2c;" />
    <el-color-picker @change="setColor" v-model="color" show-alpha :predefine="predefineColors" />

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
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { Sunny, Moon } from '@element-plus/icons-vue'

import useUserStore from '@/store/modules/user'
import useLayoutSettingStore from '@/store/modules/setting'

let layoutSettingStore = useLayoutSettingStore()
let router = useRouter()
// 标记是否处于全屏模式 false不是 true全屏模式
let flag = ref<boolean>(false)
// 控制暗黑模式
let dark = ref<boolean>(false)

const color = ref('rgba(255, 69, 0, 1)')
const predefineColors = ref([
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    'rgba(255, 69, 0, 0.68)',
    'rgb(255, 120, 0)',
    'hsv(51, 100, 98)',
    'hsva(120, 40, 94, 0.5)',
    'hsl(181, 100%, 37%)',
    'hsla(209, 100%, 56%, 0.73)',
    '#c7158577',
])

// 刷新按钮的回调
const refresh = () => {
    layoutSettingStore.updateRefresh()
}
// 全屏按钮的回调
const fullScreen = () => {
    // DOM对象的一个属性 可以用来判断当前页面是否处于全屏状态
    let full = document.fullscreenElement
    if (full) {
        document.exitFullscreen()
        flag.value = false
    }
    else {
        document.documentElement.requestFullscreen()
        flag.value = true
    }
}
let userStore = useUserStore()

// 退出登录
const logout = async () => {
    await userStore.userLogout()
    // 跳转到登录页面
    router.push('/login')
}

// 暗黑模式的切换
const changeDark = () => {
    // 获取html根节点
    let html = document.documentElement
    dark.value ? html.className = 'dark' : html.className = ''
}
// 主题颜色的切换
const setColor = () => {
    const el = document.documentElement

    // 获取 css 变量
    getComputedStyle(el).getPropertyValue(`--el-color-primary`)

    // 设置 css 变量
    el.style.setProperty('--el-color-primary', color.value)
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

.el-switch {
    margin: 0 12px;
}
</style>