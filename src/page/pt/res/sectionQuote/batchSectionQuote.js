import commonSectionQuote from "@/page/pt/res/sectionQuote/commonSectionQuote.js"
import enumData from "@/page/pt/enum.js"
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import fileViewer from "@/components/myFile/file-viewer";

export default {
    name: 'batchSectionQuote',
    mixins: [commonSectionQuote],
    data()
    {
        return {
            enumData: enumData,
            id: this.$route.query.id,
            type: this.$route.query.type,
            files:[],
            srcList:[],
            showViewer: false,//是否展示大图
        }
    },
    mounted()
    {
        this.initData();
    },
    /**
     * 组件
     */
    components: {
        myFileModel,
        fileViewer,
    },
    methods: {
        async initData()
        {
            await this.initStaticData(true);
            if (this.id > 0)
            {
                this.$nextTick(async () => {
                    await this.loadSectionQuoteById(this.id);
                });
            }
        },
        async loadSectionQuoteById(id)
        {
            let data = await this.common.postUrl("sectionQuoteService", "loadSectionQuoteDataById", {id, type: 4}, null, null, '', true);
            this.order = data.info;
            if (!this.isExistTenant(data.info.tenantId))
                this.order.tenantId = data.info.tenantName;

            this.order.validDate = [data.info.effectDate, data.info.expireDate];
            if (this.order.serviceAreas)
                this.order.serviceAreas = this.order.serviceAreas.split(",");
            if (this.order.supplierTenantId)
            {
                this.order.supplierTenantId = this.order.supplierTenantId.split(",").map(Number);
                await this.changeSupplier();
            }
            this.requirementList = data.requirementList;
            this.files = data.files;
            this.$forceUpdate();
        },
        async batchSectionQuote()
        {
            if (this.common.isBlank(this.order.validDate) || this.order.validDate.length === 0)
            {
                this.$message.error("请选择询价截止时间！");
                return false;
            }
            if (this.common.isBlank(this.order.supplierTenantId) || this.order.supplierTenantId.length === 0)
            {
                this.$message.error("请选择竞价供应商！");
                return false;
            }
            if (this.common.isBlank(this.order.supplierType))
            {
                this.$message.error("请选择供应商类型！");
                return false;
            }
            if (this.common.isBlank(this.files) || this.files.length === 0)
            {
                this.$message.error("请上传文件！");
                return false;
            }
            let param = this.common.copyObj(this.order);
            param.effectDate = this.order.validDate[0];
            param.expireDate = this.order.validDate[1];
            param.requirementList = this.common.copyObj(this.requirementList);
            param.files = this.common.copyObj(this.files);
            await this.common.postUrl("sectionQuoteService", "batchSectionQuote", param, null, null, '', true);
            this.$message.success("保存成功！");
            this.closePage();
        },
        successCallback: function (imgData)
        {
            let url = imgData.fullPath;
            let deleteIndex = url.lastIndexOf("?filename");
            if (deleteIndex > 0)
                url = url.substring(0, deleteIndex);
            let index = url.lastIndexOf(".");
            imgData.imgUrl = url.substring(0, index) + "_big" + url.substring(index);
            this.files.push(imgData);
            this.$refs.fileModel.clean();
        },
        removeFile(item, index)
        {
            if (this.type != 0)
            {
                this.files.splice(index, 1);
                this.$forceUpdate();
            }
        },
        showImg(data){
            if(!data.imgUrl){
                this.$message.error("没有图片~");
                return;
            }
            let typeList = {
                img:".gif,.GIF,.jpg,.JPG,.png,.PNG,.jpeg,.JPEG,.ico,.ICO",
                table:".xls,.xlsx,.XLS,.XLSX",
                file:"file"
            };
            let fileTypeName = data.imgUrl.substring(data.imgUrl.lastIndexOf('.'), data.imgUrl.length);
            if(typeList['img'].indexOf(fileTypeName)>-1){
                this.srcList=[];
                this.srcList.push(data.imgUrl);
                this.$refs.viewer.show();
            }else{
                data.imgUrl = data.imgUrl.replace("_big", "");
                let url = data.imgUrl;
                let fileType = this.common.getFileType('',url);
                if(fileType=='pdf'){   //查看pdf
                    let idx = url.indexOf("?");
                    if(idx>=0){
                        url = url.substring(idx,0);
                    }
                    this.srcList=[];
                    this.srcList.push(url);
                    this.$refs.viewer.show();
                }else if(fileType=='excel'||fileType=='word'||fileType=='ppt'){
                    this.srcList=[];
                    this.srcList.push(url);
                    this.$refs.viewer.show();
                }else{  //下载文件
                    this.common.downloadFile(url)
                }
            }
        },
        closePage()
        {
            this.$parent.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true);
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true);
        },
    },
}
