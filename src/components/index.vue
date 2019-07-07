<template>
    <div>
        <div>
            <div class="loginimg"></div>
            <div class="header" align="center">
                OnlineDocs
            </div>
            <div class="main" align="center">
                <el-form ref="login" :model="login" style="width:250px;margin-top:20px;">
                    <el-form-item>
                        <el-input v-model="login.username" placeholder="用户名" required=true></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="login.password" placeholder="密码" type="password" required=true></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" style="width:150px;margin-top:15px;" @click="submitForm">登录</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="text" @click="toRegister" style="margin-top:-10px;">没有账号？马上注册</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'index',
    data() {
        return {
            login: {
                username: '',
                password: ''
            },
        }
    },
    methods: {
        submitForm() {
            this.$axios(
                {
                    url:'/login',
                    method:"post",
                    data:{
                        username: this.login.username,
                        password: this.login.password,
                    },
                    transformRequest: [function (data) {
                    // Do whatever you want to transform the data
                    let ret = ''
                    for (let it in data) {
                    // 如果要发送中文 编码 
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                    }
                    return ret
                    }],
                    headers: {
                        'Content-Type':'application/x-www-form-urlencoded'
                    }
                }).catch(error => {
                    console.log(error.message);
                })
                .then(response => {
                    if(response.data.isValidate === 'true')
                    {
                        window.sessionStorage.setItem('username', this.login.username) //存储用户名
                        this.$router.push({
                            path: '/document-manage'
                        })
                    } else
                    {
                        this.$message({
                            message: '用户名或密码错误',
                            type: 'error',
                            duration: 2000
                        })
                    }
                });
        },
        toRegister() {
            this.$router.push({
                path: '/register'
            })
        }
    },
    mounted() {
        document.body.removeChild(document.getElementById('loading'))
    }
}
</script>

<style scoped>
.loginimg {
    background: url('../../static/image/login.png');
    background-size: 100% 100%;
    height: 100%;
    position: fixed;
    width: 100%;
    min-width: 1400px;
    min-height: 800px;
    filter:contrast(70%);
    opacity: 0;
    animation: fadeIn 1s ease 0s 1;
    animation-fill-mode: forwards;
}
.header {
    position: absolute;
    font-size:40px;
    font-weight: bold;
    left: 50%;
    top: 25%;
    opacity: 0;
    transform: translate(-50%, -25%);
    animation: fadeIn 2s ease 0.5s 1;
    animation-fill-mode: forwards;
}
.main {
    position: absolute;
    left: 50%;
    top: 45%;
    opacity: 0;
    transform: translate(-50%, -30%);
    animation: fadeIn 2s ease 1;
    animation: fadeIn 2s ease 1s 1;
    animation-fill-mode: forwards;

}
@keyframes fadeIn
{
    from {opacity: 0;}
    to {opacity: 1;}
}
@-moz-keyframes fadeIn
{
    from {opacity: 0;}
    to {opacity: 1;}
}   
@-webkit-keyframes fadeIn
{
    from {opacity: 0;}
    to {opacity: 1;}
}
@-o-keyframes fadeIn
{
    from {opacity: 0;}
    to {opacity: 1;}
}
</style>