// SPU管理模块的接口
import request from "@/utils/request"
import type {
    SpuDataResponseData,
    SpuTrademarkResponseData,
    SpuImgResponseData,
    SpuSaleAttrResponseData,
    AllSaleAttrResponseData,
    SpuData,
    ResponseData,
    SkuData,
    SkuInfoResponseData,
} from "./type"

enum API {
    GETSPU_URL = "/admin/product/",
    ALLTRADEMARK_URL = "/admin/product/baseTrademark/getTrademarkList",
    IMAGE_URL = "/admin/product/spuImageList/",
    SPUSALEATTR_URL = "/admin/product/spuSaleAttrList/",
    ALLSALEATTR_URL = "/admin/product/baseSaleAttrList",
    ADDSPU_URL = "/admin/product/saveSpuInfo",
    UPDATESPU_URL = "/admin/product/updateSpuInfo",
    DELETESPU_URL = "/admin/product/deleteSpu/",
    ADDSKU_URL = "/admin/product/saveSkuInfo",
    SKUINFO_URL = "/admin/product/findBySpuId/",
}

/**
 * @description 获取某一个三级分类下的SPU数据
 * @param page 页码
 * @param limit 显示条数
 * @param category3Id 三级分类Id
 */
export const getSpu = (page: number, limit: number, category3Id: any) => {
    return request.get<any, SpuDataResponseData>(
        API.GETSPU_URL + `${page}/${limit}/?category3Id=${category3Id}`,
    )
}
/**
 * @description 获取全部SPU品牌的数据
 * @param null
 */
export const getAllTrademark = () => {
    return request.get<any, SpuTrademarkResponseData>(API.ALLTRADEMARK_URL)
}
/**
 * @description 获取某个SPU下全部售卖商品的图片数据
 * @param spuId
 */
export const getImage = (spuId: number) => {
    return request.get<any, SpuImgResponseData>(API.IMAGE_URL + spuId)
}
/**
 * @description 获取全部的销售属性[颜色、版本、尺码]
 * @param spuId
 */
export const getAllSaleAttr = () => {
    return request.get<any, AllSaleAttrResponseData>(API.ALLSALEATTR_URL)
}
/**
 * @description 获取某个SPU下全部销售属性
 * @param spuId
 */
export const getSaleAttr = (spuId: number) => {
    return request.get<any, SpuSaleAttrResponseData>(
        API.SPUSALEATTR_URL + spuId,
    )
}
/**
 * @description 添加或者更新spu
 * @param 如果带id就是更新，不带id是添加
 */
export const addOrUpdateSpu = (data: SpuData) => {
    if (data.id) {
        return request.post<any, ResponseData>(API.UPDATESPU_URL, data)
    } else {
        return request.post<any, ResponseData>(API.ADDSPU_URL, data)
    }
}
/**
 * @description 删除Spu
 * @param spuId
 */
export const deleteSpu = (spuId: number) => {
    return request.delete<any, ResponseData>(API.DELETESPU_URL + spuId)
}
/**
 * @description 给已有的spu添加sku
 * @param data 新增sku的数据
 */
export const addSku = (data: SkuData) => {
    return request.post<any, ResponseData>(API.ADDSKU_URL, data)
}
/**
 * @description 获取已有的sku数据
 * @param spuid
 */
export const getSkuInfo = (spuid: number) => {
    return request.get<any, SkuInfoResponseData>(API.SKUINFO_URL + spuid)
}
