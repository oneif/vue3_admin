// 用户管理模块的接口
import request from "@/utils/request"
import type {
    UserResponseData,
    User,
    ResponseData,
    AllRoleResponseData,
    SetRoleData,
} from "./type"

enum API {
    ALLUSER_URL = "/admin/acl/user/",
    ADDUSER_URL = "/admin/acl/user/save",
    UPDATEUSER_URL = "/admin/acl/user/update",
    ALLROLE_URL = "/admin/acl/user/toAssign/",
    SETROE_URL = "/admin/acl/user/doAssignRole",
    //删除某一个账号
    DELETEUSER_URL = "/admin/acl/user/remove/",
    //批量删除的接口
    DELETEALLUSER_URL = "/admin/acl/user/batchRemove",
}

/**
 * @description 获取用户账号信息
 * @param pagenum 当前页码
 * @param pagesize 显示条数
 * @param keywords 搜索关键字
 */
export const getUser = (
    pagenum: number,
    pagesize: number,
    keywords: string,
) => {
    return request.get<any, UserResponseData>(
        API.ALLUSER_URL + `${pagenum}/${pagesize}/?username=${keywords}`,
    )
}
/**
 * @description 添加或者更新用户
 * @param data 带id是更新，不带id则是添加
 */
export const addAndUpdateUser = (data: User) => {
    if (data.id) return request.put<any, ResponseData>(API.UPDATEUSER_URL, data)
    else return request.post<any, ResponseData>(API.ADDUSER_URL, data)
}
/**
 * @description 获取全部职位以及包含当前用户的已有职位
 * @param userId 用户id
 */
export const getRole = (userid: number) => {
    return request.get<any, AllRoleResponseData>(API.ALLROLE_URL + userid)
}
/**
 * @description 给用户分配角色
 * @param data 用户的id和要分配的角色的数组
 */
export const setUserRole = (data: SetRoleData) => {
    return request.post<any, ResponseData>(API.SETROE_URL, data)
}
/**
 * @description 根据id删除某一个用户
 * @param id 用户的id
 */
export const deleteUser = (id: number) => {
    return request.delete<any, ResponseData>(API.DELETEUSER_URL + id)
}
/**
 * @description 根据id列表删除某一些用户
 * @param id 用户的id列表
 */
export const deleteSomeUser = (idList: number[]) => {
    return request.delete<any, ResponseData>(API.DELETEALLUSER_URL, {
        data: idList,
    })
}
