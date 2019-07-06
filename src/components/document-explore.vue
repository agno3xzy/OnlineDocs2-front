<template>
<div>
    <navmenu></navmenu>
    <div id="editor">
        <div id="title-group" align="left">
            <el-button type="text" icon="el-icon-arrow-left" style="font-size:20px;color:black;" @click="toDocumentManage">返回</el-button>
        </div>
        <quill-editor
            v-model="content"
            ref="myQuillEditor"
            :options="editorOption">
        </quill-editor>
    </div>
</div>
</template>

<script>
import navmenu from './nav-menu'
import { CurentTime } from '../../static/js/DiffToStringArray'
export default {
    name: 'document-edit',
    data() {
        return {
            docName: '',
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
            timer: ''
        }
    },
    components: {navmenu},
    methods: {
        timeUpdate() {
            this.$axios(
            {
                url:'/conflictHandle',
                method:"post",
                data:{
                    opList: [],
                    newPath: this.$store.state.doc.newPath,
                    oldPath: this.$store.state.doc.oldPath,
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
            .then(response => {
                this.$refs.myQuillEditor.quill.deleteText(0,this.content.length)
                this.$refs.myQuillEditor.quill.insertText(0,response.data.content)
            });
        },
        toDocumentManage() {
            this.$store.commit('removeFilePath')
            this.$router.push({
                path: '/document-manage'
            })
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
                newPath: this.$store.state.doc.newPath,
                oldPath: this.$store.state.doc.oldPath
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
            this.$refs.myQuillEditor.quill.enable(false)
            this.timer = setInterval(this.timeUpdate,5000)
        });
    },
    beforeDestroy() {
        clearInterval(this.timer)
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
.quill-editor {
    position:absolute;
    left: 25%;
    top: 15%;
    min-height: 200px;
    height: 400px;
    width: 900px;
    min-width: 900px;
}
</style>