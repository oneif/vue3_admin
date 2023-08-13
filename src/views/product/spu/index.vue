<template>
    <div>
        <Category :tableVisible="tableVisible" />
        <el-card style="margin: 16px 0;">
            <el-button color="#4527a0" @click="" :disabled="!categoryStore.category3Id">
                <SvgIcon :iconName="'plus'" :color="'white'" />添加SPU
            </el-button>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
let tableVisible = ref<boolean>(true)

</script>

<style scoped></style>