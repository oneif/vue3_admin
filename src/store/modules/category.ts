// 全局组件商品分类的仓库
import { defineStore } from "pinia"
import { ref } from "vue"
import { getCategory1, getCategory2, getCategory3 } from "@/api/products/attr"
import type { CategoryObj } from "@/api/products/attr/type"

let useCategoryStore = defineStore("Category", () => {
    let category1Arr = ref<CategoryObj[]>([])
    let category1Id = ref<number>()
    let category2Arr = ref<CategoryObj[]>([])
    let category2Id = ref<number>()
    let category3Arr = ref<CategoryObj[]>([])
    let category3Id = ref<number>()

    // 获取一级分类的方法
    const getCategoryList1 = async () => {
        await getCategory1().then((resp) => {
            if (resp.code == 200) {
                category1Arr.value = resp.data
            }
        })
    }
    const getCategoryList2 = async () => {
        await getCategory2(category1Id.value).then((resp) => {
            if (resp.code == 200) {
                category2Arr.value = resp.data
            }
        })
    }
    const getCategoryList3 = async () => {
        await getCategory3(category2Id.value).then((resp) => {
            if (resp.code == 200) {
                category3Arr.value = resp.data
            }
        })
    }
    return {
        getCategoryList1,
        getCategoryList2,
        getCategoryList3,
        category1Arr,
        category1Id,
        category2Arr,
        category2Id,
        category3Arr,
        category3Id,
    }
})

export default useCategoryStore
