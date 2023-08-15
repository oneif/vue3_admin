<template>
    <div>
        <el-form label-width="100px" v-loading="loading" element-loading-text="正在加载中，请稍候...">
            <el-form-item label="SKU名称">
                <el-input placeholder="请输入SKU名称" v-model="skuObj.skuName"></el-input>
            </el-form-item>
            <el-form-item label="价格(元)">
                <el-input placeholder="请输入价格(元)" type="number" v-model.number="skuObj.price"></el-input>
            </el-form-item>
            <el-form-item label="重量(g)">
                <el-input placeholder="请输入重量(g)" type="number" v-model.number="skuObj.weight"></el-input>
            </el-form-item>
            <el-form-item label="SKU描述" type="textarea">
                <el-input placeholder="请输入SKU描述" type="textarea" v-model="skuObj.skuDesc"></el-input>
            </el-form-item>
            <el-form-item label="平台属性">
                <el-form inline>
                    <el-form-item v-for="item in attrArr" :key="item.id" :label="item.attrName"
                        style="margin: 0 10px 10px 10px;">
                        <el-select placeholder="请选择" v-model="item.attrIdAndValueId">
                            <el-option v-for="attrValue in item.attrValueList" :key="attrValue.id"
                                :label="attrValue.valueName" :value="`${item.id}?${attrValue.id}`" />
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>
            <el-form-item label="销售属性">
                <el-form inline>
                    <el-form-item v-for="item in saleAttr" :key="item.id" :label="item.saleAttrName">
                        <el-select placeholder="请选择" v-model="item.saleIdAndValueId" disabled>
                            <el-option v-for="saleAttrValue in item.spuSaleAttrValueList" :key="saleAttrValue.id"
                                :label="saleAttrValue.saleAttrValueName" :value="`${item.id}?${saleAttrValue.id}`" />
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>
            <el-form-item label="图片名称">
                <el-table :data="imgList" ref="tableRef">
                    <el-table-column type="selection" width="80" align="center"></el-table-column>
                    <el-table-column label="图片">
                        <template #="{ row }">
                            <img :src="row.imgUrl" style="width: 100px;height: 100px;">
                        </template>
                    </el-table-column>
                    <el-table-column prop="imgName" label="名称"></el-table-column>
                    <el-table-column label="操作">
                        <template #="{ row }">
                            <el-button @click="handleSave(row)" color="#3f51b5">
                                <SvgIcon :iconName="'setting'" :color="'white'" style="margin-right: 4px;" />
                                设置默认
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <!-- disabled="!saleAttr.length" -->
                <el-button @click="saveSkuObj" color="#4527a0">
                    <SvgIcon :iconName="'save'" :color="'white'" :width="'12px'" :height="'12px'"
                        style="margin-right: 3px;" />保存
                </el-button>
                <el-button @click="cancel" color="#e0e0e0">
                    <SvgIcon :iconName="'cancel'" :color="'#797979'" />取消
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { getAttr } from '@/api/products/attr'
import { getImage, getSaleAttr, addSku } from '@/api/products/spu'
import type { AttrObj } from "@/api/products/attr/type";
import type { SpuImg, SpuSaleAttr, SkuData, SpuData, } from '@/api/products/spu/type'
import { ElMessage } from 'element-plus';


let tableRef = ref()
let loading = ref<boolean>(false)
let emit = defineEmits(['changeScene']);
//点击取消按钮:通知父组件切换场景为0,展示有的SKU的数据
const cancel = () => {
    emit('changeScene', { flag: 0, id: null });
}

let attrArr = ref<AttrObj[]>([])
let imgList = ref<SpuImg[]>([])
let saleAttr = ref<SpuSaleAttr[]>([])

let skuObj = reactive<SkuData>({
    category3Id: undefined,
    spuId: undefined,
    tmId: undefined,
    skuName: '',
    price: undefined,
    weight: undefined,
    skuDesc: '',
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    skuDefaultImg: '',
})
const getAllSkuData = async (category1Id: number, category2Id: number, spu: SpuData) => {
    loading.value = true

    skuObj.category3Id = spu.category3Id
    skuObj.spuId = spu.id
    skuObj.tmId = spu.tmId
    await getAttr(category1Id, category2Id, spu.category3Id).then((resp) => {
        if (resp.code == 200) {
            attrArr.value = resp.data;
        }
    })
    await getImage((spu.id as number)).then((resp) => {
        if (resp.code == 200) {
            imgList.value = resp.data;
        }
    })
    await getSaleAttr(spu.id as number).then((resp) => {
        if (resp.code == 200) {
            saleAttr.value = resp.data;
        }
    })
    loading.value = false
}

// 设置默认的回调
const handleSave = (row: SpuImg) => {
    tableRef.value.clearSelection()
    tableRef.value.toggleRowSelection(row, true)
    skuObj.skuDefaultImg = row.imgUrl as string
}

// 保存按钮
const saveSkuObj = async () => {
    skuObj.skuAttrValueList = attrArr.value.reduce((prev: any, next) => {
        if (next.attrIdAndValueId) {
            let [attrId, valueId] = next.attrIdAndValueId.split('?')
            prev.push({
                attrId,
                valueId
            })
        }
        return prev
    }, [])
    // 接口有问题
    // skuObj.skuSaleAttrValueList = saleAttr.value.reduce((prev: any, next) => {
    //     if (next.saleIdAndValueId) {
    //         let [attrId, valueId] = next.saleIdAndValueId.split('?')
    //         prev.push({
    //             attrId,
    //             valueId
    //         })
    //     }
    //     return prev
    // }, [])
    await addSku(skuObj).then(resp => {
        if (resp.code == 200) {
            ElMessage.success('添加SKU成功')
            emit('changeScene', { flag: 0, id: null });
        } else ElMessage.error('添加SKU失败')
    })
}
defineExpose({ getAllSkuData })
</script>
