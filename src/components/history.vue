<template>
<div>
    <div id="editor">
        <el-button type="primary" @click="change">change</el-button>
        <div id="history">
            <div v-for="(val,index) in historyItems" ref="block" @click="revert(val,index)" class="timeblock">
                <span>{{val.history}}</span>
                <a href="javascript:void(0)" style="margin-left:20px;"><i class="el-icon-back"></i></a>
            </div>
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
export default {
    name: 'history',
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
            historyItems: [
                {history:'111',color:'blue'},
                {history:'222',color:'red'}
            ]
        }
    },
    mounted() {
        this.$axios(
        {
            url:'/version-manage/show',
            method:"post",
            data:{
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
            for(var time in response.data.versionItem)
            {
                this.historyItems.push({history:time,color:response.data.versionItem[time]})
            }
        });
        this.$nextTick(() => {
            for(var i = 0; i < this.historyItems.length; i++)
            {
                this.$refs['block'][i].style.backgroundColor = this.historyItems[i].color
            }
        });
    },
    methods: {
        generate(index) {
            var str = 'block' + index
            console.log(str)
            return str
            
        },
        revert(val,index) {

        },
        change() {
            
        }
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
#history {
    position: absolute;
    left: 0;
    top: 100px;
    color:black;
    background-color: white;
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
.timeblock {
    width: 100px;
}
</style>