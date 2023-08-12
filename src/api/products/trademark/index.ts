// 品牌管理模块接口
import request from "@/utils/request"
import type { TradeMarkResponseData, TradeMark } from "./type"
enum API {
    TRADEMARK_API = "/admin/product/baseTrademark/",
    ADDTRADEMARK_API = "/admin/product/baseTrademark/save",
    EDITTRADEMARK_API = "/admin/product/baseTrademark/update",
    DELETETRADEMARK_API = "/admin/product/baseTrademark/remove/",
}

/**
 * @description:获取已有品牌的接口
 * @param page:获取第几页
 * @param limit:获取多少条数据
 */
export const getTradeMarkList = (page: number, limit: number) => {
    return request.get<any, TradeMarkResponseData>(
        API.TRADEMARK_API + `${page}/${limit}`,
    )
}
/**
 * @description:添加与修改品牌接口
 * @param TradeMark:品牌的数据
 */
export const AddAndEditTradeMark = (data: TradeMark) => {
    if (data.id) return request.put<any, any>(API.EDITTRADEMARK_API, data)
    else return request.post<any, any>(API.ADDTRADEMARK_API, data)
}
/**
 * @description:删除品牌接口
 * @param id:要删除的品牌的id
 */
export const deleteTrademark = (id: number) => {
    return request.delete<any, any>(API.DELETETRADEMARK_API + id)
}
