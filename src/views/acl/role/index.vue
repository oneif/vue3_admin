<template>
    <div>
        <el-card style="height: 76px;">
            <el-form inline>
                <el-form-item label="角色名称：">
                    <el-input placeholder="输入角色名称进行搜索" v-model="keywords"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button color="#673ab7" @click="search" :disabled="!keywords">
                        <SvgIcon :iconName="'search'" :color="'white'" style="margin-right: 5px;" />
                        搜索
                    </el-button>
                    <el-button color="#e84e40" @click="reset">
                        <SvgIcon :iconName="'reset'" style="margin-right: 5px;" />
                        重置
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card style="margin: 16px 0;">
            <el-button color="#4527a0" @click="addRole">
                <SvgIcon :iconName="'plus'" :color="'white'" />添加角色
            </el-button>
            <el-table :data="roleList" style="margin: 10px 0px;" border v-loading="loading"
                element-loading-text="正在加载中，请稍候...">
                <el-table-column label="#" align="center" type="index"></el-table-column>
                <el-table-column label="ID" align="center" prop="id"></el-table-column>
                <el-table-column label="角色名称" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
                <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
                <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" width="300px" align="center">
                    <template #="{ row }">
                        <el-button @click="setPermission(row)" color="#673ab7" size="small">
                            <SvgIcon :iconName="'user_2'" :color="'white'" style="margin-right: 3px;" />分配权限
                        </el-button>
                        <el-button @click="editRole(row)" color="#3f51b5" size="small">
                            <SvgIcon :iconName="'edit'" :color="'white'" style="margin-right: 3px;" />编辑
                        </el-button>

                        <el-popconfirm width="280" confirm-button-text="删除" confirm-button-type="danger"
                            @confirm="deleteRole(row.id)" cancel-button-text="取消" :icon="Delete" icon-color='#e75e61'
                            :title="`确定要删除 ${row.roleName} 吗？`">
                            <template #reference>
                                <el-button size="small" color="#dd191d">
                                    <SvgIcon :iconName="'delete'" :color="'white'" style="margin-right: 3px;" />删除
                                </el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页器 -->
            <el-pagination v-model:current-page="pageNum" v-model:page-size="pageLimt" :page-sizes="[10, 20, 30]"
                @current-change="getRoleList" @size-change="getRoleList" layout="total, sizes, prev, pager, next, jumper"
                :total="total" />
        </el-card>

        <!-- 添加或修改角色对话框 -->
        <el-dialog v-model="addAndEditDialogVisible" :title="roleObj.id ? '编辑角色' : '添加角色'" style="width: 700px;">
            <el-form :model="roleObj" :rules="formRules" ref="formRef">
                <el-form-item label="用户姓名" label-width="100px" prop="roleName">
                    <el-input placeholder="请输入角色名称" style="width: 200px;" v-model="roleObj.roleName" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button color="#4527a0" @click="saveRole">
                        <SvgIcon :iconName="'confirm'" :color="'#dcdfe6'" style="margin-right: 6px;" />
                        确定
                    </el-button>
                    <el-button color="#dd191d" @click="addAndEditDialogVisible = false">
                        <SvgIcon :iconName="'cancel'" :color="'white'" style="margin-right: 6px;" />
                        取消
                    </el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 抽屉组件 -->
        <el-drawer v-model="drawer">
            <template #header>
                <h4>分配角色权限</h4>
            </template>
            <template #default>
                <el-tree ref="tree" v-loading="drawerLoading" element-loading-text="正在加载中，请稍候..." :data="permissionList"
                    show-checkbox node-key="id" default-expand-all :default-checked-keys="selectArr"
                    :props="defaultProps" />
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button color="#4527a0" @click="savePermission">
                        <SvgIcon :iconName="'confirm'" :color="'#dcdfe6'" style="margin-right: 6px;" />
                        确定
                    </el-button>
                    <el-button color="#dd191d" @click="drawer = false">
                        <SvgIcon :iconName="'cancel'" :color="'white'" style="margin-right: 6px;" />
                        取消
                    </el-button>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick, } from 'vue'
import { ElMessage } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import { getRole, addAndUpdateRole, getAllMenuList, setPermisstionById, removeRole } from "@/api/acl/role"
import type { RoleData, MenuList } from "@/api/acl/role/type"
import useLayoutSettingStore from '@/store/modules/setting'

const defaultProps = {
    children: 'children',
    label: 'name',
}
let settingStore = useLayoutSettingStore()
let formRef = ref()
let tree = ref()

let loading = ref<boolean>(false)
let addAndEditDialogVisible = ref<boolean>(false)
let drawer = ref<boolean>(false)
let drawerLoading = ref<boolean>(false)


let pageNum = ref<number>(1)
let pageLimt = ref<number>(10)
let total = ref<number>(0)
let keywords = ref<string>('')

let roleList = ref<RoleData[]>([])
let roleObj = reactive<RoleData>({ roleName: '' })
let permissionList = ref<MenuList>([])
//准备一个数组:数组用于存储勾选的节点的ID(四级的)
let selectArr = ref<number[]>([]);

const getRoleList = async (page = 1) => {
    loading.value = true
    pageNum.value = page
    await getRole(pageNum.value, pageLimt.value, keywords.value).then(resp => {
        if (resp.code == 200) {
            total.value = resp.data.total
            roleList.value = resp.data.records
            loading.value = false
        } else ElMessage.error(resp.message)
    })
}

// 搜索按钮的回调
const search = () => {
    getRoleList()
    keywords.value = ''
}
// 重置按钮的回调
const reset = () => settingStore.refresh = !settingStore.refresh
// 添加角色按钮的回调
const addRole = () => {
    addAndEditDialogVisible.value = true
    Object.assign(roleObj, {
        roleName: '',
        id: 0
    })
    nextTick(() => {
        formRef.value.clearValidate('roleName')
    })
}
// 表单校验规则
const formRules = {
    roleName: [
        { required: true, message: '请输入角色名称', trigger: 'blur' },
        { min: 2, message: '角色名称长度最少为2位', trigger: 'blur' },
    ],
}

// 分配权限的回调
const setPermission = async (row: RoleData) => {
    drawer.value = true
    drawerLoading.value = true
    Object.assign(roleObj, row);
    await getAllMenuList(roleObj.id as number).then(resp => {
        if (resp.code == 200) {
            permissionList.value = resp.data
            selectArr.value = filterSelectArr(permissionList.value, [])
            drawerLoading.value = false
        }
    })
}
// 编辑按钮的回调
const editRole = (row: RoleData) => {
    addAndEditDialogVisible.value = true
    Object.assign(roleObj, row)
    nextTick(() => {
        formRef.value.clearValidate('roleName')
    })
}
// 删除按钮的回调
const deleteRole = async (id: number) => {
    await removeRole(id).then(resp => {
        if (resp.code == 200) {
            ElMessage.success('删除成功')
            getRoleList(roleList.value.length > 1 ? pageNum.value : pageNum.value - 1)
        } else ElMessage.error(resp.data)
    })
}

// 对话框确定按钮的回调
const saveRole = async () => {
    await formRef.value.validate()
    await addAndUpdateRole(roleObj).then(resp => {
        if (resp.code == 200) {
            ElMessage.success(roleObj.id ? '更新成功' : '添加成功')
            getRoleList(roleObj.id ? pageNum.value : 1)
            addAndEditDialogVisible.value = false
        } else ElMessage.error(resp.data)
    })
}
// 分配权限用 过滤出四级分类菜单已勾选的数据
const filterSelectArr = (data: any, arr: any) => {
    data.forEach((item: any) => {
        if (item.select && item.level == 4) arr.push(item.id)
        if (item.children && item.children.length > 0) filterSelectArr(item.children, arr)
    });
    return arr
}
// 抽屉确定按钮的回调
const savePermission = async () => {
    let checked = tree.value.getCheckedKeys()
    let halfChecked = tree.value.getHalfCheckedKeys()
    await setPermisstionById((roleObj.id as number), checked.concat(halfChecked)).then(resp => {
        if (resp.code == 200) {
            ElMessage.success('分配成功')
            drawer.value = false
            window.location.reload()
        } else ElMessage.error(resp.data)
    })
}

onMounted(() => {
    getRoleList()
})
</script>