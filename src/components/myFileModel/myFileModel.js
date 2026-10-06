import axios from 'axios'
import CryptoJS from "@/utils/sha";
import fileViewer from '@/components/myFile/file-viewer.vue';

export default {
    /**
     * supportFiles     文件类型限制，不传不限制，可传多个种，如"img,mp4"
     * disabled         是否禁用
     * componentId      组件id
     * disabledEdit     是否禁用修改文件
     * disabledDel      是否禁用删除
     * clickType        点击上传展示类型，text：文本展示，txtOnlyUp：只有一个上传按钮的文本展示
     */
    props:['supportFiles','disabled','disabledEdit','disabledDel','componentId','clickType','fileLimit'],
    name: 'myFileModel',
    data() {
        return {
            imageUrl: "",   //压缩图路径
            bigImageUrl:"", //大图路径
            haveImg:false,  //上传框是否存在图片
            imgData:{},     //图片上传成功后的具体信息
            postUrl:"",
            wasModify: false, // 上传前是否已有文件（用于区分修改/新增）
            typeList:{
                img:".gif,.GIF,.jpg,.JPG,.png,.PNG,.jpeg,.JPEG,.ico,.ICO",
                table:".xls,.xlsx,.XLS,.XLSX",
                file:"file"
            },
            type:'',
            isShowBigImg:false,//是否展示大图
            isTextBtn:false,    //点击上传展示类型
            txtOnlyUp:false,    //只有一个上传按钮的文本展示
        }
    },
    /**
     * 组件
     */
    components: {
        fileViewer,
    },
    mounted(){
        if(this.clickType=="text"){
            this.isTextBtn = true;
        }else if(this.clickType=="txtOnlyUp"){
            this.txtOnlyUp = true
        }
    },
    methods: {
        initType(file){
            // 判断截取后缀
            this.type = this.getFileType(file.name,file.fullPath);
            
            if(this.common.isNotBlank(this.supportFiles) && this.supportFiles!='file'){     //file类型不做拦截
                let types = this.supportFiles.split(",");
                if(!types.includes(this.type)){
                    this.$message.error(`请上传指定类型文件,`+types);
                    this.clean();
                    return false
                }
            }            
            return true;
        },
        getFileType(fileName,fullPath){
            let type = "img";
            var suffix;
            if(this.common.isNotBlank(fileName)){
                suffix = fileName.substring(fileName.lastIndexOf('.'),fileName.length);
            }else if(this.common.isNotBlank(fullPath)){
                let name = fullPath.substring(fullPath.lastIndexOf('/'),fullPath.length);
                let num = name.indexOf('.');
                let end = name.indexOf('?');
                suffix = name.substring(num,name.length);
            }
            // 判断识别类型
            if(suffix.indexOf('.pdf')>-1||suffix.indexOf('.PDF')>-1){
                type = 'pdf';
            }else if(suffix.indexOf('.doc')>-1 || suffix.indexOf('.DOC')>-1){
                type = 'word';
            }else if(suffix.indexOf('.ppt')>-1 || suffix.indexOf('.PPT')>-1){
                type = 'ppt';
            }else if(suffix.indexOf('.xls')>-1 || suffix.indexOf('.XLS')>-1){
                type = 'excel';
            }else if(suffix.indexOf('.mp4')>-1){
                type = 'mp4';
            }else{
                type = 'file';
            }
            // 上传限制
            let imgArr = this.typeList.img.split(",");
            imgArr.forEach(el => {
                if(suffix.indexOf(el)>-1){
                    type = 'img';
                }
            })
            return type;
        },
        parseUrlParam(orginUrl, paramArray) {
            let paramStr = "";
            if (orginUrl != undefined) {
                let url = orginUrl.substring(orginUrl.lastIndexOf("/")+1);
                let idx = url.indexOf("&");
                 if (idx > 0) {
                     paramStr = url.substring(0, idx);
                     let params = url.substring(idx+1).split("&");
                     for (let i in params) {
                         if (params[i].split("=")[1] !== "null" && params[i].split("=")[1] !== "") {
                             paramArray.push(params[i]);
                         }
                     }
                 } else {
                     paramStr = url;
                 }
            }
            return paramStr;
        },
        handleAvatarSuccess(res, file) {

        },
        async beforeAvatarUpload(file) {
            // 在上传开始前捕获：是否已有文件
            this.wasModify = this.haveImg;

            let name = encodeURI(file.name);
            if(name.length>250){
                this.$message.error("文件名过长，请重新命名");
                return
            }
            this.fileUrl = URL.createObjectURL(file);
            if(!this.initType(file)) return;
            if (!this.checkFile(file)) return

            let intfKey = this.common.intfKey
            let inParam = {}
            inParam.appId = this.common.appId;
            inParam.beanName = "fileCommonTF";
            inParam.method = "doUpload";
            inParam.time = new Date().getTime().toString();
            inParam.rd = Math.round(Math.random() * 1000).toString();
            inParam.content = {};
            inParam.inCode = '';
            inParam.tokenId = localStorage.getItem("token") || '';
            let paramArray = [intfKey, inParam.tokenId, inParam.time, inParam.rd, JSON.stringify(inParam.content)].sort();
            let str = "[";
            for (let item of paramArray) str += (item + ', ');
            str = str.replace(/, $/, '');
            str += "]";
            inParam.sign = CryptoJS.SHA1(str).toString();

            let fd = new FormData();
            let that = this;
            fd.append('file', file);//传文件
            fd.append('json', JSON.stringify(inParam));
            //遮罩层
            const mainPopup = document.getElementById("mainPopup");
            mainPopup.style.display = "block";

            axios.post('api/intf', fd).then(function (res) {
                if (res.data.status == 200) {
                    that.haveImg = true;
                    that.imgData = res.data.content;
                    that.initDateNoReq();
                } else {
                    that.$message.error(res.data.message);
                    that.type = "";
                }
                mainPopup.style.display = "none";//关闭遮罩层
            });
            return false//屏蔽了action的默认上传
        },
        checkFile(file){
            var limitVal = 4;
            if (this.type == 'img') {   //图片不超过4M
                limitVal = 4;
            }if (this.type == 'pdf') {   //pdf不超过10M
                limitVal = 10;
            }else{  //文件不超过70M
                limitVal = 50;
            }
            if(this.common.isNotBlank(this.fileLimit)){
                limitVal = Number(this.fileLimit);
            }
            let limitSize = this.common.accMul(limitVal,1024);
            let fileSize = this.common.accDiv(file.size,1024);
            if(fileSize > limitSize){
                this.$message.error('文件不可超过' + limitVal + 'M！请压缩处理!');
                this.clean();
                return false;
            }
            return true;
        },
        async initDate(flowId,callback=true){
            if(this.common.isBlank(flowId)) return;
            let data = await this.common.postUrl("fileCommonTF","doQuery",{flowIds:flowId});
            this.imgData.flowId = data[0].flowId;
            this.imgData.storePath = data[0].storePath;
            this.imgData.fullPath = data[0].fullPath;
            if(this.common.isNotBlank(this.imgData.fullPath)){
                this.haveImg = true;
            }
            this.imageUrl = data[0].fullPath;
            //生成大图路径
            let host = this.imageUrl.substring(0,this.imageUrl.lastIndexOf('/'));
            let name = this.imageUrl.substring(this.imageUrl.lastIndexOf('/'),this.imageUrl.length);
            let num = name.indexOf('.');
            this.initType(this.imgData);
            if(this.type == 'img' && (host.includes('ete56.cn') || host.includes('1000e56.com'))){
                this.bigImageUrl = host + name.slice(0,num)+'_big'+name.slice(num,name.length);
            }else{
                this.bigImageUrl = this.imageUrl;
            }
            data[0].componentId = this.componentId;//回传ID，用于遍历时识别对应组件
            data[0].isInit = true;
            data[0].fileUrl = this.fileUrl;
            data[0].type = this.type;
            if(callback){
                this.$emit("successCallback",data[0]);
            }
        },
        initDateNoReq(){
            try{
                // 没有type识别type
                if(this.common.isBlank(this.type) && this.common.isNotBlank(this.imgData)){
                    this.type = this.getFileType(this.imgData.fileName,this.imgData.fullPath);
                }
            }catch(e){}
            if(this.common.isNotBlank(this.imgData.fullPath)){
                this.haveImg = true;
            }
            if(this.type == 'img'){
                this.imageUrl = this.imgData.fullPath;
            }else if(this.type == 'table'){
                this.imageUrl = 'table'
            }else if(this.type == 'file'){
                this.imageUrl = 'file'
            }
            this.bigImageUrl = this.imgData.fullPath;
            this.imgData.componentId = this.componentId;//回传ID，用于遍历时识别对应组件
            this.imgData.isInit = false;
            this.imgData.fileUrl = this.fileUrl;
            this.imgData.type = this.type;
            this.imgData.haveImg = this.wasModify;// 上传前已有文件=修改，否则=新增
            this.$emit("successCallback",this.imgData);
        },
        // 设置文件（供父组件调用，用于多选后同步组件显示状态）
        setFile(fileData){
            if(!fileData || this.common.isBlank(fileData.flowId)){
                this.clean();
                return;
            }
            this.imgData = fileData;
            // 确定文件类型
            this.type = fileData.type || '';
            if(this.common.isBlank(this.type)){
                try{
                    this.type = this.getFileType(this.imgData.fileName, this.imgData.fullPath);
                }catch(e){}
            }
            if(this.common.isNotBlank(this.imgData.fullPath)){
                this.haveImg = true;
            }
            // 根据类型设置显示图
            if(this.type == 'img'){
                this.imageUrl = this.imgData.fullPath;
            }else if(this.type == 'table'){
                this.imageUrl = 'table';
            }else if(this.type == 'file'){
                this.imageUrl = 'file';
            }else{
                this.imageUrl = this.imgData.fullPath || this.type;
            }
            this.bigImageUrl = this.imgData.fullPath;
            this.imgData.componentId = this.componentId;
        },
        async delImg(){
            //遮罩层
            // const mainPopup = document.getElementById("mainPopup");
            // mainPopup.style.display = "block";
            // await this.common.postUrl("fileCommonTF","doDel",{flowId:this.imgData.flowId});
            //
            // this.haveImg = false;
            // this.imageUrl = "";
            // mainPopup.style.display = "none";//关闭遮罩层
            // this.imgData = {};
            this.clean();
            this.$emit("delCallback",this.componentId);
        },
        clean(){
            this.haveImg = false;
            this.imageUrl = "";
            this.type = "";
            this.imgData = {};
        },
        visitFile(){
            this.$refs.viewer.show();
        },
        // 查看大图
        seeBigImg(){
            this.$refs.viewer.show();
        },
        getId(){
            return this.imgData.flowId;
        },
        // 获取数据
        getImageData(){
            return this.imgData;
        }
    }
}
