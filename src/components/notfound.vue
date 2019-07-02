<template>
<div>
    <h2>抱歉，您输入的地址没有找到</h2>
    <h3>o(╥﹏╥)o</h3>
    <el-button type="text" @click="goLogin">点击返回主页</el-button>

</div>
</template>

<script>
export default {
    name: 'notfound',
    data() {
        return {

        }
    },
    methods: {
        goLogin() {
            this.$router.push({
                path: '/'
            })
        }
    }
}
</script>
<style scoped>

</style>