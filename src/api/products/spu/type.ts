import type { TradeMark } from "../trademark/type"
export interface ResponseData {
    code: number
    message: string
    ok: boolean
}

// SPU的数据类型
export interface SpuData {
    category3Id: number | undefined
    id?: number
    spuName: string
    tmId: number | undefined
    description: string
    // Spu图片
    spuImageList: null | SpuImg[]
    // Spu销售属性
    spuSaleAttrList: null | SpuSaleAttr[]
    saleAttrValueName?: string
}
// 包含所有的SPU数据
export type Records = SpuData[]
// 获取已有SPU接口返回的数据
export interface SpuDataResponseData extends ResponseData {
    data: {
        records: Records
        total: number
        size: number
        current: number
        searchCount: boolean
        pages: number
    }
}
// 品牌接口返回数据的ts类型
export interface SpuTrademarkResponseData extends ResponseData {
    data: TradeMark[]
}

// 商品图片的ts类型
export interface SpuImg {
    id?: number
    imgName?: string
    imgUrl?: string
    createTime?: string
    updateTime?: string
    spuId?: number
    name?: string
    url?: string
}
//已有的spu的照片墙的数据类型
export interface SpuImgResponseData extends ResponseData {
    data: SpuImg[]
}

// 所有的销售属性返回类型
export interface SaleAttrList {
    id: number
    name: string
}
export interface AllSaleAttrResponseData extends ResponseData {
    data: SaleAttrList[]
}

// spu销售属性值ts类型
export interface SpuSaleAttrValue {
    id?: number
    spuId?: number
    baseSaleAttrId: number
    saleAttrValueName: string
    saleAttrName?: string
    isChecked?: null
}
// 存储销售属性值的数组的ts类型
export type SpuSaleAttrValueList = SpuSaleAttrValue[]
// spu销售属性ts类型
export interface SpuSaleAttr {
    id?: number
    createTime?: null
    updateTime?: null
    spuId?: number
    baseSaleAttrId: number | undefined
    saleAttrName: string
    spuSaleAttrValueList: SpuSaleAttrValueList
    flag?: boolean
    saleAttrValue?: string
    saleIdAndValueId?: string
}
// spu销售属性接口返回的数据类型
export interface SpuSaleAttrResponseData extends ResponseData {
    data: SpuSaleAttr[]
}

export interface Attr {
    attrId: number //平台属性的ID
    valueId: number //属性值的ID
}
export interface saleArr {
    saleAttrId: number //属性ID
    saleAttrValueId: number //属性值的ID
}
export interface SkuData {
    category3Id: number | undefined //三级分类的ID
    spuId: number | undefined //已有的SPU的ID
    tmId: number | undefined //SPU品牌的ID
    skuName: string //sku名字
    price: number | undefined //sku价格
    weight: number | undefined //sku重量
    skuDesc: string //sku的描述
    skuAttrValueList?: Attr[]
    skuSaleAttrValueList?: saleArr[]
    skuDefaultImg: string //sku图片地址
}

//获取SKU数据接口的ts类型
export interface SkuInfoResponseData extends ResponseData {
    data: SkuData[]
}
