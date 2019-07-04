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
export default {
    name: 'document-history',
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
        }
    },
    mounted() {
        this.$refs.myQuillEditor.quill.enable(false)
    },
    components: { navmenu }
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
    left: 35%;
    top: 15%;
    min-height: 200px;
    height: 400px;
    width: 900px;
    min-width: 900px;
}
</style>