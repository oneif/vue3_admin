// 小仓库layout组件相关配置仓库
import { defineStore } from "pinia"
import { ref } from "vue"

const useLayoutSettingStore = defineStore("SettingStore", () => {
    const refresh = ref(false)
    const updateRefresh = () => {
        refresh.value = !refresh.value
    }
    return {
        refresh,
        updateRefresh,
    }
})

export default useLayoutSettingStore
