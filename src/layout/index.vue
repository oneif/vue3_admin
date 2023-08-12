<template>
    <div class="layout_container">
        <div class="layout_left">
            <Logo />
            <el-scrollbar class="scrollbar">
                <el-menu :default-active="route.path" background-color="$left-menu-background" text-color="white"
                    active-text-color="#00ffbb" :unique-opened="true">
                    <Menu :menuList="userStore.menuRoutes" />
                </el-menu>
            </el-scrollbar>
        </div>
        <div class="layout_top">
            <Tabbar />
        </div>
        <div class="layout_main">
            <Main />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import Logo from "./logo/index.vue";
import Menu from './menu/index.vue'
import Tabbar from './tabbar/index.vue'
import Main from './main/index.vue'
import useUserStore from '@/store/modules/user'

let userStore = useUserStore()
// 获取路由对象
let route = useRoute()


</script>

<style scoped lang="scss">
.layout_container {
    width: 100%;
    height: 100vh;

    .layout_left {
        width: $left-menu-width;
        height: 100vh;
        background-color: $left-menu-background;
        overflow: hidden;

        .scrollbar {
            height: calc(100vh - $left-logo-height);

            .el-menu {
                border-right: none;
            }
        }
    }

    .layout_top {
        position: absolute;
        top: 0;
        left: $left-menu-width;
        width: calc(100% - $left-menu-width);
        height: $top-tabbar-height;
        border-bottom: 2px solid #d8dce5;
    }

    .layout_main {
        position: absolute;
        top: $top-tabbar-height;
        left: $left-menu-width;
        width: calc(100% - $left-menu-width);
        height: calc(100vh - $top-tabbar-height);
        padding: 16px;
        overflow: auto;
    }
}
</style>