export interface ResponseData {
    code: number
    message: string
    ok: boolean
}

// 每一个品牌的数据
export interface TradeMark {
    id?: number // 新增的数据没有id所以可选
    tmName: string
    logoUrl: string
}
export type Records = TradeMark[]

// 返回的数据类型
export interface TradeMarkResponseData extends ResponseData {
    data: {
        records: Records
        total: number
        size: number
        current: number
        searchCount: boolean
        pages: number
    }
}
