<template>
    <div id="myImportDown" style="width:98%">

        <!-- 用户导入对话框 -->
        <el-dialog v-if="!noneDialog" :title="title" :visible.sync="selfOpen" :close-on-click-modal="false"
                   :close-on-press-escape="false" @close="close" width="400px" append-to-body>
            <el-upload v-if="selfOpen" ref="upload" :limit="1" accept=".xlsx, .xls" action="" :disabled="isUploading || isGenerate"
                       :http-request="uploadSectionFile" :on-progress="handleFileUploadProgress"
                       :on-success="handleFileSuccess" :auto-upload="true" :multiple="false" :show-file-list="showFileList" drag>
                <i class="el-icon-upload" v-if="!isGenerate"></i>
                <div class="el-upload__text" v-if="!isGenerate">
                    将文件拖到此处，或
                    <em>点击上传</em>
                </div>
                <div class="generate" v-if="isGenerate">
                    <i class="el-icon-loading"></i>
                </div>
            </el-upload>
            <div slot="footer" class="dialog-footer" style="text-align:center">
                <el-button size="mini" @click="close">取 消</el-button>
                <el-button size="mini" type="primary" @click="submitFileForm">确 定</el-button>
            </div>
        </el-dialog>

        <el-upload v-if="noneDialog" ref="upload" :limit="1" accept=".xlsx, .xls" action="" :disabled="isUploading || isGenerate"
                   :http-request="uploadSectionFile" :on-progress="handleFileUploadProgress"
                   :on-success="handleFileSuccess" :auto-upload="true" :multiple="false" :show-file-list="showFileList" drag>
            <i class="el-icon-upload" v-if="!isGenerate"></i>
            <div class="el-upload__text" v-if="!isGenerate">
                将文件拖到此处，或
                <em>点击上传</em>
            </div>
            <div class="generate" v-if="isGenerate">
                <i class="el-icon-loading"></i>
                <div class="text">正在生成文档</div>
            </div>
        </el-upload>

    </div>
</template>

<script>
import CryptoJS from "@/utils/sha";
import axios from "axios";

export default {
    name: "myImportDown",
    props: {
        title: String,
        open: Boolean,
        handleSuccess: Function,
        bean: String,
        method: String,
        downMethod:String,
        repeatCheckNums: String,//excel的列 1,2则校验第1 第2列列数据是否重复
        template: String,
        param: Object,
        beginRow: Number,
        noneDialog: Boolean,
        tip: String,
        templateUrl:String,
        setSureCallback: Boolean,    //是否回调
        showFileList: Boolean,
    },
    watch: {
        open(val)
        {
            this.selfOpen = val;
        }
    },
    data()
    {
        return {
            isUploading: false,
            selfOpen: this.open,
            isGenerate: false,
            fileId:""
        }
    },
    methods: {
        close()
        {
          this.selfOpen = false;
          this.$refs.upload.clearFiles();
          this.$emit('update:open', false);
        },
      downloadTemplate(){
        let param = {
          selfCreateUrl: this.templateUrl,
          isTemp:true,
        }
        this.common.downloadExcelFile('', param, '', '', this.template, this.template);
        },
        // 文件上传中处理
        handleFileUploadProgress(event, file, fileList)
        {
            this.isUploading = true;
        },
        // 文件上传成功处理
        handleFileSuccess(response, file, fileList)
        {
            this.close();
            this.isUploading = false;
            this.$refs.upload.clearFiles();
            // this.$message(response.msg, "导入结果", {dangerouslyUseHTMLString: true});
            if (this.handleSuccess)
            {
                this.handleSuccess();
            }
        },
        // 提交确认
        submitFileForm()
        {
            if(this.setSureCallback){
                this.$emit('sureCallback', this.submit);
            }else{
                this.submit();
            }
        },
        // 提交上传文件
        submit(){
            this.$refs.upload.submit();
        },
        uploadSectionFile(params)
        {
            var file = params.file;
            let intfKey = this.common.intfKey
            let inParam = {}
            inParam.appId = this.common.appId;
            inParam.beanName = this.bean;
            inParam.method = this.method;
            inParam.time = new Date().getTime().toString();
            inParam.rd = Math.round(Math.random() * 1000).toString();
            inParam.content = this.param;  
            inParam.inCode = '';
            inParam.tokenId = localStorage.getItem("token") || '';
            let paramArray = [intfKey, inParam.tokenId, inParam.time, inParam.rd, JSON.stringify(inParam.content)].sort();
            let str = "[";
            for (let item of paramArray) str += (item + ', ');
            str = str.replace(/, $/, '');
            str += "]";
            inParam.sign = CryptoJS.SHA1(str).toString();

            let fd = new FormData();
            fd.append('file', file);//传文件
            fd.append('json', JSON.stringify(inParam));

            let _this = this;
            return axios.post('api/intf', fd).then(function (res)
            {
                if(res.data.status != 200){
                    _this.$message.error(res.data.message);
                    _this.isUploading = false;
                    _this.$refs.upload.clearFiles();
                    return Promise.reject(res.data.message);
                }
                _this.isGenerate = true;
                _this.fileId = res.data.content.importVehiclePositionExcelKey;
                _this.fileName = res.data.content.fileName
                _this.checkFinish();
            }).catch(function (err) {
                _this.$message.error('上传失败，请重试');
                _this.isUploading = false;
                _this.$refs.upload.clearFiles();
                return Promise.reject(err);
            })

        },
        async checkFinish(){
            let interval = setInterval(async() => {
                let data = await this.queryResult();
                if(data != ""){
                    clearInterval(interval);
                    let param = {
                        importVehiclePositionExcelKey:this.fileId
                    };
                    param.selfCreateUrl = `${this.bean}|${this.downMethod}`;
                    this.common.downloadExcelFile('', param, '', '', '', '');
                    this.isGenerate = false;
                }
            }, 2000);
        },
        async queryResult(){
            let data = await this.common.postUrl(this.bean,this.downMethod, {importVehiclePositionExcelKey:this.fileId});
            return data;
        },
    }

}
</script>

<style lang="scss" scoped>
#myImportDown{
    .el-upload{
        position: relative;
        .generate{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            font-size: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            background: rgba(0, 0, 0, 0.05);
            .text{
                margin-top: 15px;
                font-size: 14px;
            }
        }
    }
}
</style>
