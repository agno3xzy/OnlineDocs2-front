<template>
<div>
    <navmenu></navmenu>
    <div id="editor">
        <quill-editor
            :content="content"
            :options="editorOption"
            @change="onEditorChange($event)">
        </quill-editor>
    </div>
</div>
</template>

<script>
import navmenu from './nav-menu'
import { diff_match_patch} from '../../static/js/diff_match_patch'
import { update } from '../../static/js/DiffToStringArray'
var content, new_content
export default {
    name: 'document-edit',
    data() {
        return {
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
            new_content = this.content
            var dmp = new diff_match_patch()
            var diff = dmp.diff_main(content.replace('<br>',''),new_content.replace('<br>',''))
            console.log(diff)
            content = new_content
        }
    },
    mounted() {
        //与后端通讯 获取文件内容
        //axios
        content = this.content
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
    top: 80px;
    bottom: 0;
    right: 0;
    background-color: #F7F7F7;
}
.quill-editor {
    position:absolute;
    left: 400px;
    top: 100px;
    min-height: 200px;
    height: 400px;
    width: 900px;
}
</style>