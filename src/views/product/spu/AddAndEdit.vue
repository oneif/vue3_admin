<template>
    <div>
        <el-form label-width="100px" v-loading="loading" element-loading-text="正在加载中，请稍候...">
            <el-form-item label="SPU名称">
                <el-input placeholder="请输入SPU名称" v-model="spuObj.spuName"></el-input>
            </el-form-item>
            <el-form-item label="SPU品牌">
                <el-select placeholder="请选择品牌" v-model="spuObj.tmId">
                    <el-option v-for="item in allTrademark" :key="item.id" :label="item.tmName" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="SPU描述">
                <el-input type="textarea" placeholder="请输入SPU描述" v-model="spuObj.description"></el-input>
            </el-form-item>
            <el-form-item label="SPU图片" prop="logoUrl">
                <el-upload action="http://sph-api.atguigu.cn/admin/product/fileUpload" v-model:file-list="imgList"
                    list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove"
                    :before-upload="beforeAvatarUpload">
                    <el-icon>
                        <Plus />
                    </el-icon>
                </el-upload>
                <el-dialog v-model="dialogVisible">
                    <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%;height: 100%;" />
                </el-dialog>
            </el-form-item>
            <el-form-item label="SPU销售属性">
                <el-select v-model="selectId"
                    :placeholder="unSelectSaleAttr.length ? `还能选择${unSelectSaleAttr.length}项` : '暂无属性可以选择'">
                    <el-option :label="item.name" v-for="item in unSelectSaleAttr" :key="item.id" :value="item.id" />
                </el-select>
                <el-button color="#4527a0" @click="addSaleAttr" :disabled="!selectId" style="margin-left: 10px;">
                    <SvgIcon :iconName="'plus'" :color="'white'" />添加销售属性
                </el-button>
                <el-table border style="margin-top: 10px;" :data="saleAttr">
                    <el-table-column type="index" label="序号" align="center" width=80></el-table-column>
                    <el-table-column label="属性名" width=100 prop="saleAttrName"></el-table-column>
                    <el-table-column label="属性值">
                        <template #="{ row }">
                            <el-tag v-for="(item, index) in row.spuSaleAttrValueList" :key="item.id" closable
                                @close="row.spuSaleAttrValueList.splice(index, 1)" :disable-transitions="false"
                                style="margin: 0 5px;">
                                {{ item.saleAttrValueName }}
                            </el-tag>
                            <el-input v-model="row.saleAttrValue" v-if="row.flag" placeholder="请输入属性值" ref="InputRef"
                                size="small" style="width: 100px;" @blur="addSaleValueName(row)" />
                            <el-button size="small" @click="toAddSaleAttrValueName(row)" color="#5c6bc0"
                                style="margin: 0 5px;">
                                <SvgIcon :iconName="'plus'" :color="'white'" />
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width=170>
                        <template #="{ $index }">
                            <el-button size="default" color="#dd191d" @click="saleAttr.splice($index, 1)">
                                <SvgIcon :iconName="'delete'" :color="'white'" :width="'18px'" :height="'18px'" />
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <el-button @click="saveSpuObj" color="#4527a0" :disabled="!saleAttr.length">
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
import { ref, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadProps } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getAllTrademark, getImage, getSaleAttr, getAllSaleAttr, addOrUpdateSpu } from "@/api/products/spu"
import type { TradeMark } from "@/api/products/trademark/type"
import type { SpuData, SpuImg, SaleAttrList, SpuSaleAttr } from '@/api/products/spu/type'

let emit = defineEmits(['changeScene']);
//点击取消按钮:通知父组件切换场景为1,展示有的SPU的数据
const cancel = () => {
    emit('changeScene', { flag: 0, id: null });
}
const InputRef = ref()

let spuObj = ref<SpuData>({
    category3Id: undefined,
    spuName: '',
    tmId: undefined,
    description: '',
    spuImageList: [],
    spuSaleAttrList: [],
})
let allTrademark = ref<TradeMark[]>([])
let imgList = ref<SpuImg[]>([])
let allSaleAttrList = ref<SaleAttrList[]>([])
let saleAttr = ref<SpuSaleAttr[]>([])
let selectId = ref<number>()

// 预览照片相关
let dialogVisible = ref<boolean>(false)
let dialogImageUrl = ref<string>('')
let loading = ref(false)

const initAddSpu = async (category3Id: number) => {
    // 清空数据
    Object.assign(spuObj.value, {
        category3Id: undefined,
        spuName: '',
        tmId: undefined,
        description: '',
        spuImageList: [],
        spuSaleAttrList: [],
    })
    imgList.value = []
    saleAttr.value = []

    spuObj.value.category3Id = category3Id
    await getAllTrademark().then(resp => {
        allTrademark.value = resp.data
    })
    await getAllSaleAttr().then(resp => {
        allSaleAttrList.value = resp.data
    })
}

const getAllSpuData = async (row: SpuData) => {
    // row就是父组件丢过来的Spu对象
    spuObj.value = row
    loading.value = true
    await getAllTrademark().then(resp => {
        allTrademark.value = resp.data
    })
    await getImage((row.id as number)).then(resp => {
        imgList.value = resp.data.map(item => {
            return {
                name: item.imgName,
                url: item.imgUrl
            }
        })
    })
    await getAllSaleAttr().then(resp => {
        allSaleAttrList.value = resp.data
    })
    await getSaleAttr((row.id as number)).then(resp => {
        saleAttr.value = resp.data
    })
    loading.value = false
}

// 照片墙预览
const handlePictureCardPreview = (file: any) => {
    dialogImageUrl.value = file.url
    dialogVisible.value = true
}
const handleRemove = () => { }
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type == 'image/jpeg' || rawFile.type == 'image/png' || rawFile.type == 'image/gif') {
        if (rawFile.size / 1024 / 1024 < 4) {
            return true;
        } else {
            ElMessage.error('上传文件的大小不能超过4M')
            return false;
        }
    } else {
        ElMessage.error('上传的文件必须是 jpg || png || gif')
        return false
    }
}

// 剩余未选择的spu销售属性
let unSelectSaleAttr = computed(() => {
    return allSaleAttrList.value.filter(item => {
        return saleAttr.value.every(item2 => {
            return item.name !== item2.saleAttrName
        })
    })
})
// 添加销售属性的回调
const addSaleAttr = () => {
    let a = allSaleAttrList.value.filter(item => {
        if (item.id == selectId.value) return item
    });
    let selectName = a[0].name;
    saleAttr.value.push({
        saleAttrName: selectName,
        baseSaleAttrId: selectId.value,
        spuSaleAttrValueList: []
    })
    selectId.value = undefined
}

// 添加销售属性值的回调
const toAddSaleAttrValueName = (row: SpuSaleAttr) => {
    row.flag = true
    row.saleAttrValue = ''
    nextTick(() => {
        InputRef.value.input.focus()
    })
}
// 表单元素失去焦点的回调
const addSaleValueName = (row: SpuSaleAttr) => {
    const { baseSaleAttrId, saleAttrValue } = row

    if ((saleAttrValue as string).trim() == '') {
        ElMessage.error('属性值不能为空')
        return row.flag = false
    }
    // 在spuSaleAttrValueList中找是否有和row.saleAttrValueName一样的
    let repeat = row.spuSaleAttrValueList.find(item => {
        return item.saleAttrValueName == saleAttrValue
    })
    if (repeat) {
        ElMessage.error('属性值不能重复')
        return row.flag = false
    }

    row.spuSaleAttrValueList.push({
        baseSaleAttrId: baseSaleAttrId as number,
        saleAttrValueName: saleAttrValue as string
    })
    row.flag = false
}

// 提交数据
const saveSpuObj = async () => {
    spuObj.value.spuImageList = imgList.value.map((item: any) => {
        return {
            imgName: item.name,
            imgUrl: (item.response && item.response.data) || item.url
        }
    })

    spuObj.value.spuSaleAttrList = saleAttr.value
    await addOrUpdateSpu(spuObj.value).then((resp) => {
        if (resp.code == 200) {
            ElMessage.success(spuObj.value.id ? '修改成功' : '添加成功')
            emit('changeScene', { flag: 0, id: spuObj.value.id });
        } else ElMessage.error(spuObj.value.id ? '修改失败' : '添加失败')
    })
}

// 暴露给父组件使用
defineExpose({ getAllSpuData, initAddSpu })
</script>

<style scoped>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
    font-size: 28px;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>