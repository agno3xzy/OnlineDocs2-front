<template>
<div>
    <navmenu></navmenu>
    <div id="main">
        <div id="submenu">
            <a href="javascript:void(0)" v-on:click="changeCategory" v-bind:class="{active:category.lastuse}" id="lastuse">最近使用</a>
            <a href="javascript:void(0)" v-on:click="changeCategory" v-bind:class="{active:category.create}" id="create">我创建的</a>
            <a href="javascript:void(0)" v-on:click="changeCategory" v-bind:class="{active:category.invite}" id="invite">共享给我的</a>
        </div>
        <div id="lastuse-table" v-if="category.lastuse">
            <el-table 
            :header-cell-style="{background:'#F7F7F7'}"
            :cell-style="{background:'#F7F7F7'}"
            :data="lastUseTableData"
            style="width: 800px;"
            max-height="500">
                <el-table-column prop="docName" label="文档名" width="150" align="center"></el-table-column>
                <el-table-column prop="owner" label="文档所有者" width="150" align="center"></el-table-column>
                <el-table-column prop="lastUseTime" label="最近修改时间" width="150" align="center"></el-table-column>
                <el-table-column prop="auth" label="权限" width="150" align="center"></el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="handleExplore(scope.$index, scope.row)">查看</el-button>
                        <el-button
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div id="create-table" v-if="category.create">
            <el-table 
            :header-cell-style="{background:'#F7F7F7'}"
            :cell-style="{background:'#F7F7F7'}"
            :data="createTableData"
            style="width: 800px;"
            max-height="500">
                <el-table-column prop="docName" label="文档名" width="150" align="center"></el-table-column>
                <el-table-column prop="lastUseTime" label="最近修改时间" width="150" align="center"></el-table-column>
                <el-table-column prop="shareAmount" label="共享人数" width="150" align="center"></el-table-column>
                <el-table-column label="共享成员" width="150">
                    <template>
                        <el-popover
                        ref="popover"
                        placement="bottom"
                        width="150px"
                        trigger="hover">
                        <el-table :data="userData" max-height="200" size="mini" style="left:0;top:0;width:150px;">
                            <el-table-column width="150" property="username" label="成员" align="center"></el-table-column>
                        </el-table>
                        </el-popover>
                        <el-button v-popover:popover size="mini" >查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div id="invite-table" v-if="category.invite">
            <el-table 
            :header-cell-style="{background:'#F7F7F7'}"
            :cell-style="{background:'#F7F7F7'}"
            :data="inviteTableData"
            style="width: 800px;"
            max-height="500">
                <el-table-column prop="docName" label="文档名" width="150" align="center"></el-table-column>
                <el-table-column prop="owner" label="文档所有者" width="150" align="center"></el-table-column>
                <el-table-column prop="lastUseTime" label="最近修改时间" width="150" align="center"></el-table-column>
                <el-table-column prop="auth" label="权限" width="150" align="center"></el-table-column>
                <el-table-column label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="handleExplore(scope.$index, scope.row)">查看</el-button>
                        <el-button
                        size="mini"
                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div id="button-group">
            <el-button type="primary" @click="uploadDialogVisible = true">上传<i class="el-icon-upload el-icon--right"></i></el-button>
        </div>
        <el-dialog title="上传文件" :visible.sync="uploadDialogVisible">
            <el-upload
            ref="upload"
            action=""
            :http-request="handleFile"
            :multiple="false" 
            :limit="1" 
            :on-exceed="handleExceed"
            :file-list="fileList"
            :auto-upload="true"
            drag>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
            <div slot="footer" class="dialog-footer">
                <el-button @click="uploadDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="uploadFile">提 交</el-button>
            </div>
        </el-dialog>
    </div>
</div>
</template>

<script>
import navmenu from './nav-menu'
export default {
    name: 'document-manage',
    data() {
        return {
            category: {lastuse:true, create: false, invite: false},
            lastUseTableData: [{docName:'111',owner:'aaa',lastUseTime:'2019-1-1',auth:'write'},
            {docName:'222',owner:'aaa',lastUseTime:'2019-1-1',auth:'write'},
            {docName:'111',owner:'aaa',lastUseTime:'2019-1-1',auth:'write'},
            {docName:'111',owner:'aaa',lastUseTime:'2019-1-1',auth:'write'},
            {docName:'111',owner:'aaa',lastUseTime:'2019-1-1',auth:'write'},
            {docName:'111',owner:'aaa',lastUseTime:'2019-1-1',auth:'write'},
            {docName:'111',owner:'aaa',lastUseTime:'2019-1-1',auth:'write'},
            {docName:'111',owner:'aaa',lastUseTime:'2019-1-1',auth:'write'},
            {docName:'111',owner:'aaa',lastUseTime:'2019-1-1',auth:'write'},
            {docName:'111',owner:'aaa',lastUseTime:'2019-1-1',auth:'write'},
            {docName:'111',owner:'aaa',lastUseTime:'2019-1-1',auth:'write'}],
            createTableData: [{docName:'111',lastUseTime:'2019-1-1',shareAmount:'10'},
                            {docName:'111',lastUseTime:'2019-1-1',shareAmount:'2'}],
            inviteTableData: [{docName:'111',owner:'aaa',lastUseTime:'2019-1-1',auth:'write'}],
            userData: [{username:'aaa'},{username:'bbb'}],
            uploadDialogVisible: false,
            fileList: []
        }
    },
    components: { navmenu },
    methods: {
        changeCategory() {
            var selectitem = event.target.id
            for(var i in this.category) {
                this.category[i] = false;
            }
            this.category[selectitem] = true
            console.log(this.category)
        },
        handleExplore(index, row) {
            console.log(index, row)
        },
        handleEdit(index, row) {
            console.log(index, row)
        },
        handleDelete(index, row) {
            console.log(index, row)
        },
        handleExceed(files, fileList) {
            this.$message.warning(`最多上传 ${files.length} 个文件`)
        },
        handleFile(response) {
            this.fileList.push(response.file)
        },
        uploadFile() {
            console.log(this.fileList)
            let formData = new FormData()
            formData.append('username',window.sessionStorage.username)
            formData.append('file', this.fileList[0])
            formData.append('fileUploadFileName',this.fileList[0].name)
            this.$axios.post('/upload', formData)
                .then(response => {
                if (response.code === 200) {
                    // 提交成功将要执行的代码
                }
                })
                .catch(function(error) {
                    console.log(error)
                })
            this.uploadDialogVisible = false
            for(var i = this.fileList.length-1; i >= 0; i--)
            {
                this.$delete(this.fileList, i);
            }
        }
    }
}
</script>

<style scoped>
#main {
    position: absolute;
    left: 0;
    top: 80px;
    bottom: 0;
    right: 0;
    background-color: #F7F7F7;
}
#submenu {
    position: relative;
    top: 50px;
    left: 100px;
    width: 400px;
}
#button-group {
    position: absolute;
    top: 50px;
    left: 90%;
}
a{
    text-decoration: none;
    color:#A5A5A5;
    font-size:18px;
    margin-left: 30px;
}
a:hover {
    color: #555555;
}
.active {
    color: #555555;
}
.el-table {
    top: 100px;
    left: 400px;
}
</style>
