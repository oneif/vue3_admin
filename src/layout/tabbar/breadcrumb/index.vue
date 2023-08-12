<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
        <el-breadcrumb-item v-for="(item, index) in route.matched" :key="index" v-show="item.meta.title" :to="item.path">
            <SvgIcon :iconName="item.meta.icon" style="margin: 0 5px;vertical-align:top;" />
            <span v-if="item.meta.title">{{ item.meta.title }}</span>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
const route = useRoute()

</script>