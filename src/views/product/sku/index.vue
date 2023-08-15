<template>
    <div>
        <el-card style="margin: 16px 0;">
            <el-table border style="margin: 10px 0;" data="">
                <el-table-column prop="id" label="序号" width="80" align="center" type="index" />
                <el-table-column prop="id" label="名称" />
                <el-table-column prop="id" label="描述" />
                <el-table-column prop="id" label="默认图片" />
                <el-table-column prop="id" label="重量" width="100" />
                <el-table-column prop="id" label="价格" width="100" />
                <el-table-column prop="id" label="操作" fixed="right" width="800" />

            </el-table>

            <!-- 分页器 -->
            <el-pagination v-model:current-page="pageNum" v-model:page-size="pageLimt" :page-sizes="[5, 10, 20, 50]"
                @current-change="getSpuDataList" @size-change="getSpuDataList"
                layout="total, sizes, prev, pager, next, jumper" :total="total" />
        </el-card>
    </div>
</template>

<script setup lang="ts">


</script>

<style scoped></style>