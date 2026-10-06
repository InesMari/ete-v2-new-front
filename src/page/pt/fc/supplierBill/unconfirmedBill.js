import enumData from "@/page/pt/enum.js"
import tableCommon from "@/components/table/tableCommon.vue"
import fileViewer from "@/components/myFile/file-viewer.vue";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'unconfirmedBill',
    data() {
        return {
            head: [
                {"name": "账单编号", "code": "billNum", "width": "150", "type": "text"},
                {"name": "附件", "code": "", "width": "120", "type": "diy"},
                {"name": "账单月份", "code": "billMonth", "width": "90", "type": "text"},
                {"name": "结算主体", "code": "settleBodyName", "width": "250", "type": "text"},
                {"name": "供应商名称", "code": "supplierName", "width": "250", "type": "text"},
                {"name": "账单金额", "code": "totalFee", "width": "90", "type": "text"},
                {"name": "账单备注", "code": "remark", "width": "150", "type": "text"},
                {"name": "所属区域", "code": "regionName", "width": "120", "type": "text"},
                {"name": "所属部门", "code": "orgName", "width": "160", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "100", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"}
            ],
            query: this.initQuery(this.$route.query.supplierId),
            showAddMakeup:false,
            makeupInfo:{},
            feeTypeData:[],
            custTenantData:[],//查询账单关联的客户？
            shareDatas:[{}],
            srcList: [],

            regionData:[],
            allOrgData:[],
            orgData:[],

            supplierData:[],
            settleBodyData:[],

            accrualCostTypeData:[],
            accrualCostSubTypeData:[],
            accrualCostTypeTreeData:[],

            feeTypeDisable:false,
        }
    },

    mounted() {
        this.init();
        this.initSupplierData();
		this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        fileViewer,
        tableCommon,
        enumData,
        searchList
    },
    methods: {
        /**
         * 初始化下拉
         */
        async init() {
            let that = this;
            that.common.postUrl("commonTF", "getSysStaticData", {codeType: "SUPPLIER_BILL_FEE_TYPE"}, function (data) {
                that.feeTypeData = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "INVOICING_COMPANY"}, function (data) {
                that.settleBodyData = data;
            });
            this.regionData = await this.common.postUrl("regionOrgTF", "queryRegionSelect", {});
            this.allOrgData = await this.common.postUrl("regionOrgTF", "getOrgInfoList", {});
            this.orgData=this.common.copyObj(this.allOrgData);

            this.accrualCostTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "ACCRUAL_COST_TYPE"});
            this.accrualCostSubTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "ACCRUAL_COST_SUB_TYPE"});
            this.accrualCostTypeTreeData = [];

            this.accrualCostTypeData.forEach(item => {
                let data = this.common.copyObj(item);
                let codeValue = data.codeValue;
                data.children = '';
                this.accrualCostSubTypeData.forEach(item2 => {
                    if (item2.codeId == codeValue) {
                        let data2 = this.common.copyObj(item2);
                        if(data.children == ''){
                            data.children = [];
                        }
                        data.children.push(data2);
                    }
                })
                this.accrualCostTypeTreeData.push(data);
            });
        },
        changeFeeType(){
            if(this.makeupInfo.feeType!='2'){
                this.makeupInfo.accrualCostTypeData = [];
                this.makeupInfo.accrualMonth = '';
            }else{
                let now = new Date();
                let month = now.getMonth()+1;
                let accrualMonth = now.getFullYear()+"-"+(month>=10?month:("0"+month));
                this.makeupInfo.accrualMonth = accrualMonth;
            }
        },
        initSupplierData(){
            let that = this;
            this.common.postUrl("supplierTF", "queryAllSupplierList", {}, function (data) {
                that.supplierData = data;
            });
        },
        changeRegion(query=this.query) {
            this.query=query;
             this.orgData=[];
             if(this.query.regionId>0){
                 for (let i = 0; i < this.allOrgData.length; i++) {
                     if(this.allOrgData[i].regionId==this.query.regionId){
                         this.orgData.push(this.allOrgData[i]);
                     }
                 }
             }
             this.doQuery();
        },
        /**
         * 初始化查询条件
         * @returns {{billMonth: string, tenantId: string, billNum: string}}
         */
        initQuery(supplierId) {
            return this.query = {
                billNum: '',
                billMonths: [],
                supplierTenantIds: this.common.isBlank(supplierId) ? [] : [Number.parseInt(supplierId)],
                regionId:'',
                orgId:'',
            };
        },
        /**
         * 查询列表
         */
        doQuery(query=this.query) {
            this.query=query;
			this.$refs.table.load("fcSupplierBillTF", "queryFcSupplierBillInfo", this.query);
        },
        /**
         * 新增账单
         * @returns {boolean}
         */
        addFcSupplierBill()
        {
            this.$emit('openTab', {
                urlName: '新增供应商账单',
                urlId: 'addSupplierBillMain',
                urlPathName: "/fc",
                urlPath: "/pt/fc/supplierBill/add/addSupplierBillMain.vue",
                query: {},
            });
        },
        /**
         * 账单确认
         */
        async sureFcSupplierBill() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一条需要审核的账单！");
                return false;
            }
            let data = selectData[0];
            if (data.confirmState === enumData.FC_CONFIRM_STATE.CONFIRMED) {
                this.$message.error("已审核的账单,无须再次审核！");
                return false;
            }
            let detailData = await this.common.postUrl("fcSupplierBillTF", "getAllFcSupplierBillInfo", {fcSupplierBillId: data.id});
            let maininfo = detailData.maininfo;
            if (this.common.isBlank(maininfo.makeupFee))
            {
                maininfo.makeupFee = 0;
            }
            let msg = '审核账单后不可回退,是否审核账单？<br>'+
                '账单月份：'+maininfo.billMonth+'<br>' +
                '账单金额：￥'+maininfo.totalFee+' 元<br>' +
                '运输金额：￥'+maininfo.waybillFee+' 元 '+detailData.details[0].length+'条记录<br>' +
                '仓储金额：￥'+maininfo.storehouseFee+' 元 '+detailData.details[1].length+'条记录<br>' +
                '器具金额：￥'+maininfo.packCostFee+' 元 '+detailData.details[2].length+'条记录<br>' +
                // '补录金额：￥'+maininfo.makeupFee+' 元 '+detailData.details[3].length+'条记录<br>' +
                '账单备注： '+maininfo.remark;
            let that = this;
            that.$confirm(msg, "提示",{
                dangerouslyUseHTMLString: true,
            }).then(() => {
                that.common.postUrl("fcSupplierBillTF", "confirmFcSupplierBillInfo", data, function (data) {
                    that.doQuery();
                    that.$message.success("审核成功！");
                }, null, '', true);
            }).catch(() => {
            });

        },
        /**
         * 删除账单
         */
        deleteFcSupplierBill()
        {
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length < 1)
            {
                this.$message.error("请至少选择一条需要删除的账单！");
                return false;
            }
            let fcSupplierBillIds=[];
            let billNums = '';
            for (let i = 0; i < selectData.length; i++) {
                let data = selectData[i];
                if (data.confirmState === enumData.FC_CONFIRM_STATE.CONFIRMED) {
                    this.$message.error("已审核的账单,无法删除！");
                    return false;
                }
                fcSupplierBillIds.push(data.id);
                billNums = billNums+","+data.billNum;
            }
            billNums=billNums.substring(1);
            let that = this;
            that.$confirm("确认需要删除账单？", "提示").then(() =>{
                that.common.postUrl("fcSupplierBillTF", "delFcSupplierBillInfo", {fcSupplierBillIds,billNums}, function (data)
                {
                    that.doQuery();
                    that.$message.success("删除成功！");
                },null,'',true);
            }).catch(() =>{});
        },
        /**
         * 双击
         */
        dblclickItem(data)
        {
            this.toFcSupplierBillDetail(data);
        },
        /**
         * 账单明细
         */
        toFcSupplierBillDetail(data)
        {
            let selectItems = this.$refs.table.getSelectItem();
            if (this.common.isNotBlank(data))
            {
                selectItems[0] = data;
            }
            if(selectItems.length !== 1)
            {
                this.$message.error("请选择一条需要查看的账单！");
                return false;
            }
            this.$emit('openTab', {
                urlName: '账单明细',
                urlId: 'supplierBillDetaill_' + selectItems[0].id,
                urlPathName: "/fc",
                urlPath: "/pt/fc/supplierBill/detail/billDetail.vue",
                query: {fcSupplierBillId: selectItems[0].id},
            });
        },
        /**
         * 账单修改
         */
        updateFcSupplierBill()
        {
            let selectItems = this.$refs.table.getSelectItem();
            if(selectItems.length !== 1)
            {
                this.$message.error("请选择一条需要修改的账单！");
                return false;
            }
            let data = selectItems[0];
            if(data.confirmState === enumData.FC_CONFIRM_STATE.CONFIRMED)
            {
                this.$message.error("已审核的账单不允许修改！");
                return false;
            }
            this.$emit('openTab', {
                urlName: '账单修改',
                urlId: 'updateSupplierBillDetaill_' + selectItems[0].billId,
                urlPathName: "/fc",
                urlPath: "/pt/fc/supplierBill/update/updateSupplierBillMain.vue",
                query: {fcSupplierBillId: data.id,unShowCheck: 1,},
            });
        },
        /**
         * 关闭当前页面
         */
        closePage() {
            this.$parent.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId);
        },
        forceUpdate(){
            this.$forceUpdate();
        },
        async addMakeup(flag) {
            if (flag) {
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length !== 1) {
                    this.$message.error("请选择一条需要账单补录的账单！");
                    return false;
                }
                if(selectData[0].storehouseFee>0){
                    let accrualMonthInfo = await this.common.postUrl("commonTF", "getAccrualMonth", {});
                    if(accrualMonthInfo.specialAuth==0){
                        var date = new Date(selectData[0].billMonth);
                        date = new Date(date.getFullYear(), date.getMonth() + accrualMonthInfo.accrualMonth+1, 1);
                        var now = new Date();
                        if(now>date){
                            this.$message.error("不能跨多月做账单补录！");
                            return false;
                        }
                    }
                }

                this.makeupInfo = this.common.copyObj(selectData[0]);
                this.makeupInfo.billId = this.makeupInfo.id;
                this.makeupInfo.id = '';
                this.makeupInfo.makeupFee = '';
                if(selectData[0].regionId!=1){
                    this.feeTypeDisable=true;
                    this.makeupInfo.feeType="2";
                    this.changeFeeType();
                }else{
                    this.feeTypeDisable=false;
                }

                let that = this;
                this.common.postUrl("fcSupplierBillTF", "queryAllBillCustTenantInfo", {billId: selectData[0].id}, function (data) {
                    that.custTenantData = data;
                    that.showAddMakeup = true;
                });
            } else {
                this.makeupInfo = {};
                this.shareDatas = [{}];
                this.showAddMakeup = false;
            }
            this.$forceUpdate();
        },
        saveMakeupInfo(){
            let accrualCostTypeData = this.makeupInfo.accrualCostTypeData;
            if(this.common.isNotBlank(accrualCostTypeData) && accrualCostTypeData.length > 0)
            {
                this.makeupInfo.accrualCostType = accrualCostTypeData[0];
                if (accrualCostTypeData.length > 1)
                {
                    this.makeupInfo.accrualCostSubType = accrualCostTypeData[1];
                }
            }
            if(this.common.isBlank(this.makeupInfo.feeType)){
                this.$message.error("请选择费用类型！");
                return false;
            }
            if(this.makeupInfo.feeType==2){
                if(this.common.isBlank(this.makeupInfo.accrualCostType)){
                    this.$message.error("请选择成本类型！");
                    return false;
                }
                if(this.common.isBlank(this.makeupInfo.accrualMonth)){
                    this.$message.error("请选择成本月份！");
                    return false;
                }
            }
            if(this.common.isBlank(this.makeupInfo.makeupFee)){
                this.$message.error("请输入补录费用！");
                return false;
            }
            if(this.common.isBlank(this.makeupInfo.taxRate)){
                this.$message.error("请输入税点！");
                return false;
            }
            let that = this;
            let allShareMakeupFee = 0;
            for (let i = 0; i < this.shareDatas.length; i++) {
                let shareData = this.shareDatas[i];
                if(!shareData.custTenantId){
                    this.$message.error("请选择第"+(i+1)+"行的客户");
                    return false;
                }
                if(!shareData.makeupFee){
                    this.$message.error("请输入第"+(i+1)+"行的分摊金额");
                    return false;
                }
                allShareMakeupFee = this.common.accAdd(allShareMakeupFee,shareData.makeupFee);
            }
            if(allShareMakeupFee!=this.makeupInfo.makeupFee){
                this.$message.error("没有把所有补录金额分摊！");
                return false;
            }
            this.makeupInfo.shareDatas = this.shareDatas;
            that.common.postUrl("fcSupplierBillTF", "saveMakeupInfo", this.makeupInfo, function (data)
            {
                that.doQuery();
                that.$message.success("新增成功！");
                that.showAddMakeup=false;
            },null,'',true);

        },

        /** 添加规格 */
        addShareData() {
            this.shareDatas.push({});
        },
        /** 删除规格 */
        removeShareData(index) {
            if(this.shareDatas.length>1){
                this.shareDatas.splice(index, 1);
            }
        },
        exportExcel()
        {
            let selecctData = this.$refs.table.getSelectItem();
            if (selecctData.length === 0)
            {
                this.$message.error("请至少选择一条数据");
                return false;
            }
            let param = {billIds:[]};
            for (let i = 0; i < selecctData.length; i++)
            {
                param.billIds.push(selecctData[i].id);
            }
            param.fileSubName = 'xlsx';
            param.selfCreateUrl = 'fcSupplierBillTF|downloadSupplierBillExcelById';
            this.common.downloadExcelFile('', param, '', '', '', 'unconfirmedBillDetailTable');
        },
        showImg(data){
            if(!data.imgUrl){
                // this.$message.error("没有图片~");
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
    },
    computed:{
        formData(){
            return [
                {"name":"账单编号","placeholder":"账单编号","model":"billNum","type":"textarea","isshow":true},
                {"name":"账单月份","model":"billMonths","type":"months","isshow":true},
                {"name":"供应商","placeholder":"供应商","model":"supplierTenantIds","type":"select","options":this.supplierData,"label":"supplierName","value":"tenantId","clearable":true,"multiple":true,"filterable":true,"method":"doQuery","isshow":true},
                {"name":"所属区域","model":"regionId","type":"select","options":this.regionData,"label":"regionName","value":"id","clearable":true,"method":"changeRegion","isshow":true},
                {"name":"所属部门","model":"orgId","type":"select","options":this.orgData,"label":"orgName","value":"id","clearable":true,"method":"doQuery","isshow":true},
                {"name":"结算主体","model":"settleBody","type":"select","options":this.settleBodyData,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
            ]
        }
    },
}
