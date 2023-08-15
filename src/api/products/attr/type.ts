export interface ResponseData {
    code: number
    message: string
    ok: boolean
}

export interface CategoryObj {
    id: number
    name: string
    category1Id?: number
    category2Id?: number
}

// 分类接口返回的数据类型
export interface CategoryResponseData extends ResponseData {
    data: CategoryObj[]
}

// 属性值对象的类型
export interface AttrValue {
    id?: number
    valueName: string
    attrId?: number
    flag?: boolean
}
// 存储属性值的数组的类型
export type AttrValueList = AttrValue[]
// 存储属性对象的类型
export interface AttrObj {
    id?: number
    attrName: string
    categoryId?: number
    categoryLevel: number
    attrValueList: AttrValueList
    attrIdAndValueId?: string
}
export type AttrObjList = AttrObj[]
// 属性接口返回的数据类型
export interface AttrResponseData extends ResponseData {
    data: AttrObj[]
}
