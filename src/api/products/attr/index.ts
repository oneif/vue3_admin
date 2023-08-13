// 商品属性相关的API
import request from "@/utils/request"
import type {
    CategoryResponseData,
    AttrResponseData,
    AttrObj,
    ResponseData,
} from "./type"

enum API {
    GETCATEGOTY1_URL = "/admin/product/getCategory1",
    GETCATEGOTY2_URL = "/admin/product/getCategory2/",
    GETCATEGOTY3_URL = "/admin/product/getCategory3/",
    ATTR_URL = "/admin/product/attrInfoList/",
    ADDORUPDATE_URL = "/admin/product/saveAttrInfo",
    DELETEATTR_URL = "/admin/product/deleteAttr/",
}
/**
 * @description:获取商品一级分类
 * @param:null
 */
export const getCategory1 = () => {
    return request.get<any, CategoryResponseData>(API.GETCATEGOTY1_URL)
}
/**
 * @description:获取商品二级分类
 * @param:一级分类id
 */
export const getCategory2 = (category1_id: any) => {
    return request.get<any, CategoryResponseData>(
        API.GETCATEGOTY2_URL + category1_id,
    )
}
/**
 * @description:获取商品三级分类
 * @param:二级分类id
 */
export const getCategory3 = (category2_id: any) => {
    return request.get<any, CategoryResponseData>(
        API.GETCATEGOTY3_URL + category2_id,
    )
}
/**
 * @description:根据分类获取商品属性
 * @param:一级分类id,二级分类id,san级分类id
 */
export const getAttr = (
    category1_id: any,
    category2_id: any,
    category3_id: any,
) => {
    return request.get<any, AttrResponseData>(
        API.ATTR_URL + `${category1_id}/${category2_id}/${category3_id}`,
    )
}
/**
 * @description:新增或修改已有的属性接口
 * @param:没有id新增，有id修改
 */
export const addOrUpdateAttr = (data: AttrObj) => {
    return request.post<any, ResponseData>(API.ADDORUPDATE_URL, data)
}
/**
 * @description:删除已有属性接口
 * @param:attrid
 */
export const removeAttr = (attrid: number) => {
    return request.delete<any, ResponseData>(API.DELETEATTR_URL + attrid)
}
