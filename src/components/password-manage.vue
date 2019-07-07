<template>
<div>
    <backgroundimg></backgroundimg>
    <div id="change-form">
        <el-button type="text" icon="el-icon-arrow-left" style="font-size:20px;color:black;margin-left:20px;" @click="changePassword">返回</el-button>
        <el-form :model="form" label-position="right" ref="userForm" size="mini" :rules="rule" label-width="80px">
            <el-form-item label="旧密码" prop="oldPassword">
                <el-input v-model="form.username" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input type="password" v-model="form.password" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
                <el-input type="password" v-model="form.confirmPassword" size="mini"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" round @click="changePassword" style="width:150px;margin-top:10px;">确认修改</el-button>
            </el-form-item>
        </el-form>`
    </div>
</div>
</template>

<script>
import backgroundimg from './background-img'
export default {
    data() {
        return {
            form: {
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            }
        }
    },
    components: {backgroundimg},
    methods: {
        changePassword() {
            
        }
    }
}
</script>

<style scoped>
@import '../../static/css/keyframe.css';
#change-form {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    width: 400px;
    background-color: rgba(245,245,245,0.6);
    border-radius: 5px;
    opacity: 0;
    animation: fadeIn 1s ease 0.5s 1;
    animation-fill-mode: forwards;
}
</style>