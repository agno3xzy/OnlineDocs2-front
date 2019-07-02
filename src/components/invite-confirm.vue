<template>
    <div>
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
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'invite-confirm',
    data() {
        return {
            login: {
                username: '',
                password: ''
            }
        }
    },
    mounted() {
        //消息返回为true弹出消息 消息为false转为404
        this.$axios(
        {
            url:'/invite/checkDocId',
            method:"post",
            data:{
                docId: this.$route.params.docId
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
            //如果报错也跳转404
            this.$router.push({
                path: '/404'
            })
        })
        .then(response => {
            if(response.data.message === 'true')
            {
                this.$message({
                    message: "请登陆以接受邀请",
                    type: "success",
                    duration: 0,
                    showClose: true
                })
            } else
            {
                this.$router.push({
                    path: '/404'
                })
            }
        });
    },
    methods: {
        submitForm() {
            this.$axios(
            {
                url:'/invite/checkUser',
                method:"post",
                data:{
                    docId: this.$route.params.docId
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
                //如果报错也跳转404
                this.$router.push({
                    path: '/404'
                })
            })
            .then(response => {
                if(response.data.message === 'userError')
                {
                    this.$message({
                        message: '用户名或密码错误',
                        type: 'error',
                        duration: 2000
                    })
                }
            });
        }
    }
    
}
</script>

<style scoped>
.header {
    font-size:40px;
    font-weight: bold;
    margin-top:200px;
}
.main {
    margin-top:50px;
}
</style>