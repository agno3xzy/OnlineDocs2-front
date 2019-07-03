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
            :options="editorOption"
            @change="onEditorChange($event)">
        </quill-editor>
    </div>
</div>
</template>

<script>
import navmenu from './nav-menu'
import { diff_match_patch } from '../../static/js/diff_match_patch'
import { update } from '../../static/js/DiffToStringArray'
var content, new_content
var cnt = 1
var pos
export default {
    name: 'document-edit',
    data() {
        return {
            docName: '111',
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
        onEditorChange({ editor, html, text }) {
            this.content = html
        },
        timeUpdate() {
            pos = this.$refs.myQuillEditor.quill.selection.savedRange.index
            console.log(pos)
            new_content = this.content
            var dmp = new diff_match_patch();
            var diff = dmp.diff_main(content.replace('<br>',''),new_content.replace('<br>',''));
            console.log(update(diff))
            content = new_content
            this.$refs.myQuillEditor.quill.setSelection(pos)
        }
    },
    mounted() {
        //与后端通讯 获取文件内容
        //axios
        content = this.content
        pos = 0
        this.timer = setInterval(this.timeUpdate,5000)
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