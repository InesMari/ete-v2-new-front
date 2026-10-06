<template>
    <div id="myImport" style="width:98%">

        <!-- 用户导入对话框 -->
        <el-dialog v-if="!noneDialog" :title="title" :visible.sync="selfOpen" :close-on-click-modal="false"
                   :close-on-press-escape="false" @close="close" width="400px" append-to-body>
            <el-upload v-if="selfOpen" ref="upload" :limit="1" accept=".xlsx, .xls" action="" :disabled="isUploading"
                       :http-request="uploadSectionFile" :on-progress="handleFileUploadProgress"
                       :on-success="handleFileSuccess" :auto-upload="false" :multiple="false" drag>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                    将文件拖到此处，或
                    <em>点击上传</em>
                </div>
                <!--        <div class="el-upload__tip" slot="tip">-->
                <!--          -->
                <!--        </div>-->
                <div class="el-upload__tip" style="color:red;" slot="tip">
                    提示：{{ (tip === undefined || tip === null || tip === '') ? '仅允许导入“xls”或“xlsx”格式文件！除报错行其余数据正常导入。' : tip }}
                    <a class="link" type="primary" style="font-size:12px" :href="template" v-if="(templateUrl === undefined || templateUrl === null || templateUrl === '')">下载模板</a>
                    <a type="primary" style="font-size:12px" v-else @click="downloadTemplate">下载模板</a>
                </div>
            </el-upload>
            <div slot="footer" class="dialog-footer" style="text-align:center">
                <el-button size="mini" @click="close">取 消</el-button>
                <el-button size="mini" type="primary" @click="submitFileForm">确 定</el-button>
            </div>
        </el-dialog>

        <el-upload v-if="noneDialog" ref="upload" :limit="1" accept=".xlsx, .xls" action="" :disabled="isUploading"
                   :http-request="uploadSectionFile" :on-progress="handleFileUploadProgress"
                   :on-success="handleFileSuccess" :auto-upload="false" :multiple="false" drag>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
            </div>
            <!--        <div class="el-upload__tip" slot="tip">-->
            <!--          -->
            <!--        </div>-->
            <div class="el-upload__tip" style="color:red;" slot="tip">
                提示：{{ (tip === undefined || tip === null || tip === '') ? '仅允许导入“xls”或“xlsx”格式文件！除报错行其余数据正常导入。' : tip }}
              <a class="link"  type="primary" style="font-size:12px" :href="template" v-if="(templateUrl === undefined || templateUrl === null || templateUrl === '')">下载模板</a>
              <a class="link" type="primary" style="font-size:12px" v-else @click="downloadTemplate">下载模板</a>
            </div>
        </el-upload>

    </div>
</template>

<script>
import CryptoJS from "@/utils/sha";
import axios from "axios";

export default {
    name: "myImport",
    props: {
        title: String,
        open: Boolean,
        handleSuccess: Function,
        bean: String,
        method: String,
        repeatCheckNums: String,//excel的列 1,2则校验第1 第2列列数据是否重复
        template: String,
        param: Object,
        beginRow: Number,
        noneDialog: Boolean,
        tip: String,
        templateUrl:String,
        setSureCallback: Boolean,    //是否回调
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
            this.$message(response.msg, "导入结果", {dangerouslyUseHTMLString: true});
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
            inParam.beanName = "baseTF";
            inParam.method = "uploadExcelFile";
            inParam.time = new Date().getTime().toString();
            inParam.rd = Math.round(Math.random() * 1000).toString();
            inParam.content = {
                bean: this.bean,
                method: this.method,
                repeatCheckNums: this.repeatCheckNums,
                beginRow: this.beginRow>0?this.beginRow:2,
                param: this.param
            };

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
            //遮罩层
            // const mainPopup = document.getElementById("mainPopup");
            // mainPopup.style.display = "block";

            axios.post('api/intf', fd).then(function (res)
            {
            })

            let progress = document.getElementById('fileProgress');
            let rate = document.getElementById('fileProgressRate');

            progress.style.display = "block";

            //等待1s后执行
            setTimeout(function ()
            {
            }, 1000);
            let that = this;
            this.common.postUrl("baseTF", "checkFinishUpload", {}, function (data)
            {
                //有错误的情况
                if (data.msg)
                {
                    progress.style.display = "none";
                    rate.style.width = "1%";
                    rate.innerHTML = "<div>1%</div>"
                    that.$msgbox(data.msg);
                    clearInterval(interval);
                    that.common.postUrl("baseTF", "clearUploadMap");
                    return;
                }
                //没有报错的情况
                if (data.result == "true")
                {
                    progress.style.display = "none";
                    rate.style.width = "1%";
                    rate.innerHTML = "<div>1%</div>"
                    that.$message("导入完成");
                    that.$refs.upload.clearFiles();
                    that.common.postUrl("baseTF", "clearUploadMap");
                    if (that.handleSuccess)
                    {
                        that.handleSuccess();
                    }
                    return;
                }
                let rateBar = parseInt(data.rate) - 5;
                if (rate > 0)
                {
                    progress.style.display = "none";
                    rate.style.width = rateBar + "%";
                    rate.innerHTML = `<div>${rateBar}%</div>`
                }
                let preRate = 0;
                let reqCount = 0;  //重复请求进度条相同次数
                let interval = setInterval(() =>
                {
                    that.common.postUrl("baseTF", "checkFinishUpload", {}, function (data)
                    {
                        if (data.msg)
                        {
                            progress.style.display = "none";
                            rate.style.width = "1%";
                            rate.innerHTML = "<div>1%</div>"
                            that.$msgbox(data.msg);
                            that.common.postUrl("baseTF", "clearUploadMap");
                            return;
                        }
                        if (preRate == data.rate)
                        {
                            reqCount++;
                            if (reqCount == 30)
                            {     //多次请求进度不变，则认为导出失败取消请求
                                clearInterval(interval);
                                progress.style.display = "none";
                                rate.style.width = "1%";
                                rate.innerHTML = "<div>1%</div>"
                                that.$message("导入超时");
                            }
                        } else
                        {
                            preRate = data.rate;
                            reqCount = 0;
                        }
                        let rateBar = parseInt(data.rate) - 5;
                        if (rate > 0)
                        {
                            progress.style.display = "none";
                            rate.style.width = rateBar + "%";
                            rate.innerHTML = `<div>${rateBar}%</div>`
                        }
                        if (data.result == "true")
                        {
                            progress.style.display = "none";
                            rate.style.width = "1%";
                            rate.innerHTML = "<div>1%</div>"
                            that.$refs.upload.clearFiles();
                            clearInterval(interval);
                            that.common.postUrl("baseTF", "clearUploadMap");
                            if (that.handleSuccess)
                            {
                                that.handleSuccess();
                            }
                        }

                    });
                }, 1000)
            });

            return;//屏蔽了action的默认上传

        }
    }

}
</script>

<style scoped>

</style>
