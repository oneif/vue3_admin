<template>
    <div class="main">
        <el-card>
            <div class="box">
                <img :src="userStore.avatar" class="avater">
                <div class="right">
                    <h3>{{ getTime() }},{{ userStore.username }}</h3>
                    <p>灵犀后台管理系统</p>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import useUserStore from '@/store/modules/user';
import { getTime } from '@/utils/time';

let userStore = useUserStore();
</script>

<style scoped lang="scss">
.main {
    width: 100%;
    height: 100%;
    background: url('../../assets/images/welcome.png') no-repeat center 62%;
    background-size: 70%;

    .box {
        display: flex;

        .avater {
            width: 100px;
            height: 100px;
            border-radius: 50%;
        }

        .right {
            margin-left: 30px;
            margin-top: 14px;
        }
    }

    h3 {
        font-size: 30px;
        font-weight: 900;
        margin-bottom: 30px;
    }

    p {
        color: #9e9e9e;
    }
}
</style>