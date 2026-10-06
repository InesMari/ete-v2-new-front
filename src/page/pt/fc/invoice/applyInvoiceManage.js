import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum.js";
import searchList from "@/components/searchList/searchList.vue";
import fileViewer from '@/components/myFile/file-viewer.vue';

export default {
    name: 'applyInvoiceManage',
    data() {
        return {
            head: [
                {"name": "账单编号", "code": "billNum", "width": "130", "type": "diy"},
                {"name": "附件", "code": "imgUrl", "width": "120", "type": "diy"},
                {"name": "账单月份", "code": "billMonth", "width": "110", "type": "text"},
                {"name": "客户名称", "code": "custTenantName", "width": "250", "type": "text"},
                {"name": "客户代表", "code": "custManageUserName", "width": "150", "type": "text"},
                {"name": "审核状态", "code": "verifyStateName", "width": "110", "type": "text"},
                {"name": "是否已开票", "code": "invoiceStateName", "width": "110", "type": "text"},
                {"name": "发票申请编号", "code": "applyInvoiceNum", "width": "110", "type": "text"},
                {"name": "用途", "code": "invoiceTypeName", "width": "120", "type": "text"},
                {"name": "发票金额(含税)", "code": "applyInvoiceFee", "width": "110", "type": "text"},
                {"name": "发票税率(%)", "code": "invoiceTax", "width": "110", "type": "text"},
                {"name": "购买方名称", "code": "fcCustTenantName", "width": "250", "type": "text"},
                {"name": "纳税人识别号", "code": "taxNumber", "width": "200", "type": "text"},
                {"name": "公司地址", "code": "address", "width": "300", "type": "text"},
                {"name": "公司电话", "code": "regPhone", "width": "110", "type": "text"},
                {"name": "开户行", "code": "regBank", "width": "200", "type": "text"},
                {"name": "账号", "code": "regAccount", "width": "200", "type": "text"},
                {"name": "备注", "code": "remark", "width": "110", "type": "text"},
                {"name": "客户要求票面备注", "code": "customerRequestRemark", "width": "300", "type": "text"},
                {"name": "客户其他要求", "code": "otherCustomerRequest", "width": "200", "type": "text"},
                {"name": "结算主体", "code": "invoicingCompanyName", "width": "200", "type": "text"},
                {"name": "发票号码", "code": "invoiceNum", "width": "200", "type": "text"},
                {"name": "开票日期", "code": "invoiceDate", "width": "200", "type": "text"},
                {"name": "开票备注", "code": "invoiceRemark", "width": "200", "type": "text"},
                {"name": "所属区域", "code": "regionName", "width": "120", "type": "text"},
                {"name": "所属部门", "code": "orgName", "width": "160", "type": "text"},
                {"name": "提交人", "code": "createUserName", "width": "110", "type": "text"},
                {"name": "提交时间", "code": "createDate", "width": "130", "type": "text"},
                {"name": "确认人", "code": "verifyUserName", "width": "110", "type": "text"},
                {"name": "确认时间", "code": "verifyDate", "width": "110", "type": "text"},
                {"name": "开票人", "code": "invoiceUserName", "width": "110", "type": "text"}
            ],
            loadParam: {
                custTenantName: this.$route.query.tenantName,//客户详情发票管理跳转
                verifyState: this.$route.query.verifyState,
                orgName:''
            },
            invoiceInfo: {invoiceNum: "", invoiceRemark: "",},//开票申请
            custBillInfo: {},//账单信息
            copyCustBillInfo: {},//临时账单信息
            verifyStateData: [],//审核状态
            invoiceStateData: [],//是否已开票
            invoiceTypeData: [],//发票类型
            applyInvoiceTypeData: [],//开票金额类型
            invoicingCompanyData: [],//开票金额类型
            title: '',//弹窗标题
            uptitle: '',//弹窗标题
            showVerify: false,//开票审核
            verify: false,//开票审核
            isLock: false,//查看信息
            invoiceDeal: false,//开票处理
            upInvoiceDeal: false,//修改发票

            showVerifyBatch: false,//修改申请
            srcList: [],
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.doQuery();
        this.init();
    },
    /**
     * 组件
     */
    components: {
        fileViewer,
        tableCommon,
        searchList
    },
    /**
     * 绑定函数
     */
    methods: {
        doQuery(query=this.loadParam) {
            this.loadParam = query;
          if(this.common.isNotBlank(this.loadParam.invoiceDate) && this.loadParam.invoiceDate.length === 2){
            this.loadParam.startInvoiceDate = this.loadParam.invoiceDate[0];
            this.loadParam.endInvoiceDate = this.loadParam.invoiceDate[1];
          }else{
            this.loadParam.startInvoiceDate = '';
            this.loadParam.endInvoiceDate = '';
          }
            this.$refs.table.load("fcApplyInvoiceTF", "queryApplyInvoicePage", this.loadParam);
        },
        init() {
            let that = this;
            //审核状态
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"VERIFY_STATE"}, function (data) {
                that.verifyStateData = data;
            });
            //是否已开票
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"INVOICE_STATE"}, function (data) {
                that.invoiceStateData = data;
            });
            //发票类型
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"FC_INVOICE_TYPE"}, function (data) {
                that.invoiceTypeData = data;
            });
            //开票金额类型
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"APPLY_INVOICE_TYPE"}, function (data) {
                that.applyInvoiceTypeData = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType:"INVOICING_COMPANY"}, function (data) {
                that.invoicingCompanyData = data;
            });
        },
        clear() {
            this.loadParam = {};
        },
        dblclickItem(data){
            this.toShowVerify(true,5,data);
        },
        /**
         * 批量开票审核
         * @param type
         */
        toShowVerify2(type)
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length === 0)
            {
                this.$message.error("请至少选择一条数据!");
                return;
            }
            if (selectData.length > 1)//多条批量处理
            {
                let invoiceIds = "";
                let applyInvoiceNums = "";
                for (let i = 0; i < selectData.length; i++)
                {
                    let item = selectData[i];
                    applyInvoiceNums = applyInvoiceNums + item.applyInvoiceNum + ",";
                    invoiceIds = invoiceIds + item.invoiceId + ",";
                    if (item.verifyState != 0)
                    {
                        this.$message.error("第" + (i + 1) + "条数据不是未审核的！");
                        return;
                    }
                }

                let param = {invoiceIds, applyInvoiceNums};
                this.$confirm("您正在审核发票申请：" + applyInvoiceNums + "是否继续?", "批量审核",{
                    confirmButtonText: '审核通过',
                    cancelButtonText: '审核不通过',
                    type: 'warning',
                    center: true,
                    closeOnClickModal: false,
                    distinguishCancelAndClose: true
                }).then(async ({value}) =>{
                    param.verifyState = 1;
                    await this.common.postUrl("fcApplyInvoiceTF", "verifyInvoiceBatch", param);
                    await this.doQuery();
                    this.$parent.loadTodoData();
                    this.$message.success("审核成功！");
                }).catch(async action =>{
                    if ( action === 'cancel')
                    {
                        param.verifyState = 2;//审核不通过
                        await this.common.postUrl("fcApplyInvoiceTF", "verifyInvoiceBatch", param);
                        await this.doQuery();
                        this.$parent.loadTodoData();
                        this.$message.success("审核成功！")
                    }
                });
            }
            else
                this.toShowVerify(true, type)
        },
        /**
         * 批量开票处理
         * @param type
         */
        toShowVerify3(type)
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length === 0)
            {
                this.$message.error("请至少选择一条数据!");
                return;
            }
            if (selectData.length > 1)//多条批量处理
            {
                let invoiceIds = "";
                let applyInvoiceNums = "";
                this.invoiceInfo.applyInvoiceNumsize = selectData.length;
                for (let i = 0; i < selectData.length; i++)
                {
                    let item = selectData[i];
                    applyInvoiceNums +=  "," + item.applyInvoiceNum;
                    invoiceIds += "," + item.invoiceId;
                    if (item.verifyState != enumData.verifyState.approved)
                    {
                        this.$message.error("第" + (i + 1) + "条数据不是审核通过状态！");
                        return;
                    }
                    if (item.invoiceState == enumData.invoiceState.invoiced) {
                        this.$message.error("当前开票申请已是已开票状态,请修改发票!");
                        return;
                    }
                }
                this.toShowVerifyBatch(true);
                this.invoiceInfo.invoiceIds = invoiceIds.substring(1);
                this.invoiceInfo.applyInvoiceNums = applyInvoiceNums.substring(1);
                this.invoiceInfo.invoiceDate = this.common.formatDate.getDate();
                this.$forceUpdate();
            }else{
                this.toShowVerify(true, type);
            }
        },
        /** 打开关闭 开票审核弹窗 type:1开票审核 2查看信息 3开票处理 4修改发票 5双击查看详情 */
        async toShowVerify(flag, type, obj) {
            if (flag) {
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length != 1 && type != 5) {
                    this.$message.error("请选择一条数据!");
                    return;
                }
                let invoice = selectData[0];
                if (type == 5) {
                    invoice = obj;
                }
                //1开票审核
                if (type == 1 && invoice.verifyState != enumData.verifyState.notReviewed) {
                    this.$message.error("当前开票申请不是未审核状态!");
                    return;
                }
                //3开票处理
                if (type == 3 && invoice.verifyState != enumData.verifyState.approved) {
                    this.$message.error("当前开票申请不是审核通过状态!");
                    return;
                }
                if (type == 3 && invoice.invoiceState == enumData.invoiceState.invoiced) {
                    this.$message.error("当前开票申请已是已开票状态,请修改发票!");
                    return;
                }
                //4修改发票
                if (type == 4 && invoice.invoiceState != enumData.invoiceState.invoiced) {
                    this.$message.error("当前开票申请不是已开票状态!");
                    return;
                }
                this.invoiceInfo = await this.common.postUrl("fcApplyInvoiceTF", "queryApplyInvoiceById", {
                    invoiceId: invoice.invoiceId,
                    type: type
                });
                this.verify = false;
                this.isLock = false;
                this.invoiceDeal = false;
                this.upInvoiceDeal = false;
                if (type == 1) {
                    this.title = "开票审核";
                    this.verify = true;
                } else if (type == 2 || type == 5) {
                    this.title = "查看信息";
                    this.isLock = true;
                } else if (type == 3) {
                    this.title = "开票处理";
                    this.invoiceInfo.invoiceDate = this.common.formatDate.getDate();
                    this.invoiceDeal = true;
                } else if (type == 4) {
                    this.title = "修改发票";
                    this.upInvoiceDeal = true;
                }
                this.showVerify = true;
            } else {
                this.invoiceInfo = {};
                this.showVerify = false;
            }
        },
        toShowVerifyBatch(flag)
        {
            this.showVerifyBatch = flag;
            this.invoiceInfo.invoiceNum = "";
            this.invoiceInfo.invoiceRemark = "";
            this.invoiceInfo.invoiceIds = "";
            this.invoiceInfo.applyInvoiceNums = "";
        },
        /** 开票审核 1审核通过 2审核不通过*/
        verifyInvoice(state) {
            let param = {
                invoiceId: this.invoiceInfo.invoiceId,
                applyInvoiceNum:this.invoiceInfo.applyInvoiceNum,
                verifyState: state
            };
            let that = this;
            this.common.postUrl("fcApplyInvoiceTF", "verifyInvoice", param, function (data) {
                if (that.common.isNotBlank(data)) {
                    that.doQuery();
                    that.$message.success("审核成功!");
                    that.$parent.loadTodoData();
                }
            },null,'',true);
            this.toShowVerify(false);
        },
        verifySureBatch() {
            if(this.common.isBlank(this.invoiceInfo.invoiceNum)){
                // this.$message.error("请输入发票号!");
                // return;
            }
            let param = {
                invoiceIds: this.invoiceInfo.invoiceIds,
                applyInvoiceNums: this.invoiceInfo.applyInvoiceNums,
                invoiceNum: this.invoiceInfo.invoiceNum,
                invoiceDate: this.invoiceInfo.invoiceDate,
                invoiceRemark: this.invoiceInfo.invoiceRemark,
            };
            let that = this;
            this.common.postUrl("fcApplyInvoiceTF", "verifySureBatch", param, function (data) {
                if (that.common.isNotBlank(data)) {
                    that.doQuery();
                    that.$message.success("提交成功!");
                }
            },null,'',true);
            this.toShowVerifyBatch(false);
        },

        /** 开票处理 1提交 2修改*/
        verifySure(type) {
            if(this.common.isBlank(this.invoiceInfo.invoiceNum)){
                this.$message.error("请输入发票号!");
                return;
            }
            let param = {
                invoiceId: this.invoiceInfo.invoiceId,
                invoiceNum: this.invoiceInfo.invoiceNum,
                invoiceDate: this.invoiceInfo.invoiceDate,
                applyInvoiceNum:this.invoiceInfo.applyInvoiceNum,
                invoiceRemark: this.invoiceInfo.invoiceRemark,
                type: type
            };
            let that = this;
            this.common.postUrl("fcApplyInvoiceTF", "verifySure", param, function (data) {
                if (that.common.isNotBlank(data)) {
                    that.doQuery();
                    let message = type==1 ? "提交成功!" : "修改成功!";
                    that.$message.success(message);
                }
            },null,'',true);
            this.toShowVerify(false);
        },
        /** 撤销申请 */
        cancleApplyInvoice() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length === 0)
            {
                this.$message.error("请至少选择一条数据!");
                return;
            }
            let invoiceIds = "";
            let applyInvoiceNums = "";
            for (let i = 0; i < selectData.length; i++) {
                let item = selectData[i];
                applyInvoiceNums = applyInvoiceNums + item.applyInvoiceNum + ",";
                invoiceIds = invoiceIds + item.invoiceId + ",";
                if(selectData[0].invoiceState == enumData.invoiceState.invoiced){
                    this.$message.error("第" + (i + 1) + "条数据不是未开票的！");
                    return;
                }
            }
            let param = {invoiceIds, applyInvoiceNums};

            let that = this;
            const h = this.$createElement;
            this.$msgbox({
                title: "撤销申请",
                message: h('p', null, [
                    h('i', { style: 'color: red' }, "请确认撤销开票申请？"),
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: "warning",
            }).then(() => {
                this.common.postUrl("fcApplyInvoiceTF", "cancleApplyInvoiceBatch", param, function (data) {
                    if (that.common.isNotBlank(data)) {
                        that.doQuery();
                        that.$message.success("撤销成功!");
                    }
                },null,'',true);
            }).catch(() => {
                this.$message.info("已取消操作");
            });
        },
        /**
         * 确认账单的明细
         */
        toCustomerConfirmedBillDetail(data)
        {
            this.$emit('openTab', {
                urlName: '确认账单明细',
                urlId: 'confirmBillDetail',
                urlPathName: "/fc",
                urlPath: "/pt/fc/custBill/detail/confirmBillDetail.vue",
                query: {billId: data.billId,tabId: enumData.FC_CUST_BILL_ITEM_TYPE.APPLY_INVOICE, flag: 1},
            });
        },
        /**
         * 撤销开票
         */
        revokeInvoicing()
        {
            let selectItem = this.$refs.table.getSelectItem();
            if (selectItem.length ===0)
            {
                this.$message.error("请至少选择一条需要撤销开票的申请数据！");
                return false;
            }
            let billId = selectItem[0].billId;
            let invoiceIds = [];
            let applyInvoiceNums= [];
            for (let i = 0; i < selectItem.length; i++) {
                if(selectItem[i].invoiceState!=enumData.invoiceState.invoiced){
                    this.$message.error("第" + (i + 1) + "条数据不是已开票的！");
                    return;
                }
                if(selectItem[i].billId!=billId){
                    this.$message.error("第" + (i + 1) + "条数据与第一条数据不是同一个账单，同一账单的多张发票才可以一起撤销！");
                    return;
                }
                invoiceIds.push(selectItem[i].invoiceId);
                applyInvoiceNums.push(selectItem[i].applyInvoiceNum);
            }

            let that = this;
            that.$confirm("确定需要撤销开票,把开票申请回退到未开票状态？", "提示").then(async () =>{
                await that.common.postUrl("fcApplyInvoiceTF", "revokeInvoicingBatch", {invoiceIds,applyInvoiceNums},null,null,'',true);
                that.doQuery();
                that.$message.success("撤销开票成功!");
            }).catch(() =>{})
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
        /**
         * 导出
         */
        downloadExcel() {
            this.$refs.table.downloadExcelFile();
        },
    },
computed:{
        formData(){
            return [
                {"name":"账单编号","model":"billNum","type":"input","placeholder":"账单编号","isshow":true},
                {"name":"账单月份","model":"billMonth","type":"month","isshow":true},
                {"name":"客户名称","model":"custTenantName","type":"input","placeholder":"客户名称","isshow":true},
                {"name":"发票号码","model":"invoiceNum","type":"input","placeholder":"发票号码","isshow":true},
                {"name":"开票备注","model":"invoiceRemark","type":"input","placeholder":"开票备注","isshow":true},
                {"name":"提交人","model":"createUserName","type":"input","placeholder":"提交人","isshow":true},
                {"name":"审核状态","model":"verifyState","type":"select","options":this.verifyStateData,"label":"codeName","value":"codeValue","placeholder":"审核状态","method":"doQuery","isshow":true},
                {"name":"是否已开票","model":"invoiceState","type":"select","options":this.invoiceStateData,"label":"codeName","value":"codeValue","placeholder":"是否已开票","method":"doQuery","isshow":true},
                {"name":"结算主体","model":"invoicingCompany","type":"select","options":this.invoicingCompanyData,"label":"codeName","value":"codeValue","placeholder":"结算主体","method":"doQuery","isshow":true},
                {"name":"所属部门","model":"orgName","type":"input","placeholder":"所属部门","isshow":true},
                {"name":"购买方名称","model":"fcCustTenantName","type":"input","placeholder":"购买方名称","isshow":true},
                {"name":"开票日期","model":"invoiceDate","type":"daterange","isshow":true},
            ]
        }
    },
}
