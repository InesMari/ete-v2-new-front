import enumData from "@/page/pt/enum.js"
import tableCommon from "@/components/table/tableCommon.vue"
import fileViewer from "@/components/myFile/file-viewer.vue";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'unconfirmedBill',
    data() {
        return {
            head: [
                {"name": "账单编号", "code": "billNum", "width": "200", "type": "text"},
                {"name": "附件", "code": "", "width": "120", "type": "diy"},
                {"name": "账单月份", "code": "billMonth", "width": "200", "type": "text"},
                {"name": "结算主体", "code": "settleBodyName", "width": "250", "type": "text"},
                {"name": "客户名称", "code": "tenantName", "width": "250", "type": "text"},
                {"name": "客户代表", "code": "custManageUserName", "width": "150", "type": "text"},
                {"name": "对账客户", "code": "custTenantName", "width": "250", "type": "text"},
                {"name": "账单金额", "code": "totalFee", "width": "150", "type": "text"},
                {"name": "账单备注", "code": "remark", "width": "200", "type": "text"},
                {"name": "所属区域", "code": "regionName", "width": "120", "type": "text"},
                {"name": "所属部门", "code": "orgName", "width": "160", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "100", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"}
            ],
            customerData: [],//客户下拉
            customerAllData: [],//对账客户下拉
            query: this.initQuery(),
            showAddMakeup:false,
            makeupInfo:{},
            feeTypeData:[],
            srcList: [],
            settleBodyData:[],
        }
    },

    mounted() {
    	this.init();
        this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        fileViewer,
        tableCommon,
        enumData,
        searchList,
    },
    methods: {
        /**
         * 初始化下拉
         */
        init() {
            let that = this;
            //客户
			that.common.postUrl("customerTF", "queryCustomerListNoPage", {sts: enumData.STS.VALID}, function (data) {
            	that.customerData = data;
            });
			//对账客户
            that.common.postUrl("customerTF", "queryCustomerData", {isLoadSubCompany: true}, function (data) {
                that.customerAllData = data;
            });
            that.common.postUrl("commonTF", "getSysStaticData",{codeType: "CUST_BILL_FEE_TYPE"}, function (data) {
                that.feeTypeData = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "INVOICING_COMPANY"}, function (data) {
                that.settleBodyData = data;
            });
        },
        forceUpdate(){
            this.$forceUpdate();
        },
        addMakeup(flag){
            if(flag){
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length !== 1) {
                    this.$message.error("请选择一条需要账单补录的账单！");
                    return false;
                }

                //2月的对账单，3月5日以后才可以补录
                var date = new Date(selectData[0].billMonth);
                date =  new Date(date.getFullYear(),date.getMonth()+1,0);
                date.setDate(date.getDate() + 5);
                var now = new Date();
                // if(now<date){
                //     this.$message.error("账单月份下月5日以后才能做账单补录！");
                //     return false;
                // }
                this.makeupInfo= this.common.copyObj(selectData[0]);
                this.makeupInfo.makeupFee = '';
                this.showAddMakeup=true;
            }else{
                this.makeupInfo={};
                this.showAddMakeup=false;
            }
        },
        saveMakeupInfo(){
            if(this.common.isBlank(this.makeupInfo.feeType)){
                this.$message.error("请选择费用类型！");
                return false;
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
            that.common.postUrl("fcCustBillTF", "saveMakeupInfo", this.makeupInfo, function (data)
            {
                that.doQuery();
                that.$message.success("新增成功！");
                that.showAddMakeup=false;
            },null,'',true);

        },
        /**
         * 初始化查询条件
         * @returns {{billMonth: string, tenantId: string, billNum: string}}
         */
        initQuery() {
            return this.query = {
                billNum: '',
                billMonths: [],
                tenantId: this.common.isBlank(this.$route.query.tenantId) ? '' : this.$route.query.tenantId.toString(),//客户详情账单管理跳转
                custTenantId: '',
                confirmState: enumData.FC_CONFIRM_STATE.UNCONFIRMED,//未确认
                orgName:'',
            };
        },
        /**
         * 清空
         */
        clear() {
            return this.query = {
                confirmState: enumData.FC_CONFIRM_STATE.UNCONFIRMED,//未确认
            };
        },
        /**
         *
         */
        async doQuery(query = this.query) {
            this.query = query;//赋值
            let {items} = await this.$refs.table.load("fcCustBillTF", "queryCustomerBillPage", this.query);
			this.$refs.table.resetData(items);
        },
        /**
         * 新增账单
         * @returns {boolean}
         */
        addFcCustomerBill()
        {
            this.$emit('openTab', {
                urlName: '新增大客户账单',
                urlId: 'addCustomerBillMain',
                urlPathName: "/fc",
                urlPath: "/pt/fc/custBill/add/addCustomerBillMain.vue",
                query: {},
            });
        },
        /**
         * 账单确认
         */
        async sureFcCustomerBill() {
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
            if (data.applyInvoiceState !== enumData.APPLY_INVOICE_STATE.NOT_APPLY) {
                this.$message.error("已申请发票发的账单,无法再次审核！");
                return false;
            }
            if (data.receiveState !== enumData.RECEIVE_STATE.NOT_REGISTER) {
                this.$message.error("已收款登记的账单,无法再次审核！");
                return false;
            }
            let detailDatas = await this.common.postUrl("fcCustBillTF", "queryCustomerBillPage", {billId: data.billId, flag: 1});
            let detailData = detailDatas.items[0];
            let listArray = await this.common.postUrl("fcCustBillTF", "queryCustomerBillDetailList", {billId: data.billId, flag: 1});

            let msg = '审核账单后不可回退,是否审核账单？<br>'+
                '账单月份：'+detailData.billMonth+'<br>' +
                '账单金额：￥'+detailData.totalFee+' 元<br>' +
                '运输金额：￥'+detailData.waybillFee+' 元 '+listArray[0].length+'条记录<br>' +
                '仓储金额：￥'+detailData.storehouseFee+' 元 '+listArray[1].length+'条记录<br>' +
                '其他金额：￥'+detailData.otherFee+' 元 '+listArray[2].length+'条记录<br>' +
                '器具金额：￥'+detailData.packLeaseFee+' 元 '+listArray[3].length+'条记录<br>' +
                // '补录金额：￥'+detailData.makeupFee+' 元 '+listArray[3].length+'条记录<br>' +
                '账单备注： '+detailData.remark;
            let that = this;
            that.$confirm(msg, "提示",{
                    dangerouslyUseHTMLString: true,
                }).then(() => {
                that.common.postUrl("fcCustBillTF", "sureFcCustomerBill", data, function (data) {
                    that.doQuery();
                    that.$message.success("审核成功！");
                }, null, '', true);
            }).catch(() => {
            });

        },
        /**
         * 删除账单
         */
        deleteFcCustomerBill()
        {
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的账单！");
                return false;
            }
            let data = selectData[0];
            if (data.confirmState === enumData.FC_CONFIRM_STATE.CONFIRMED)
            {
                this.$message.error("已确认的账单,无法删除！");
                return false;
            }
            if (data.applyInvoiceState !== enumData.APPLY_INVOICE_STATE.NOT_APPLY)
            {
                this.$message.error("已申请发票发的账单,无法删除！");
                return false;
            }
            if (data.receiveState !== enumData.RECEIVE_STATE.NOT_REGISTER)
            {
                this.$message.error("已收款登记的账单,无法删除！");
                return false;
            }
            let that = this;
            that.$confirm("确认需要删除账单？", "提示").then(() =>{
                that.common.postUrl("fcCustBillTF", "deleteFcCustomerBill", data, function (data)
                {
                    that.doQuery();
                    that.$message.success("删除成功！");
                },null,'',true);
            }).catch(() =>{});
        },
        /**
         * 账单明细
         */
        toCustomerBillDetail(data)
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
                urlId: 'billDetail_' + selectItems[0].billId,
                urlPathName: "/fc",
                urlPath: "/pt/fc/custBill/detail/billDetail.vue",
                query: {billId: selectItems[0].billId, flag: 1,unShowCheck: 1,},
            });
        },
        /**
         * 账单修改
         */
        updateCustomerBill()
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
                this.$message.error("已确认的账单不允许修改！");
                return false;
            }
            this.$emit('openTab', {
                urlName: '账单修改',
                urlId: 'updateBillDetail_' + selectItems[0].billId,
                urlPathName: "/fc",
                urlPath: "/pt/fc/custBill/update/updateCustomerBillMain.vue",
                query: {billId: data.billId, flag: 2,unShowCheck: 1,},
            });
        },
        showImg(data){
            if(!data.imgUrl){
                // this.$message.error("没有附件~");
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
            }
            else{
                data.imgUrl = data.imgUrl.replace("_big", "");
                if(data.imgUrl.indexOf(".pdf")>-1){   //查看pdf
                    // let index = data.imgUrl.indexOf("?");
                    // let url = data.imgUrl.substring(index,0);
                    window.open(data.imgUrl,'_blank')
                }else{  //下载文件
                    this.common.downloadFile(data.imgUrl)
                }
            }
            // else{
            //     data.imgUrl = data.imgUrl.replace("_big", "");
            //     let url = data.imgUrl;
            //     let fileType = this.common.getFileType('',url);
            //     if(fileType=='pdf'){   //查看pdf
            //         let idx = url.indexOf("?");
            //         if(idx>=0){
            //             url = url.substring(idx,0);
            //         }
            //         this.srcList=[];
            //         this.srcList.push(url);
            //         this.showViewer = true;
            //     }else if(fileType=='excel'||fileType=='word'||fileType=='ppt'){
            //         this.srcList=[];
            //         this.srcList.push(url);
            //         this.showViewer = true;
            //     }else{  //下载文件
            //         this.common.downloadFile(url)
            //     }
            // }
        },
        /**
         * 关闭当前页面
         */
        closePage() {
            this.$parent.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId);
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
                param.billIds.push(selecctData[i].billId);
            }
            param.fileSubName = 'xlsx';
            param.selfCreateUrl = 'fcCustBillTF|downloadCustBillExcelById';
            this.common.downloadExcelFile('', param, '', '', '', 'unCustomerConfirmedBillDetail');
        },
    },
    computed:{
        formData(){
            return [
                {"name":"账单编号","model":"billNum","type":"input","isshow":true},
                {"name":"账单月份","model":"billMonths","type":"months","isshow":true},
                {"name":"客户名称","model":"tenantId","type":"select","options":this.customerData, "label":"name","value":"tenantId","method":"doQuery","isshow":true},
                {"name":"对账客户","model":"custTenantId","type":"select","options":this.customerAllData, "label":"name","value":"tenantId","method":"doQuery","isshow":true},
                {"name":"所属部门","model":"orgName","type":"input","placeholder":"所属部门","isshow":true},
                {"name":"结算主体","model":"settleBody","type":"select","options":this.settleBodyData,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
            ]
        }
    },
}
