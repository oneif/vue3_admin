<template>
    <el-card>
        <el-table :data="permissionArr" style="width: 100%; margin-bottom: 20px" row-key="id" border default-expand-all
            v-loading="loading" element-loading-text="正在加载中，请稍候...">
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="code" label="权限值" />
            <el-table-column prop="updateTime" label="修改时间" />
            <el-table-column label="操作" width="300px" align="center">
                <template #="{ row }">
                    <el-button @click="addPermission(row)" :color="row.level == 3 ? '#304ffe' : '#673ab7'" size="small"
                        :disabled="row.level == 4">
                        <SvgIcon :iconName="'plus'" :color="'white'" style="margin-right: 3px;" />
                        {{ row.level == 3 ? '添加功能' : '添加菜单' }}
                    </el-button>
                    <el-button @click="updatePermission(row)" color="#8e24aa" size="small" :disabled="row.level == 1">
                        <SvgIcon :iconName="'edit'" :color="'white'" style="margin-right: 3px;" />
                        编辑
                    </el-button>

                    <el-popconfirm width="280" confirm-button-text="删除" confirm-button-type="danger"
                        @confirm="deletePermission(row.id)" cancel-button-text="取消" :icon="Delete" icon-color='#e75e61'
                        :title="`确定要删除 ${row.name} 吗？`">
                        <template #reference>
                            <el-button size="small" color="#dd191d" :disabled="row.level == 1">
                                <SvgIcon :iconName="'delete'" :color="'white'" style="margin-right: 3px;" />删除
                            </el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加或修改菜单对话框 -->
        <el-dialog v-model="dialogVisible" :title="permissionObj.id ? '编辑' : '添加'" style="width: 500px;">
            <el-form model="roleObj" rules="formRules" ref="formRef">
                <el-form-item label="名称" label-width="100px" prop="roleName">
                    <el-input placeholder="请输入菜单名称" style="width: 200px;" v-model="permissionObj.name" />
                </el-form-item>
                <el-form-item label="权限值" label-width="100px" prop="roleName">
                    <el-input placeholder="请输入权限值" style="width: 200px;" v-model="permissionObj.code" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button color="#4527a0" @click="savePermission">
                        <SvgIcon :iconName="'confirm'" :color="'#dcdfe6'" style="margin-right: 6px;" />
                        确定
                    </el-button>
                    <el-button color="#dd191d" @click="dialogVisible = false">
                        <SvgIcon :iconName="'cancel'" :color="'white'" style="margin-right: 6px;" />
                        取消
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </el-card>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import { ref, onMounted, reactive } from 'vue'
import { getAllPermission, addAndUpdatePermission, deleteMenuById } from '@/api/acl/menu/index'
import type { Permisstion, MenuObj } from '@/api/acl/menu/type'

let loading = ref<boolean>(false)
let dialogVisible = ref<boolean>(false)

let permissionArr = ref<Permisstion[]>([])
let permissionObj = reactive<MenuObj>({
    code: '',
    level: undefined,
    name: '',
    pid: undefined,
})

const getAllPermissionList = async () => {
    loading.value = true
    await getAllPermission().then((resp) => {
        permissionArr.value = resp.data
        loading.value = false
    })
}

// 添加菜单按钮的回调
const addPermission = (row: Permisstion) => {
    Object.assign(permissionObj, {
        code: '',
        level: undefined,
        name: '',
        pid: undefined,
        id: undefined
    })
    permissionObj.level = row.level + 1
    permissionObj.pid = row.id
    dialogVisible.value = true
}
// 编辑按钮的回调
const updatePermission = (row: Permisstion) => {
    dialogVisible.value = true
    Object.assign(permissionObj, row)
}
// 删除按钮的回调
const deletePermission = async (id: number) => {
    await deleteMenuById(id).then((resp) => {
        if (resp.code === 200) {
            ElMessage.success('删除成功')
            getAllPermissionList()
        } else ElMessage.error(resp.data)
    })
}


// 对话框确定按钮的回调
const savePermission = async () => {
    await addAndUpdatePermission(permissionObj).then((resp) => {
        if (resp.code === 200) {
            ElMessage.success(permissionObj.id ? '更新成功' : '添加成功')
            getAllPermissionList()
        } else ElMessage.error(resp.data)
        dialogVisible.value = false
    })
}


onMounted(() => {
    getAllPermissionList()
})
</script>
