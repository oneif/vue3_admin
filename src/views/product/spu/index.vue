<template>
    <div>
        <Category :tableVisible="tableVisible" />
        <el-card style="margin: 16px 0;">
            <div v-show="scene == 0">
                <el-button color="#4527a0" @click="addSpu" :disabled="!categoryStore.category3Id">
                    <SvgIcon :iconName="'plus'" :color="'white'" />添加SPU
                </el-button>

                <!-- 表格 -->
                <el-table border style="margin: 10px 0;" :data="records" v-loading="loading"
                    element-loading-text="正在加载中，请稍候...">
                    <el-table-column prop="id" label="序号" width="80" align="center" type="index" />
                    <el-table-column prop="spuName" label="SPU名称" width="500" />
                    <el-table-column prop="description" label="SPU描述" show-overflow-tooltip />
                    <el-table-column label="SPU操作" width="270">
                        <template #="{ row }">
                            <el-tooltip content="添加SKU" placement="bottom">
                                <el-button @click="addSku(row)" color="#673ab7">
                                    <SvgIcon :iconName="'plus'" :color="'white'" />
                                </el-button>
                            </el-tooltip>
                            <el-tooltip content="修改SPU" placement="bottom">
                                <el-button @click="updateSpu(row)" color="#3f51b5">
                                    <SvgIcon :iconName="'edit'" :color="'white'" :width="'18px'" :height="'18px'" />
                                </el-button>
                            </el-tooltip>
                            <el-tooltip content="查看SKU列表" placement="bottom">
                                <el-button @click="getSku(row.id)" color="#9e9e9e">
                                    <SvgIcon :iconName="'eye'" :color="'white'" :width="'20px'" :height="'20px'" />
                                </el-button>
                            </el-tooltip>

                            <el-popconfirm width="250" confirm-button-text="删除" confirm-button-type="danger"
                                @confirm="deletespu(row.id)" cancel-button-text="取消" :icon="Delete" icon-color='#e75e61'
                                :title="`确定要删除 ${row.spuName} 吗？`">
                                <template #reference>
                                    <el-button size="default" color="#dd191d">
                                        <SvgIcon :iconName="'delete'" :color="'white'" :width="'18px'" :height="'18px'" />
                                    </el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>

                <!-- 分页器 -->
                <el-pagination v-model:current-page="pageNum" v-model:page-size="pageLimt" :page-sizes="[5, 10, 20, 50]"
                    @current-change="getSpuDataList" @size-change="getSpuDataList"
                    layout="total, sizes, prev, pager, next, jumper" :total="total" />
            </div>
            <!-- 添加SPU和修改SPU子组件 -->
            <AddAndEdit ref="AddAndEditRef" v-show="scene == 1" @changeScene="changeScene" />
            <!-- 添加SKU的子组件 -->
            <AddSku ref="AddSkuRef" v-show="scene == 2" @changeScene="changeScene" />
            <!-- 展示sku列表的对话框 -->
            <el-dialog v-model="dialogTableVisible" title="SKU列表">
                <el-table :data="skuData" border>
                    <el-table-column prop="skuName" label="SKU名称" />
                    <el-table-column prop="price" label="SKU价格" width="150" />
                    <el-table-column prop="weight" label="SKU重量" width="150" />
                    <el-table-column label="SKU图片">
                        <template #="{ row }">
                            <img :src="row.skuDefaultImg" style="width: 100px;height: 100px;">
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import useCategoryStore from '@/store/modules/category';
import { getSpu, deleteSpu, getSkuInfo } from '@/api/products/spu'
import type { Records, SpuData, SkuData } from '@/api/products/spu/type'
import { ElMessage } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import AddAndEdit from './AddAndEdit.vue';
import AddSku from './AddSku.vue';

let AddAndEditRef = ref()
let AddSkuRef = ref()

// 控制场景的切换
let scene = ref<number>(0) // 0:显示已有的spu(表格) 1:添加或修改spu 2:添加sku
let categoryStore = useCategoryStore()
let tableVisible = ref<boolean>(true)
let loading = ref<boolean>(false)
let dialogTableVisible = ref<boolean>(false)

let pageNum = ref<number>(1)
let pageLimt = ref<number>(5)
let total = ref<number>(0)

let records = ref<Records>([])
let skuData = ref<SkuData[]>([])

const getSpuDataList = async (page = 1) => {
    loading.value = true
    pageNum.value = page
    await getSpu(pageNum.value, pageLimt.value, categoryStore.category3Id).then(resp => {
        if (resp.code == 200) {
            records.value = resp.data.records
            total.value = resp.data.total
            loading.value = false
        }
    })
}

// 添加按钮的回调
const addSpu = () => {
    scene.value = 1
    AddAndEditRef.value.initAddSpu(categoryStore.category3Id)
}
// 添加sku按钮的回调
const addSku = (row: SpuData) => {
    scene.value = 2
    AddSkuRef.value.getAllSkuData(categoryStore.category1Id, categoryStore.category2Id, row)
}
// 编辑按钮的回调
const updateSpu = (row: SpuData) => {
    scene.value = 1
    AddAndEditRef.value.getAllSpuData(row)
}
// 查看sku列表的回调
const getSku = async (id: number) => {
    await getSkuInfo(id).then(resp => {
        if (resp.code == 200) {
            skuData.value = resp.data
            dialogTableVisible.value = true
        }
    })
}
// 删除按钮的回调
const deletespu = (id: number) => {
    deleteSpu(id).then(resp => {
        if (resp.code == 200) {
            // 如果删除之后当前页只有一条数据，就回到当前页的上一页
            getSpuDataList(records.value.length > 1 ? pageNum.value : pageNum.value - 1)
            ElMessage.success('删除成功')
        } else ElMessage.error('删除失败')
    })
}

watch(() => categoryStore.category3Id, () => {
    records.value = []
    if (!categoryStore.category3Id) return
    getSpuDataList()
})
//子组件AddAndEdit绑定自定义事件:目前是让子组件通知父组件切换场景为0
const changeScene = (obj: any) => {
    scene.value = obj.flag
    if (obj.id) getSpuDataList(pageNum.value)
    else getSpuDataList()
}
// 路由切换租价销毁的时候清空仓库中的数据
onBeforeUnmount(() => {
    categoryStore.category1Id = undefined
    categoryStore.category2Id = undefined
    categoryStore.category3Id = undefined
})
</script>

<style scoped></style>