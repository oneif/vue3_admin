<template>
    <template v-for="item in  menuList " :key="item.path">
        <!-- 没有子路由 -->
        <template v-if="!item.children">
            <el-menu-item v-show="item.meta.show" :index="item.path" @click="goRoute">
                <!-- 图标 -->
                <template #title>
                    <SvgIcon :iconName="item.meta.icon" :color="'white'" :width="'19px'" :height="'19px'" />
                    <span>{{ item.meta.title }}</span>
                </template>
            </el-menu-item>
        </template>

        <!-- 有子路由但只有一个 -->
        <template v-if="item.children && item.children.length == 1">
            <el-menu-item v-show="item.children[0].meta.show" :index="item.children[0].path" @click="goRoute">
                <template #title>
                    <SvgIcon :iconName="item.children[0].meta.icon" :color="'white'" :width="'19px'" :height="'19px'" />
                    <span>{{ item.children[0].meta.title }}</span>
                </template>
            </el-menu-item>
        </template>

        <!-- 有子路由并且子路由个数大于一 -->
        <template v-if="item.children && item.children.length > 1">
            <el-sub-menu :index="item.path">
                <template #title>
                    <SvgIcon :iconName="item.meta.icon" :color="'white'" :width="'19px'" :height="'19px'" />
                    <span>{{ item.meta.title }}</span>
                </template>
                <Menu :menuList="item.children"></Menu>
            </el-sub-menu>
        </template>
    </template>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
defineProps(['menuList'])
const router = useRouter()
const goRoute = (vc: any) => {
    router.push(vc.index)

}
</script>
<script lang="ts">
export default {
    name: 'Menu'
}
</script>
<style scoped lang="scss">
span {
    margin: 6px;
}
</style>