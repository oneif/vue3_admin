<template>
    <div>
        <el-card>
            <el-form inline>
                <el-form-item label="一级分类" style="margin-right: 100px;">
                    <el-select :disabled="!tableVisible" placeholder="请选择" v-model="categoryStore.category1Id"
                        @change="category1ItemChange">
                        <el-option v-for="item in categoryStore.category1Arr" :key="item.id" :label="item.name"
                            :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="二级分类" style="margin-right: 100px;">
                    <el-select :disabled="!tableVisible" placeholder="请选择" v-model="categoryStore.category2Id"
                        @change="category2ItemChange">
                        <el-option v-for="item in categoryStore.category2Arr" :key="item.id" :label="item.name"
                            :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="三级分类" style="margin-right: 100px;">
                    <el-select :disabled="!tableVisible" placeholder="请选择" v-model="categoryStore.category3Id">
                        <el-option v-for="item in categoryStore.category3Arr" :key="item.id" :label="item.name"
                            :value="item.id" />
                    </el-select>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { onMounted, } from 'vue'
import useCategory from '@/store/modules/category'

defineProps(['tableVisible'])

let categoryStore = useCategory()

const category1ItemChange = () => {
    categoryStore.getCategoryList2()
    categoryStore.category2Id = undefined
    categoryStore.category3Id = undefined
}
const category2ItemChange = () => {
    categoryStore.getCategoryList3()
    categoryStore.category3Id = undefined
}




onMounted(() => {
    categoryStore.getCategoryList1()
})
</script>

<style scoped></style>