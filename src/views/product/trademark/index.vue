<template>
    <div>
        <el-card class="box-card">
            <el-button color="#4527a0" @click="addTrademark">
                <SvgIcon :iconName="'plus'" :color="'white'" />添加品牌
            </el-button>
            <!-- 表格 -->
            <el-table :data="tradeMarkArr" border style="margin: 10px 0;" v-loading="loading"
                element-loading-text="正在加载中，请稍候...">
                <el-table-column prop="id" label="序号" width="80" align="center" />
                <el-table-column prop="tmName" label="品牌名称" />
                <el-table-column prop="logoUrl" label="品牌LOGO">
                    <template #="{ row }">
                        <img :src="row.logoUrl" style="width:90px;height: 90px;object-fit: scale-down;">
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="品牌操作">
                    <template #="{ row }">
                        <el-button size="default" @click="editTrademark(row)" color="#3f51b5">
                            <SvgIcon :iconName="'edit'" :color="'white'" :width="'18px'" :height="'18px'" />
                        </el-button>
                        <el-popconfirm width="250" confirm-button-text="删除" confirm-button-type="danger"
                            @confirm="removeTrademark(row.id)" cancel-button-text="取消" :icon="Delete" icon-color='#e75e61'
                            :title="`确定要删除 ${row.tmName} 吗？`">
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
            <el-pagination v-model:current-page="pageNum" v-model:page-size="pageLimt" @current-change="getTradeMarkData"
                @size-change="getTradeMarkData()" :page-sizes="[5, 10, 20, 50]"
                layout="total, sizes, prev, pager, next, jumper" :total="total" />
        </el-card>


        <!-- 对话框 -->
        <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'" style="width: 700px;">
            <el-form :model="trademarkParams" :rules="rules" ref="formRef">
                <el-form-item label="品牌名称" label-width="100px" prop="tmName">
                    <el-input autocomplete="off" placeholder="请输入品牌名称" v-model="trademarkParams.tmName"
                        style="width: 200px;" />
                </el-form-item>
                <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
                    <el-upload class="avatar-uploader" action="http://sph-api.atguigu.cn/admin/product/fileUpload"
                        :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
                        <div v-else class="avatar-uploader-icon">
                            <SvgIcon :iconName="'upload'" :width="'40px'" :height="'40px'" :color="'#8c939d'"
                                style="margin-top: 38%;" />
                        </div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="confirm">
                        <SvgIcon :iconName="'confirm'" :color="'#dcdfe6'" style="margin-right: 6px;" />
                        确定
                    </el-button>
                    <el-button color="#e0e0e0" @click="dialogFormVisible = false">
                        <SvgIcon :iconName="'cancel'" :color="'#707070'" style="margin-right: 6px;" />
                        取消
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import { getTradeMarkList, AddAndEditTradeMark, deleteTrademark } from '@/api/products/trademark'
import { Records, TradeMark } from '@/api/products/trademark/type'
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'

// 当前的页码
let pageNum = ref<number>(1)
// 每页显示多少条数据
let pageLimt = ref<number>(5)
// 总条数
let total = ref<number>(0)
// 品牌的具体数据
let tradeMarkArr = ref<Records>([])

// 控制对话框的显示与隐藏
let dialogFormVisible = ref<boolean>(false)

// 定义新增品牌的数据
let trademarkParams = reactive<TradeMark>({ tmName: '', logoUrl: '', })
const formRef = ref()
let loading = ref(false)

const getTradeMarkData = async (pager = 1) => {
    // 如果不传参 则默认获取第一页的数据
    loading.value = true
    pageNum.value = pager
    await getTradeMarkList(pageNum.value, pageLimt.value).then(resp => {
        total.value = resp.data.total
        tradeMarkArr.value = resp.data.records
        loading.value = false
    })
}

// 添加品牌的回调
const addTrademark = () => {
    dialogFormVisible.value = true
    trademarkParams.id = 0
    trademarkParams.logoUrl = ''
    trademarkParams.tmName = ''
    nextTick(() => formRef.value.clearValidate())
}
// 编辑品牌的回调
const editTrademark = (row: TradeMark) => {
    nextTick(() => formRef.value.clearValidate())
    // ES6语法合并对象
    Object.assign(trademarkParams, row)
    // trademarkParams.id = row.id
    // trademarkParams.tmName = row.tmName
    // trademarkParams.logoUrl = row.logoUrl
    dialogFormVisible.value = true
}

// 上传图片之前的钩子
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
// 上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = response => {
    formRef.value.clearValidate('logoUrl')
    trademarkParams.logoUrl = response.data
}

// 添加和修改对话框确定按钮的回调
const confirm = async () => {
    // 发请求之前先对表单进行校验
    await formRef.value.validate()
    await AddAndEditTradeMark(trademarkParams).then(resp => {
        if (resp.code == 200) {
            getTradeMarkData(trademarkParams.id ? pageNum.value : 1)
            ElMessage.success(trademarkParams.id ? '修改品牌成功' : '添加品牌成功')
            dialogFormVisible.value = false
        } else {
            ElMessage.error(trademarkParams.id ? '修改品牌失败' : '添加品牌失败')
            dialogFormVisible.value = false
        }
    })
}

const validatorLogourl = (rule: any, value: any, callback: any) => {
    if (value) {
        callback()
    } else {
        callback(new Error('请上传品牌logo'))
    }
}
// 表单校验规则
const rules = {
    tmName: [
        { required: true, message: '请输入品牌名称', trigger: 'blur' },
        { min: 2, message: '品牌名称不能少于两个字', trigger: 'blur' },
    ],
    logoUrl: [{ required: true, validator: validatorLogourl }],
}

// 确认删除的回调
const removeTrademark = (id: number) => {
    deleteTrademark(id).then(resp => {
        if (resp.code === 200) {
            ElMessage.success('删除品牌成功')
            // 如果删除之后当前页只有一条数据，就回到当前页的上一页
            getTradeMarkData(tradeMarkArr.value.length > 1 ? pageNum.value : pageNum.value - 1)
        } else {
            ElMessage.error('删除品牌失败')
        }
    })
}


onMounted(() => {
    getTradeMarkData()
})
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