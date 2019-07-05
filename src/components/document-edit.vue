<template>
<div>
    <navmenu></navmenu>
    <div id="editor">
        <div id="title-group" align="left">
            <el-button type="text" icon="el-icon-arrow-left" style="font-size:20px;color:black;" @click="toDocumentManage">返回</el-button>
            <el-tag style="margin-left:30px;">文档：{{docName}}</el-tag>
            <el-tag type="success" style="margin-left:10px;">文档所有者：{{docOwner}}</el-tag>
            <el-tag type="warning" style="margin-left:10px;">共享成员：{{userString}}</el-tag>
        </div>
        <quill-editor
            v-model="content"
            ref="myQuillEditor"
            :options="editorOption">
        </quill-editor>
        <div id="button-group" align="right">
            <el-button type="success" @click="saveFile" size="medium">保存<span class="iconfont icon-save" style="font-size:10px;margin-left:5px;"></span></el-button>
            <el-button type="primary" @click="showShareDialog" size="medium">分享<span class="iconfont icon-share" style="font-size:10px;margin-left:5px;"></span></el-button>
        </div>
    </div>
    <el-dialog
        title="邀请成员"
        :visible.sync="shareDialogVisible"
        width="700px"
        @close="closeShareDialog">
        <div id="shareType" style="margin-bottom:10px;">
            请选择要分享的权限类型
            <el-radio-group v-model="shareType" size="small" style="margin-left:20px;">
                <el-radio-button label="编辑"></el-radio-button>
                <el-radio-button label="查看"></el-radio-button>
            </el-radio-group>     
        </div>
        <div id="userInputList" style="margin-top:25px;">
            <div v-for="(item,i) of userList" v-bind:key="'user'+i" style="margin-bottom:10px;margin-top:15px;">
                <el-select v-model="userList[i]" filterable placeholder="请选择">
                    <el-option
                    v-for="item in userOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                  <el-button type="danger" @click="deleteUser(i)" size="medium" style="margin-left:25px;">删除</el-button>
            </div>
        </div>
        <el-button type="primary" @click="addNewUser" size="medium" style="margin-top:10px;">新增</el-button>
        <span slot="footer" class="dialog-footer">
            <el-button type="success" @click="shareFile">生成链接</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
import '../assets/myicon/iconfont.css'
import navmenu from './nav-menu'
import { diff_match_patch } from '../../static/js/diff_match_patch'
import { update,CurentTime,replaceAll } from '../../static/js/DiffToStringArray'
import { setTimeout, clearTimeout } from 'timers';
var content, new_content
var cnt = 1
var pos
export default {
    name: 'document-edit',
    data() {
        return {
            docName: '',
            docID: '',
            docOwner: '',
            userString: '', //共享成员的字符串
            content: '',
            editorOption: { 
                placeholder: "输入任何内容，支持html",
                modules: {  
                    toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'indent': '-1' }, { 'indent': '+1' }],
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    [{ 'font': [] }],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'align': [] }],
                    ]
                }
            },
            timer: '',
            shareDialogVisible: false,
            shareType: '编辑',
            shareLink: '',
            userList: [], //这次邀请人员的数组
            userOptions: [] //所有可以邀请的人员选项
        }
    },
    components: {navmenu},
    methods: {
        toDocumentManage() {
            this.$router.push({
                path: '/document-manage'
            })
        },
        timeUpdate() {
            pos = this.$refs.myQuillEditor.quill.selection.savedRange.index
            new_content = this.content
            console.log('比较时:')
            console.log('content:',content)
            console.log('new_content:',new_content)
            var dmp = new diff_match_patch();
            var diff = dmp.diff_main(replaceAll(content,'<br>'),replaceAll(new_content,'<br>'));
            var opList = (update(diff))
            console.log(opList)
            console.log("diff:",diff)
            this.$axios(
            {
                url:'/conflictHandle',
                method:"post",
                data:{
                    opList: opList,
                    newPath: this.$route.query.newPath,
                    oldPath: this.$route.query.oldPath,
                    username: window.sessionStorage.username,
                    timeStamp: CurentTime()
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
            .then(async response => {
                // this.content = response.data.content
                // content = new_content
                await this.changeData(response.data.content)
                this.$refs.myQuillEditor.quill.setSelection(pos)
                this.timer = setTimeout(this.timeUpdate,3000)
            });
        },
        async changeData(response_content)
        {
            this.$refs.myQuillEditor.quill.deleteText(0,this.content.length)
            this.$refs.myQuillEditor.quill.insertText(0,response_content)
            // console.log('改变前:')
            // console.log('content:',content)
            // console.log('new_content:',new_content)
            content = new_content
            // console.log('改变后:')
            // console.log('content:',content)
            // console.log('new_content:',new_content)
        },
        saveFile() {
            this.$axios(
            {
                url:'/version-manage/add',
                method:"post",
                data:{
                    username: window.sessionStorage.username,
                    filepath: this.$route.query.oldPath
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
                if(response.data.message === 'success')
                {
                    this.$message({
                        message: '保存成功',
                        type: 'success',
                        duration: 2000
                    }) 
                } else if(response.data.message === 'fail')
                {
                    this.$message({
                        message: '保存失败',
                        type: 'error',
                        duration: 2000
                    })
                }
            })
        },
        showShareDialog() {
            for(var i = this.userList.length-1; i >= 0; i--)
            {
                this.$delete(this.userList,i)
            }
            this.userList.push('') //放空的一个进去
            this.$axios(
            {
                url:'/share/send',
                method:"post",
                data:{
                    username: window.sessionStorage.username,
                    docName: this.docName + '.txt'
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
                for(var i = 0; i < response.data.usernameList.length; i++)
                {
                    this.userOptions.push({label:response.data.usernameList[i],value:response.data.usernameList[i]})
                }
                return (response)
            });
            this.shareDialogVisible = true
        },
        closeShareDialog() {
            for(var i = this.userOptions.length-1; i >= 0; i--)
            {
                this.$delete(this.userOptions,i)
            }
        },
        addNewUser() {
            this.userList.push('')
        },
        deleteUser(index) {
            this.$delete(this.userList,index)
        },
        shareFile() {
            var auth = ''
            if(this.shareType === '编辑')
            {
                auth = 'share'
            } else if(this.shareType === '查看')
            {
                auth = 'read'
            }
            //与后端交互分享文件
            this.$axios(
            {
                url:'/shareInfo',
                method:"post",
                data:{
                    userList: this.userList,
                    authority: auth,
                    docName: this.docName+'.txt'
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
                this.$message.error('生成失败')
            })
            .then(response => {
                this.shareLink = 'http://localhost:8082/#/inviteConfirm/' + this.docID + '/' + auth
                this.$copyText(this.shareLink).then(()=> {
                this.$message({
                    message: '生成链接成功，已复制到您的剪切板上',
                    type: 'success'
                })
                },()=> {
                    //复制失败的处理
                })
            });
            this.shareDialogVisible = false
        }
    },
    mounted() {
        //与后端通讯 获取文件内容
        //axios
        this.$axios(
        {
            url:'/edit',
            method:"post",
            data:{
                oldPath: this.$route.query.oldPath,
                newPath: this.$route.query.newPath
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
            //this.content = response.data.content
            this.$refs.myQuillEditor.quill.insertText(0,response.data.content)
            content = this.content
            pos = 0
            this.docName = response.data.docName.replace('.txt','')
            this.docID = response.data.docID
            this.docOwner = response.data.docOwner
            var userString = ''
            for(var i = 0; i < response.data.docSharer.length; i++)
            {
                userString = userString + response.data.docSharer[i] + ' '
            }
            if(userString === '')
            {
                this.userString = '无'
            } else
            {
                this.userString = userString
            }
            this.timer = setTimeout(this.timeUpdate,3000)
        });
    },
    beforeDestroy() {
        console.log('销毁')
        clearTimeout(this.timer)
    }
}
</script>

<style scoped>
#editor{
    position: absolute;
    left: 0;
    top: 60px;
    bottom: 0;
    right: 0;
    background-color: #F7F7F7;
}
#title-group {
    position: relative;
    top: 20px;
    left: 20px;
}
#button-group {
    position: relative;
    top: 20px;
    right: 5%;
}
.quill-editor {
    position:absolute;
    left: 25%;
    top: 20%;
    min-height: 200px;
    height: 400px;
    width: 900px;
    min-width: 900px;
}
.errorMessage {
    position: absolute;
    color:red;
    left:10%;
}
</style>