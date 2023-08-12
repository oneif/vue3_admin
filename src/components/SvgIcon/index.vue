<template>
    <svg :style="{ width, height }" class="svg">
        <use :href="prefix + iconName" :fill="color" />
    </svg>
</template>

<script setup lang="ts">
defineProps({
    prefix: {
        type: String,
        default: '#icon-'
    },
    iconName: String,
    // 图标的颜色
    color: {
        type: String,
        default: ''
    },
    // 样式
    width: {
        type: String,
        default: '16px'
    },
    height: {
        type: String,
        default: '16px'
    }
})
</script>
<style scoped lang="scss"></style>