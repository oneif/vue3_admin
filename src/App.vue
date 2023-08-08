<template>
	<div id="app">
		<h2>oplaile</h2>

	</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import request from '@/utils/request'
onMounted(() => {
	request.get('/admin/acl/permission').then((res) => {
		console.log(res)
	})
})
</script>

<style scoped lang="scss">
h2 {
	color: $color;
}
</style>
