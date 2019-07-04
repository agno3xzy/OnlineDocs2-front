<template>
<div>
    <navmenu></navmenu>
    <div id="editor">
        <div id="title-group" align="left">
            <i class="el-icon-arrow-left"></i> 
            <span style="margin-left:10px;">{{docName}}</span>
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
import { diff_match_patch } from '../../static/js/diff_match_patch'
import { update,CurentTime,replaceAll } from '../../static/js/DiffToStringArray'
var content, new_content
var cnt = 1
var pos
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
            pos = this.$refs.myQuillEditor.quill.getSelection().index
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