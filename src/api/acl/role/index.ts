// 角色管理模块的接口
import request from "@/utils/request"
import type {
    RoleResponseData,
    RoleData,
    ResponseData,
    MenuResponseData,
} from "./type"

enum API {
    ALLROLE_API = "/admin/acl/role/",
    ADDROLE_URL = "/admin/acl/role/save",
    UPDATE_URL = "/admin/acl/role/update",
    ALLPERMISSION_API = "/admin/acl/permission/toAssign/",
    //给相应的职位分配权限
    SETPERMISTION_URL = "/admin/acl/permission/doAssign/?",
    //删除已有的职位
    REMOVEROLE_URL = "/admin/acl/role/remove/",
}

/**
 * @description 获取全部角色数据
 * @param pagenum 当前页码
 * @param pagesize 每页显示条数
 * @param keywords 搜索关键字
 */
export const getRole = (
    pagenum: number,
    pagesize: number,
    keywords: string,
) => {
    return request.get<any, RoleResponseData>(
        API.ALLROLE_API + `${pagenum}/${pagesize}/?roleName=${keywords}`,
    )
}
/**
 * @description 添加或修改角色，带id是修改
 * @param data 角色有关数据
 */
export const addAndUpdateRole = (data: RoleData) => {
    if (data.id) return request.put<any, ResponseData>(API.UPDATE_URL, data)
    else return request.post<any, ResponseData>(API.ADDROLE_URL, data)
}
/**
 * @description 获取所有权限数据
 * @param roleId 角色的id
 */
export const getAllMenuList = (roleId: number) => {
    return request.get<any, MenuResponseData>(API.ALLPERMISSION_API + roleId)
}
/**
 * @description 给相应的职位下发权限
 * @param roleId 角色id
 * @param permissionId 需要分配的权限的数组
 */
export const setPermisstionById = (roleId: number, permissionId: number[]) => {
    return request.post<any, ResponseData>(
        API.SETPERMISTION_URL + `roleId=${roleId}&permissionId=${permissionId}`,
    )
}
/**
 * @description 根据id删除某个角色
 * @param roleId 角色id
 */
export const removeRole = (roleId: number) => {
    return request.delete<any, ResponseData>(API.REMOVEROLE_URL + roleId)
}
