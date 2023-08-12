<template>
    <div class="tabbar">
        <div class="tabbar_left">
            <Breadcrumb />
        </div>
        <div class="tabbar_right">
            <Setting />
        </div>
    </div>
</template>

<script setup lang="ts">
import Breadcrumb from "./breadcrumb/index.vue";
import Setting from "./setting/index.vue";
</script>

<style scoped lang="scss">
.tabbar {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;


    .tabbar_left,
    .tabbar_right {
        display: flex;
        align-items: center;
    }

    // .tabbar_right {
    //     display: flex;
    //     align-items: center;
    // }
}
</style>