export interface ResponseData {
    code: number
    message: string
    ok: boolean
    data: any
}
export interface Attr {
    attrId: number //平台属性的ID
    valueId: number //属性值的ID
    id?: number
    valueName?: string
}
export interface saleArr {
    saleAttrId: number //属性ID
    saleAttrValueId: number //属性值的ID
    id?: number
    saleAttrValueName?: string
}
export interface SkuData {
    category3Id?: number //三级分类的ID
    spuId?: number //已有的SPU的ID
    tmId?: number //SPU品牌的ID
    skuName?: string //sku名字
    price?: number //sku价格
    weight?: number //sku重量
    skuDesc?: string //sku的描述
    skuAttrValueList?: Attr[]
    skuSaleAttrValueList?: saleArr[]
    skuDefaultImg?: string //sku图片地址
    id?: number
    skuImageList?: any
}

export interface SkuResponseData extends ResponseData {
    data: {
        records: SkuData[]
        total: number
        size: number
        current: number
        orders: []
        optimizeCountSql: boolean
        hitCount: boolean
        countId: null
        maxLimit: null
        searchCount: boolean
        pages: number
    }
}

export interface SkuInfoResponseData extends ResponseData {
    data: SkuData
}
