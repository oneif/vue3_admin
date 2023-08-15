<template>
    <div>
        <el-card style="margin: 16px 0;">
            <el-table border style="margin: 10px 0;" :data="skuList" v-loading="loading"
                element-loading-text="正在加载中，请稍候...">
                <el-table-column label="序号" width="80" align="center" type="index" />
                <el-table-column prop="skuName" label="名称" width='200' />
                <el-table-column prop="skuDesc" show-overflow-tooltip label="描述" />
                <el-table-column label="默认图片" width="170">
                    <template #="{ row }">
                        <img :src="row.skuDefaultImg" style="width: 100%;height: 100%;">
                    </template>
                </el-table-column>
                <el-table-column prop="weight" label="重量(g)" width="130" />
                <el-table-column prop="price" label="价格(元)" width="130" />
                <el-table-column label="操作" fixed="right" width="268">
                    <template #="{ row }">
                        <el-tooltip :content="row.isSale == 0 ? '上架' : '下架'" placement="bottom">
                            <el-button @click="updateSale(row)" :color="row.isSale == 0 ? '#0a8f08' : '#fb8c00'">
                                <SvgIcon :iconName="row.isSale == 0 ? 'top' : 'bottom'" :color="'white'" />
                            </el-button>
                        </el-tooltip>
                        <el-tooltip content="编辑" placement="bottom">
                            <el-button @click="editSku" color="#3f51b5">
                                <SvgIcon :iconName="'edit'" :color="'white'" />
                            </el-button>
                        </el-tooltip>
                        <el-tooltip content="信息" placement="bottom">
                            <el-button @click="showDrawer(row)" color="#673ab7">
                                <SvgIcon :iconName="'attr_2'" :color="'white'" :width="'18px'" :height="'18px'" />
                            </el-button>
                        </el-tooltip>
                        <el-popconfirm width="250" confirm-button-text="删除" confirm-button-type="danger"
                            @confirm="deletesku(row.id)" cancel-button-text="取消" :icon="Delete" icon-color='#e75e61'
                            :title="`确定要删除 ${row.skuName} 吗？`">
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
            <el-pagination v-model:current-page="pageNum" v-model:page-size="pageLimt" :page-sizes="[10, 25, 50]"
                @current-change="getSkuList" @size-change="getSkuList" layout="total, sizes, prev, pager, next, jumper"
                :total="total" />

            <!-- 抽屉组件 -->
            <el-drawer v-model="drawer">
                <template #header>
                    <h4>查看商品详情</h4>
                </template>
                <template #default>
                    <div v-loading="loadingDrawer" element-loading-text="正在加载中，请稍候...">
                        <el-row center>
                            <el-col :span="4">名称</el-col>
                            <el-col :span="20">{{ skuInfo.skuName }}</el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">描述</el-col>
                            <el-col :span="20">{{ skuInfo.skuDesc }}</el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">价格</el-col>
                            <el-col :span="20" style="color: #ff621a">{{ skuInfo.price }}</el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">平台属性</el-col>
                            <el-col :span="20">
                                <el-tag v-for="item in skuInfo.skuAttrValueList" :key="item.id" style="margin: 8px;">
                                    {{ item.valueName }}
                                </el-tag>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">销售属性</el-col>
                            <el-col :span="20">
                                <el-tag type="success" v-for="item in skuInfo.skuSaleAttrValueList" :key="item.id"
                                    style="margin: 8px;">
                                    {{ item.saleAttrValueName }}
                                </el-tag>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="4">商品图片</el-col>
                            <el-col :span="20">
                                <el-carousel type="card" height="200px">
                                    <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                                        <img :src="item.imgUrl" style="width: 100%;height: 100%;">
                                    </el-carousel-item>
                                </el-carousel>
                            </el-col>
                        </el-row>
                    </div>
                </template>
            </el-drawer>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getSku, getSkuInfo, deleteSku } from '@/api/products/sku'
import type { SkuData } from '@/api/products/sku/type'
import { ElMessage } from 'element-plus';
import { Delete } from '@element-plus/icons-vue'


let loading = ref<boolean>(false)
let loadingDrawer = ref<boolean>(false)
let drawer = ref<boolean>(false)

let pageNum = ref<number>(1)
let pageLimt = ref<number>(10)
let total = ref<number>(0)
let skuList = ref<SkuData[]>([])
let skuInfo = ref<SkuData>({})

const getSkuList = async (pager = 1) => {
    loading.value = true
    pageNum.value = pager
    await getSku(pageNum.value, pageLimt.value).then(resp => {
        if (resp.code == 200) {
            skuList.value = resp.data.records
            pageLimt.value = resp.data.size
            total.value = resp.data.total
        }

    })
    loading.value = false
}

// 上架与下架回调 isSale==1 上架状态 isSale==0 下架状态
const updateSale = async (row: any) => {
    // 在售要下架
    if (row.isSale) {
        row.isSale = 0
        ElMessage.warning('下架成功')
        // await cancelSaleSku(row.id).then(resp => { // 下架请求
        //     if (resp.code == 200) {
        //         getSkuList(pageNum.value)
        //         ElMessage.info('下架成功')
        //     }
        // })
    } else {
        row.isSale = 1
        ElMessage.success('上架成功')
        // await saleSku(row.id).then(resp => { // 上架请求
        //     if (resp.code == 200) {
        //         getSkuList(pageNum.value)
        //         ElMessage.success('上架成功')
        //     }
        // })
    }
}
const editSku = () => ElMessage.info('正在努力开发中...')
const showDrawer = async (row: SkuData) => {
    loadingDrawer.value = true
    drawer.value = true
    await getSkuInfo(row.id as number).then(resp => {
        if (resp.code == 200) {
            skuInfo.value = resp.data
        }
    })
    loadingDrawer.value = false
}
const deletesku = async (id: number) => {
    await deleteSku(id).then(resp => {
        if (resp.code == 200) {
            ElMessage.success('删除成功')
            getSkuList(skuList.value.length > 1 ? pageNum.value : pageNum.value - 1)
        } else ElMessage.error(resp.data)
    })

}

onMounted(() => {
    getSkuList()
})
</script>

<style scoped>
.el-row {
    margin: 10px 0;
}

.el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
    text-align: center;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}

.el-carousel__indicators,
.el-carousel__indicator--horizontal {
    display: none !important;
}
</style>