<template>
    <!-- 路由组件出口的位置 -->
    <router-view v-slot="{ Component }">
        <transition name="fade">
            <!-- 渲染layout一级路由组件的子路由 -->
            <component :is="Component" v-if="flag" />
        </transition>
    </router-view>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import useLayoutSettingStore from '@/store/modules/setting'
let layoutSettingStore = useLayoutSettingStore()

// 控制当前组件是否要销毁重建 true 不需要
let flag = ref(true)
// 监听仓库内部数据是否发生变化，如果变化，则销毁重建组件
watch(() => layoutSettingStore.refresh, () => {
    flag.value = false
    nextTick(() => {
        flag.value = true
    })
})

</script>
<script lang="ts">
export default {
    name: "Main"
}
</script>

<style scoped>
.fade-enter-from {
    opacity: 0;
    transform: scale(0);
}

.fade-enter-active {
    transition: all .4s;
}

.fade-enter-to {
    opacity: 1;
    transform: scale(1);
}
</style>