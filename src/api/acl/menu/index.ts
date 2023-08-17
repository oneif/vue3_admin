import request from "@/utils/request"
import type { PermisstionResponseData, MenuObj, ResponseData } from "./type"

enum API {
    ALLPERMISSTION_URL = "/admin/acl/permission",
    ADDMENU_URL = "/admin/acl/permission/save",
    UPDATE_URL = "/admin/acl/permission/update",
    DELETEMENU_URL = "/admin/acl/permission/remove/",
}

/**
 * @description 获取所有菜单数据
 */
export const getAllPermission = () => {
    return request.get<any, PermisstionResponseData>(API.ALLPERMISSTION_URL)
}
/**
 * @description 添加或者更新，带id是更新，不带id则是添加
 * @param data 添加或者更新的数据
 */
export const addAndUpdatePermission = (data: MenuObj) => {
    if (data.id) return request.put<any, ResponseData>(API.UPDATE_URL, data)
    else return request.post<any, ResponseData>(API.ADDMENU_URL, data)
}
/**
 * @description 根据id删除菜单
 * @param id 菜单的id
 */
export const deleteMenuById = (id: number) => {
    return request.delete<any, ResponseData>(API.DELETEMENU_URL + id)
}
