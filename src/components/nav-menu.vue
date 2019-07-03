<template>
<div>
    <div id="menu">
        <div id="app_title">OnlineDocs</div>
        <el-input
            placeholder="请输入内容"
            v-model="searchValue"
            size="medium"
            style="width: 12%;position:absolute;left:75%;top:15px;">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <div id="my">
            <el-dropdown size="medium" @command="handleCommand">
                <span class="iconfont icon-user" style="font-size:25px;"></span>
                <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>欢迎回来, {{username}}</el-dropdown-item>
                <el-dropdown-item divided>我的</el-dropdown-item>
                <el-dropdown-item>修改密码</el-dropdown-item>
                <el-dropdown-item divided command="logout">注销</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</div>
</template>

<script>
import '../assets/myicon/iconfont.css'
export default {
    name: 'nav-menu',
    data() {
        return {
            username: window.sessionStorage.username,
            searchValue: ''
        }
    },
    methods: {
        handleCommand(command) {
            if(command === 'logout')
            {
                window.sessionStorage.removeItem('username')
                this.$router.push({
                    path: '/'
                })
            }
        }
    }
}
</script>

<style scoped>
#app_title {
    position: absolute;
    top: 15px;
    left: 30px;
    font-size: 25px;
}
#my {
    position: absolute;
    left: 95%;
    top: 20px;
}
#menu {
    position: absolute;
    left: 0;
    top: 0;
    background-color: white;
    height: 60px;
    width: 100%;
    min-width: 1300px;
}

</style>