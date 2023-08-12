<template>
    <div class="logo" v-if="true">
        <img src="../../../public/huawei_logo.png">
        <p>灵犀后台管理系统</p>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.logo {
    width: 100%;
    color: white;
    display: flex;
    align-items: center;
    padding: 10px;

    img {
        height: $left-logo-height;
    }

    p {
        font-size: $left-logo-title-fontSize;
        font-weight: 900;
        margin-left: 8px;
    }
}
</style>