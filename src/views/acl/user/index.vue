<template>
    <div>
        <el-card style="height: 76px;">
            <el-form inline>
                <el-form-item label="用户名：">
                    <el-input placeholder="请输入用户姓名" v-model="keywords"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button color="#673ab7" @click="searchUser" :disabled="!keywords">
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
            <el-button color="#4527a0" @click="addUser">
                <SvgIcon :iconName="'plus'" :color="'white'" />添加用户
            </el-button>
            <el-button size="default" color="#dd191d" :disabled="!deleteUserIdArr.length" @click="deleteUsers">
                <SvgIcon :iconName="'delete'" :color="'white'" :width="'18px'" :height="'18px'" />批量删除
            </el-button>
            <el-table :data="userArr" style="margin: 10px 0px;" border @selection-change="selectionchange"
                v-loading="loading" element-loading-text="正在加载中，请稍候...">
                <el-table-column type="selection" align="center"></el-table-column>
                <el-table-column label="#" align="center" type="index"></el-table-column>
                <el-table-column label="ID" align="center" prop="id"></el-table-column>
                <el-table-column label="用户姓名" align="center" prop="username" show-overflow-tooltip></el-table-column>
                <el-table-column label="用户昵称" align="center" prop="name" show-overflow-tooltip></el-table-column>
                <el-table-column label="用户角色" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
                <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
                <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" width="300px" align="center">
                    <template #="{ row }">
                        <el-button @click="setRole(row)" color="#673ab7" size="small">
                            <SvgIcon :iconName="'user_2'" :color="'white'" style="margin-right: 3px;" />分配角色
                        </el-button>
                        <el-button @click="updateUser(row)" color="#3f51b5" size="small">
                            <SvgIcon :iconName="'edit'" :color="'white'" style="margin-right: 3px;" />编辑
                        </el-button>

                        <el-popconfirm width="280" confirm-button-text="删除" confirm-button-type="danger"
                            @confirm="deleteUserById(row.id)" cancel-button-text="取消" :icon="Delete" icon-color='#e75e61'
                            :title="`确定要删除 ${row.username} 吗？`">
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
            <el-pagination v-model:current-page="pageNum" v-model:page-size="pageLimt" :page-sizes="[5, 10, 15, 30]"
                @current-change="getUserInfo" @size-change="getUserInfo" layout="total, sizes, prev, pager, next, jumper"
                :total="total" />
        </el-card>


        <!-- 添加和修改用户对话框 -->
        <el-dialog v-model="addAndEditDialogVisible" :title="userObj.id ? '修改用户' : '添加用户'" style="width: 700px;">
            <el-form :model="userObj" :rules="formRules" ref="formRef">
                <el-form-item label="用户姓名" label-width="100px" prop="username">
                    <el-input placeholder="请输入用户名字" style="width: 200px;" v-model="userObj.username" />
                </el-form-item>
                <el-form-item label="用户昵称" label-width="100px" prop="name">
                    <el-input placeholder="请输入用户昵称" style="width: 200px;" v-model="userObj.name" />
                </el-form-item>
                <el-form-item v-show="!userObj.id" label="用户密码" label-width="100px" prop="password">
                    <el-input placeholder="请输入用户密码" type="password" show-password v-model="userObj.password"
                        style="width: 200px;" />
                </el-form-item>

            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button color="#4527a0" @click="addOrUpdateUser">
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

        <!-- 分配角色对话框 -->
        <el-dialog v-model="roleDialogVisible" title="分配用户角色" style="width: 700px;" draggable>
            <el-form :model="userObj" rules="formRules" ref="formRef" v-loading="roleLoading"
                element-loading-text="正在加载中，请稍候...">
                <el-form-item label="用户姓名" label-width="100px" prop="username">
                    <el-input style="width: 200px;" v-model="userObj.username" disabled />
                </el-form-item>
                <el-form-item label="职位列表" label-width="100px">
                    <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate"
                        @change="handleCheckAllChange">全选</el-checkbox>&nbsp;&nbsp;&nbsp;&nbsp;
                    <el-checkbox-group v-model="userRoles" @change="handleCheckedRolesChange">
                        <el-checkbox v-for="(item, index) in allRolesList" :key="index" :label="item">
                            {{ item.roleName }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button color="#4527a0" @click="saveRole">
                        <SvgIcon :iconName="'confirm'" :color="'#dcdfe6'" style="margin-right: 6px;" />
                        确定
                    </el-button>
                    <el-button color="#dd191d" @click="roleDialogVisible = false">
                        <SvgIcon :iconName="'cancel'" :color="'white'" style="margin-right: 6px;" />
                        取消
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus';
import { Delete } from '@element-plus/icons-vue'
import { addAndUpdateUser, getUser, getRole, setUserRole, deleteUser, deleteSomeUser } from '@/api/acl/user'
import type { Records, User, AllRole, SetRoleData } from '@/api/acl/user/type';
import useLayoutSettingStore from '@/store/modules/setting'

let settingStore = useLayoutSettingStore()

let loading = ref<boolean>(false)
let roleLoading = ref<boolean>(false)
let addAndEditDialogVisible = ref<boolean>(false)
let roleDialogVisible = ref<boolean>(false)
let formRef = ref()

let pageNum = ref<number>(1)
let pageLimt = ref<number>(5)
let total = ref<number>(0)

let userArr = ref<Records>([])
let userObj = reactive<User>({
    username: '',
    name: '',
    password: '',
})
let allRolesList = ref<AllRole>([])
let userRoles = ref<AllRole>([])
const checkAll = ref<boolean>(false)
const isIndeterminate = ref<boolean>(true)
let deleteUserIdArr = ref<number[]>([])
let keywords = ref<string>('')

const getUserInfo = async (page = 1) => {
    loading.value = true
    pageNum.value = page
    await getUser(pageNum.value, pageLimt.value, keywords.value).then(resp => {
        if (resp.code == 200) {
            userArr.value = resp.data.records
            total.value = resp.data.total
        }
    })
    loading.value = false

}

// 搜索用户
const searchUser = () => {
    getUserInfo()
    keywords.value = ''
}
// 重置
const reset = () => {
    settingStore.refresh = !settingStore.refresh
}

// 表单校验规则
const formRules = {
    username: [
        { required: true, message: '请输入用户名字', trigger: 'blur' },
        { min: 5, message: '用户名字长度最少为5位', trigger: 'blur' },
    ],
    name: [
        { required: true, message: '请输入用户昵称', trigger: 'blur' },
        { min: 5, message: '用户昵称长度最少为5位', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度最少为6位', trigger: 'blur' },
    ],
}

// 添加用户的回调
const addUser = () => {
    Object.assign(userObj, {
        id: undefined,
        name: '',
        username: '',
        password: '',
    })
    addAndEditDialogVisible.value = true
    nextTick(() => {
        formRef.value.clearValidate(['username', 'name', 'password'])
    })
}
// 批量删除的回调
const deleteUsers = async () => {
    let idsList: any = deleteUserIdArr.value.map((item: any) => {
        return item.id;
    });
    await deleteSomeUser(idsList).then(resp => {
        if (resp.code == 200) {
            ElMessage.success('删除成功')
            getUserInfo(userArr.value.length > 1 ? pageNum.value : pageNum.value - 1)
        } else ElMessage.error(resp.data)
    })
}

// 分配角色
const setRole = async (row: User) => {
    roleDialogVisible.value = true
    roleLoading.value = true
    Object.assign(userObj, row)
    await getRole(row.id as number).then(resp => {
        if (resp.code == 200) {
            roleLoading.value = false
            allRolesList.value = resp.data.allRolesList
            userRoles.value = resp.data.assignRoles


        }

    })

}
// 分配角色保存
const saveRole = async () => {
    let data: SetRoleData = {
        userId: userObj.id as number,
        roleIdList: userRoles.value.map(item => item.id as number)
    }
    await setUserRole(data).then(resp => {
        if (resp.code == 200) {
            ElMessage.success('分配职位成功')
            roleDialogVisible.value = false
            getUserInfo(pageNum.value)
        } else ElMessage.error(resp.message)

    })
}

// 编辑用户的回调
const updateUser = (row: User) => {
    addAndEditDialogVisible.value = true
    Object.assign(userObj, row)
    nextTick(() => {
        formRef.value.clearValidate(['username', 'name'])
    })
}
// 删除用户
const deleteUserById = async (id: number) => {
    await deleteUser(id).then(resp => {
        if (resp.code == 200) {
            ElMessage.success('删除成功')
            getUserInfo(userArr.value.length > 1 ? pageNum.value : pageNum.value - 1)
        } else ElMessage.error(resp.data)
    })
}

// 添加和修改用户对话框确定按钮的回调
const addOrUpdateUser = async () => {
    await formRef.value.validate()
    await addAndUpdateUser(userObj).then(resp => {
        if (resp.code == 200) {
            getUserInfo(userObj.id ? pageNum.value : 1)
            ElMessage.success(userObj.id ? '更新成功' : '添加成功');
            addAndEditDialogVisible.value = false
        } else {
            ElMessage.error(userObj.id ? '更新失败' : '添加失败');
            addAndEditDialogVisible.value = false
        }
    })

}

// 复选框的全选与全不选
const handleCheckAllChange = (value: boolean) => {
    userRoles.value = value ? allRolesList.value : [];
    isIndeterminate.value = false
}
const handleCheckedRolesChange = (value: string[]) => {
    const checkedCount = value.length
    checkAll.value = checkedCount === allRolesList.value.length;
    //不确定的样式
    isIndeterminate.value = checkedCount > 0 && checkedCount < allRolesList.value.length
}

// table复选框勾选时触发的事件
const selectionchange = (value: any) => {
    deleteUserIdArr.value = value
}
onMounted(() => {
    getUserInfo()
})
</script>

<style scoped></style>