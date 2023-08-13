<template>
    <div>
        <!-- 三级分类的组件 -->
        <Category :tableVisible="tableVisible" />
        <el-card style="margin: 16px 0;">
            <div v-show="tableVisible">
                <el-button color="#4527a0" @click="addAttr" :disabled="!categoryStore.category3Id">
                    <SvgIcon :iconName="'plus'" :color="'white'" />添加商品属性
                </el-button>

                <!-- 表格 -->
                <el-table border style="margin: 10px 0;" :data="attrArr" v-loading="loading"
                    element-loading-text="正在加载中，请稍候...">
                    <el-table-column prop="id" label="序号" width="80" align="center" type="index" />
                    <el-table-column prop="attrName" label="属性名称" width="140" />
                    <el-table-column prop="tmName" label="属性值名称">
                        <template #="{ row }">
                            <el-tag color="#b388ff" type="info" effect="dark" v-for="item in row.attrValueList"
                                :key="item.id" style="margin: 5px;">
                                {{ item.valueName }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="tmName" label="操作" width="240">
                        <template #="{ row }">
                            <el-button size="default" @click="editAttr(row)" color="#3f51b5">
                                <SvgIcon :iconName="'edit'" :color="'white'" :width="'18px'" :height="'18px'" />
                            </el-button>
                            <el-popconfirm width="250" confirm-button-text="删除" confirm-button-type="danger"
                                @confirm="deleteAttr(row.id)" cancel-button-text="取消" :icon="Delete" icon-color='#e75e61'
                                :title="`确定要删除 ${row.attrName} 吗？`">
                                <template #reference>
                                    <el-button size="default" color="#dd191d">
                                        <SvgIcon :iconName="'delete'" :color="'white'" :width="'18px'" :height="'18px'" />
                                    </el-button>
                                </template>
                            </el-popconfirm>

                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <div v-show="tableVisible == false">
                <el-form inline>
                    <el-form-item label="属性名称">
                        <el-input v-model="attrObj.attrName" placeholder="请输入属性名字"></el-input>
                    </el-form-item>
                </el-form>

                <el-button @click="addAttrName" color="#673ab7" :disabled="!attrObj.attrName">
                    <SvgIcon :iconName="'plus'" :color="'white'" />添加属性值
                </el-button>

                <el-table border style="margin: 14px 0;" :data="attrObj.attrValueList">
                    <el-table-column label="序号" align="center" width="80" type="index"></el-table-column>
                    <el-table-column label="属性值名称">
                        <template #="{ row, $index }">
                            <el-input :ref="(vc: any) => inputArr[$index] = vc" v-if="row.flag" @blur="showDiv(row, $index)"
                                v-model="row.valueName" placeholder="请输入属性值名称"></el-input>
                            <div v-else @click="showInput(row, $index)">{{ row.valueName }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template #="{ $index }">
                            <el-button @click="attrObj.attrValueList.splice($index, 1)" color="#dd191d">
                                <SvgIcon :iconName="'delete'" :color="'white'" />删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>


                <el-button @click="saveAttr" color="#4527a0" :disabled="attrObj.attrValueList.length == 0 ? true : false">
                    <SvgIcon :iconName="'save'" :color="'white'" :width="'12px'" :height="'12px'"
                        style="margin-right: 3px;" />保存
                </el-button>
                <el-button @click="tableVisible = true" color="#e0e0e0">
                    <SvgIcon :iconName="'cancel'" :color="'#797979'" />取消
                </el-button>


            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { watch, ref, reactive, nextTick, onBeforeUnmount } from 'vue'
import useCategoryStore from '@/store/modules/category';
import { getAttr, addOrUpdateAttr, removeAttr } from '@/api/products/attr/index'
import type { AttrObj, AttrValue } from "@/api/products/attr/type";
import { Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';


const categoryStore = useCategoryStore();
let attrArr = ref<AttrObj[]>([])
let tableVisible = ref<boolean>(true)

let attrObj = reactive<AttrObj>({
    attrName: '', // 新增的属性名字
    attrValueList: [], // 新增的属性值数组
    categoryId: undefined, // 三级分类的id
    categoryLevel: 3 // 代表是三级分类
})
//准备一个数组:将来存储对应的组件实例el-input
let inputArr = ref<any>([]);
let loading = ref(false)

const getAttrList = async () => {
    loading.value = true
    const { category1Id, category2Id, category3Id } = categoryStore
    await getAttr(category1Id, category2Id, category3Id).then(resp => {
        if (resp.code == 200) {
            attrArr.value = resp.data
            loading.value = false
        }
    })
}
// 添加商品属性的回调
const addAttr = () => {
    Object.assign(attrObj, {
        attrName: '',
        attrValueList: [],
        categoryId: categoryStore.category3Id,
        categoryLevel: 3
    })
    tableVisible.value = false
}

// 编辑商品属性的回调
const editAttr = (row: AttrObj) => {
    tableVisible.value = false
    Object.assign(attrObj, JSON.parse(JSON.stringify(row)))
}
// 删除商品属性按钮
const deleteAttr = async (attrid: number) => {
    await removeAttr(attrid).then(resp => {
        if (resp.code == 200) {
            getAttrList()
            ElMessage.success('删除属性成功')
        } else ElMessage.error('删除属性失败')
    })
}

// 监听三级分类id的变化
watch(() => categoryStore.category3Id, () => {
    attrArr.value = []
    if (!categoryStore.category3Id) return
    getAttrList()
})

// 添加属性值按钮的回调
const addAttrName = () => {
    attrObj.attrValueList.push({
        valueName: '',
        // 控制输入框和div的切换 true显示input false显示div
        flag: true
    })
    nextTick(() => {
        inputArr.value[attrObj.attrValueList.length - 1].focus()
    })
}
// 保存按钮的回调(提交数据)
const saveAttr = async () => {

    await addOrUpdateAttr(attrObj).then(resp => {
        if (resp.code == 200) {
            tableVisible.value = true
            getAttrList()
            ElMessage.success(attrObj.id ? '修改属性成功' : '添加属性成功')
        } else {
            ElMessage.error(attrObj.id ? '修改属性失败' : '添加属性失败')
        }
    })
}

// 控制输入和显示
const showDiv = (row: AttrValue, index: number) => {
    if (row.valueName.trim() == '') {
        attrObj.attrValueList.splice(index, 1)
        ElMessage.error('属性值不能为空')
        return
    }
    // 在attrValueList中找是否有和row.valueName一样的
    let repeat = attrObj.attrValueList.find(item => {
        // 剔除当前行
        if (item != row) return item.valueName == row.valueName
    })
    if (repeat) {
        attrObj.attrValueList.splice(index, 1)
        ElMessage.error('属性值不能重复')
        return
    }

    row.flag = false
}
const showInput = (row: AttrValue, index: number) => {
    row.flag = true
    nextTick(() => {
        // 点击的时候获取当前input框的焦点
        inputArr.value[index].focus()
    })
}

// 路由切换租价销毁的时候清空仓库中的数据
onBeforeUnmount(() => {
    categoryStore.category1Id = undefined
    categoryStore.category2Id = undefined
    categoryStore.category3Id = undefined
})
</script>