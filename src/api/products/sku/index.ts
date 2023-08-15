// SKU管理模块的接口
import request from "@/utils/request"
import { SkuResponseData, ResponseData, SkuInfoResponseData } from "./type"
enum API {
    GETSKU_URL = "/admin/product/list/",
    // 上架
    SALE_URL = "/admin/product/cancelSale/",
    // 下架
    CANCELSALE_URL = "/admin/product/cancelSale/",
    SKUINFO_URL = "/admin/product/getSkuInfo/",
    DELETESKU_URL = "/admin/product/deleteSku/",
}
/**
 * @description 获取所有Sku数据
 * @param pagenum 当前的页码
 * @param pagesize 显示多少条
 */
export const getSku = (pagenum: number, pagesize: number) => {
    return request.get<any, SkuResponseData>(
        API.GETSKU_URL + `${pagenum}/${pagesize}`,
    )
}
/**
 * @description 上架商品
 * @param skuId
 */
export const saleSku = (skuId: number) => {
    return request.get<any, ResponseData>(API.SALE_URL + skuId)
}
/**
 * @description 下架商品
 * @param skuId
 */
export const cancelSaleSku = (skuId: number) => {
    return request.get<any, ResponseData>(API.CANCELSALE_URL + skuId)
}
/**
 * @description 获取某一个商品的商品详情
 * @param skuId
 */
export const getSkuInfo = (skuId: number) => {
    return request.get<any, SkuInfoResponseData>(API.SKUINFO_URL + skuId)
}
/**
 * @description 删除某一个已有商品
 * @param skuId
 */
export const deleteSku = (skuId: number) => {
    return request.delete<any, ResponseData>(API.DELETESKU_URL + skuId)
}
