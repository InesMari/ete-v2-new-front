import tableCommon from "@/components/table/tableCommon.vue";
import selectWork from "@/page/pt/wms/selectWork.vue";
import enumData from "@/page/pt/enum";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import fileViewer from '@/components/myFile/file-viewer.vue';

export default {
    name: 'feeOpManage',
    data() {
        return {
            head: [
                {"name": "供应商", "code": "tenantName", "width": "250", "type": "text"},
                {"name": "货主", "code": "srcTenantName", "width": "250", "type": "text"},
                {"name": "到货厂商", "code": "fromTenantName", "width": "250", "type": "text"},
                {"name": "操作类型", "code": "itemTypeName", "width": "120", "type": "text"},
                {"name": "计费方式", "code": "wmsBillingTypeName", "width": "120", "type": "text"},
                {"name": "数量", "code": "sums", "width": "90", "type": "text"},
                {"name": "单价", "code": "price", "width": "90", "type": "text"},
                {"name": "金额", "code": "totalFee", "width": "90", "type": "text"},
                {"name": "实际发生日期", "code": "actualDate", "width": "150", "type": "text"},
                {"name": "备注", "code": "remark", "width": "250", "type": "text"},
                {"name": "操作凭据", "code": "file", "width": "110", "type": "diy"},
                {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
            ],
            query: this.initQuery(this.$route.query.feeCostIds),
            itemTypeData: [],
            wmsBillingTypeData: [],
            supplierData: [],
            srcTenantData: [],
            fromTenantData: [],
            info: this.initInfo(),
            showDialog: false,
            title: "新增操作登记",
            isOnlySee: false,
            showSelWork:false,
            limitPickerOptions:this.common.copyObj(enumData.DATE_SHORTCUT_OPTIONS),

            showFile:false,
            srcList: [],	//图片列表
        }
    },
    mounted() {
        let that = this;
        that.initSelWork();
        that.doQuery();
        this.limitPickerOptions.disabledDate = function (date){
            var now =  new Date();
            if(now.getDate()>4){
                if(date<that.preMonth(now)){
                    return true;
                }
            }else{
                var year = now.getFullYear();
                var month = now.getMonth();
                if(month==0){
                    month = 11;
                    year = year-1;
                }else{
                    month -= 1;
                }
                var dateTime = new Date(year,month,1);
                if(date<dateTime){
                    return true;
                }
            }
            return false;
        };
    },
    components: {
        tableCommon,
        selectWork,
        myFileModel,
        fileViewer
    },
    methods: {
        initSelWork(){
            this.userInfo = this.common.userInfo();
            if(!this.userInfo.workId){
                this.showSelWork = true;
            }else{
                this.firstIn = false;
                this.initStaticData();
                this.loadFromTenantData();
            }
        },
        selWork(){
            this.showSelWork = false;
            this.$forceUpdate();
            if(!this.firstIn){
                this.$emit('closeOthers', {});
            }
            this.userInfo = this.common.userInfo();
            this.firstIn = false;
            this.initStaticData();
            this.loadFromTenantData();
            this.doQuery();
        },
        preMonth(date) {
            var dateTime=new Date(date.getFullYear(),date.getMonth(),1);
            return dateTime;
        },
        doQuery() {
            this.$refs.table.load("wmsCostService", "queryWmsFeeCostOperatePage", this.query);
        },
        async initStaticData() {
            this.itemTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WMS_COST_ITEM_TYPE"});
            for (let i = 0; i < this.itemTypeData.length; i++)
            {
                let item = this.itemTypeData[i];
                if (item.codeValue == 4)
                {
                    this.itemTypeData.splice(i, 1);
                    i--;
                }
            }
            this.wmsBillingTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WMS_BILLING_TYPE"});
            await this.loadSupplierData();
        },
        async loadSupplierData(){
            this.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
        },
        async loadFromTenantData(parentId)
        {
            this.fromTenantData = await this.common.postUrl("wmsTenantTF", "queryArrivalManufacturerTenantList", {parentId: parentId});
        },
        initQuery(feeCostIds) {
            return this.query = {
                feeCostIds:feeCostIds,
                tenantName: '',
                srcTenantName: '',
                fromTenantName: '',
                wmsCostItemType: '',
            };
        },
        initInfo()
        {
            return this.info = {
                tenantId: null,
                fromTenantId: null,
                itemType: '1',
                sums: null,
                totalFee: null,
                actualDate: null,
                remark: null,
                wmsBillingType: null,
                price: null,
            }
        },
        /**
         * @param flag 开关
         * @param type 1新增 2修改 4双击查看详情
         * @param obj
         */
        openDialog(flag, type, obj)
        {
            this.initInfo();
            if (flag)
            {
                let selectData = this.$refs.table.getSelectItem();
                if (type==2 && selectData.length != 1)
                {
                    this.$message.error("请选择一条修改数据!");
                    return;
                }
                if (this.common.isNotBlank(obj))
                    this.info = obj;
                else
                {
                    if (type==2)
                        this.info = this.common.copyObj(selectData[0]);
                }
                if(type == 1)
                    this.title = "新增操作登记";
                if(type == 2)
                    this.title = "修改操作登记";
                if (type == 4)
                    this.title = "查看操作登记";
                this.info.wmsBillingType
            }
            this.showDialog = flag;
        },
        dblclickItem(data){
            this.openDialog(true,4,data);
        },
        calcTotalFee()
        {
            let info = this.info;
            let price = info.price;
            let sums = info.sums;
            let totalFee = 0;
            if (this.common.isBlank(price) || isNaN(price))
            {
                price = 0;
            }
            if (this.common.isBlank(sums) || isNaN(sums))
            {
                sums = 0;
            }
            if (info.itemType == 9)
            {
                totalFee = this.common.accMul(price, sums);
                info.totalFee = totalFee;
            }
            this.$forceUpdate();
        },
        changeItemType()
        {
            this.info.price = null;
            this.info.sums = null;
            this.info.totalFee = null;
            this.$forceUpdate();
        },
        async saveFeeCostOperate() {
            let info = this.info;
            if(this.common.isBlank(info.tenantId)){
                this.$message.error("请选择供应商！");
                return;
            }
            if(info.itemType != 9 && this.common.isBlank(info.fromTenantId)){
                this.$message.error("请选择到货厂商！");
                return;
            }
            if(this.common.isBlank(info.itemType)){
                this.$message.error("请选择操作类型！");
                return;
            }
            if(info.itemType == 9 && this.common.isBlank(info.wmsBillingType)){
                this.$message.error("请选择计费方式！");
                return;
            }
            if(info.itemType == 9 && this.common.isBlank(info.price)){
                this.$message.error("请输入单价！");
                return;
            }
            if(this.common.isBlank(info.sums)){
                this.$message.error("请输入数量！");
                return;
            }
            if (info.itemType == 3 || info.itemType == 9)
            {
                if(this.common.isBlank(info.totalFee)){
                    this.$message.error("请输入金额！");
                    return;
                }
            }
            if(this.common.isBlank(info.actualDate)){
                this.$message.error("请选择实际发生日期！");
                return;
            }
            let param = this.common.copyObj(info);
            await this.common.postUrl("wmsCostService", "saveOrUpdateFeeCostOperate", param, null, null,'',true);
            this.doQuery();
            this.openDialog(false);
            this.$message.success(info.id > 0 ? "修改成功!" : "新增成功!");
        },
        deleteFeeCostOperate()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1)
            {
                this.$message.error("请选择一条需要删除的数据!");
                return;
            }
            let data = selectData[0];
            let that = this;
            that.$confirm("确认需要删除？", "提示").then(() =>{
                that.common.postUrl("wmsCostService", "deleteFeeCostOperate", data, function (data)
                {
                    that.doQuery();
                    that.$message.success("删除成功！");
                },null,'',true);
            }).catch(() =>{});
        },
        print(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条信息！");
                return;
            }
            this.$emit("openTab",{
                urlId: "printFeeOp"+selectData[0].id,
                query: {id:selectData[0].id},
                urlName: '打印操作凭据',
                urlPathName: "/printFeeOp",
                urlPath: '/pt/wms/fee/printFeeOp.vue'});
        },
        /**
         * 上传单据
         */
        async showFileUpload()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要上传操作凭据的信息！");
                return false;
            }
            let data = selectData[0];

            this.showFile = true;
            this.info = this.common.copyObj(data);
            let that = this;
            this.$nextTick(() => {
                if(that.info.fileId){
                    that.$refs.file.initDate(that.info.fileId);
                }else{
                    that.$refs.file.clean();
                }
            })
        },
        async uploadCredentialFile() {
            //获取图片
            this.info.fileId = this.$refs.file.getImageData().flowId;
            this.info.filePath = this.$refs.file.getImageData().storePath;
            await this.common.postUrl("wmsCostService", "uploadCredentialFile", this.info, null, null, '', true);
            this.showFile = false;
            await this.doQuery();
            this.$message.success("上传成功！");
        },
        showImg(data){
            if(!data.fileUrl){
                return;
            }
            let typeList = {
                img:".gif,.GIF,.jpg,.JPG,.png,.PNG,.jpeg,.JPEG,.ico,.ICO",
                table:".xls,.xlsx,.XLS,.XLSX",
                file:"file"
            };
            let fileTypeName = data.fileUrl.substring(data.fileUrl.lastIndexOf('.'), data.fileUrl.length);
            if(typeList['img'].indexOf(fileTypeName)>-1){
                this.srcList=[];
                this.srcList.push(data.fileUrl);
                this.$refs.viewer.show();
            }else{
                data.fileUrl = data.fileUrl.replace("_big", "");
                let url = data.fileUrl;
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
        gotoLog()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据！");
                return;
            }
            let data = selectData[0];
            this.$emit("openTab",{
                urlId: 'feeCostOperate' + 'Detail' + data.id,
                query: {
                    logId: data.id,
                    logType: enumData.LOG_TYPE.WMS_FEE_COST_OPERATE,
                },
                urlName: "操作登记" + "操作日志",
                urlPathName: "/operateLog",
                urlPath: "/pt/operateLog/operateLog.vue"});
        },
    },
}
