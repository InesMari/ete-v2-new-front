import enumData from "@/page/pt/enum.js"
import tableCommon from "@/components/table/tableCommon.vue"
import searchList from "@/components/searchList/searchList.vue";
import fileViewer from '@/components/myFile/file-viewer.vue';

export default {
    name: 'confirmedBill',
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
                {"name": "核销金额", "code": "writeoffFee", "width": "150", "type": "text"},
                {"name": "发票申请状态", "code": "applyInvoiceStateName", "width": "150", "type": "text"},
                {"name": "已申请发票金额", "code": "applyInvoiceFee", "width": "150", "type": "text"},
                {"name": "未申请发票金额", "code": "noApplyInvoiceFee", "width": "150", "type": "text"},
                {"name": "应收金额", "code": "receivableFee", "width": "150", "type": "text"},
                {"name": "已收金额", "code": "receivedFee", "width": "150", "type": "text"},
                {"name": "未收金额", "code": "noReceiveFee", "width": "150", "type": "text"},
                {"name": "账单备注", "code": "remark", "width": "200", "type": "text"},
                {"name": "所属区域", "code": "regionName", "width": "120", "type": "text"},
                {"name": "所属部门", "code": "orgName", "width": "160", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "100", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "审核人", "code": "confirmUserName", "width": "100", "type": "text"},
                {"name": "审核时间", "code": "confirmDate", "width": "150", "type": "text"}
            ],
            detailHead:
            [
                {"name": "发票申请编号", "code": "applyInvoiceNum", "width": "120", "type": "text"},
                {"name": "发票类型", "code": "invoiceTypeName", "width": "120", "type": "text"},
                {"name": "发票金额(含税)", "code": "applyInvoiceFee", "width": "120", "type": "text"},
                {"name": "发票税率(%)", "code": "invoiceTax", "width": "80", "type": "text"},
                {"name": "审核状态", "code": "verifyStateName", "width": "80", "type": "text"},
                {"name": "购买方名称", "code": "tenantName", "width": "200", "type": "text"},
                {"name": "纳税人识别号", "code": "taxNumber", "width": "180", "type": "text"},
                {"name": "公司地址", "code": "address", "width": "250", "type": "text"},
                {"name": "公司电话", "code": "regPhone", "width": "180", "type": "text"},
                {"name": "开户行", "code": "regBank", "width": "180", "type": "text"},
                {"name": "开户卡号", "code": "regAccount", "width": "180", "type": "text"},
            ],
            customerData: [],//客户下拉
            applyInvoiceStateData: [],
            query: this.initQuery(),
            invoiceShow: false,//展示发票申请
            billNum: "",//申请发票标题变量
            custBillInfo: {},
            billInvoiceData: this.initBillInvoiceData(),
            invoicingCompanyData:[],//开票公司
            invoiceTypeData:[],//发票类型
            verifyStateData:[],//审核状态
            upInvoiceDetailDialog:false,//发票申请明细
            queryDetail: {},
            tip: "开票申请",
            showTable: true,
            customerRequestRemarkData:[],//客户要求票面备注
            srcList: [],

            invoicingCompanyDisable:false,
        }
    },
    computed:{
        formData(){
            return [
                {"name":"账单编号","model":"billNum","type":"input","isshow":true},
                {"name":"账单月份","model":"billMonths","type":"months","isshow":true},
                {"name":"客户名称","model":"tenantId","type":"select","options":this.customerData, "label":"name","value":"tenantId","method":"doQuery","isshow":true},
                {"name":"发票申请状态","model":"applyInvoiceState","type":"select","options":this.applyInvoiceStateData, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                {"name":"确认人","model":"confirmUserName","type":"input","isshow":true, "if": true},
                {"name":"对帐客户","model":"acctName","type":"input","placeholder":"对帐客户","isshow":true},
                {"name":"所属部门","model":"orgName","type":"input","placeholder":"所属部门","isshow":true},
                {"name":"结算主体","model":"settleBody","type":"select","options":this.invoicingCompanyData,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
            ]
        }
    },
    mounted() {
		this.init();
        this.doQuery();
    },
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
            //客户
            this.customerData = await this.common.postUrl("customerTF", "queryCustomerListNoPage", {sts: enumData.STS.VALID});
			//申请开票静态
            this.applyInvoiceStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "APPLY_INVOICE_STATE"});
            //开票公司
            this.invoicingCompanyData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "INVOICING_COMPANY"});
            //审核状态
            this.verifyStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VERIFY_STATE"});
            this.invoiceTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "CUST_INVOICE_TYPE"});
            // this.loadAllInvoiceTypeData();
        },
        /**
         * 搜索查询
         * @param queryString
         * @param cb
         */
        querySearch(queryString, cb)
        {
            let restaurants = this.invoiceTypeData;
            let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        /**
         * 搜索查询
         * @param queryString
         * @param cb
         */
        querySearch2(queryString, cb)
        {
            let restaurants = this.customerRequestRemarkData;
            let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            cb(results);
        },
        /**
         * 过滤匹配
         * @param queryString
         * @returns {function(*): boolean}
         */
        createFilter(queryString)
        {
            return (restaurant) => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
            };
        },
        /**
         * 选择处理
         * @param item
         */
        handleSelect(item)
        {

        },
        // /**
        //  * 加载发票类型
        //  */
        // loadAllInvoiceTypeData()
        // {
        //     let that = this;
        //     //发票类型
        //     that.common.postUrl("fcCustBillTF", "loadAllInvoiceTypeData", {}, function (data)
        //     {
        //         that.invoiceTypeData = data;
        //     });
        // },
        /**
         * 初始化发票申请数据
         * @returns {{invoiceType: string, applyInvoiceFee: string, invoiceTax: string, remark: string, applyInvoiceType: string}[]}
         */
        initBillInvoiceData()
        {
            return this.billInvoiceData = [];
        },
        /**
         * 初始化查询条件
         * @returns {{billMonth: string, applyInvoiceState: string, tenantId: string, confirmState: number, billNum: string}}
         */
        initQuery() {
            return this.query = {
                billNum: '',
                billMonths: [],
                tenantId: this.common.isBlank(this.$route.query.tenantId) ? '' : this.$route.query.tenantId.toString(),//客户详情账单管理跳转
                applyInvoiceState: '',
                confirmUserName: '',
                confirmState: enumData.FC_CONFIRM_STATE.CONFIRMED,//已确认
                acctName:'',
                orgName:'',
            };
        },
        /**
         *
         */
		async doQuery(query = this.query) {
            this.query = query;//赋值
			await this.$refs.table.load("fcCustBillTF", "queryCustomerBillPage", this.query);
        },
        /**
         * 打开发票申请
         * @param isOpen 打开弹窗
         * @param flag 控制展示列表
         */
        async showInvoice(isOpen, flag)
        {
            this.customerRequestRemarkData = [];//清空客户要求票面备注
            if (isOpen)
            {
                let selectItem = this.$refs.table.getSelectItem();
                if (selectItem.length !== 1)
                {
                    this.$message.error("请选择一条已审核的账单！");
                    return false;
                }
                if (selectItem[0].applyInvoiceState == enumData.APPLY_INVOICE_STATE.ALL_APPLY)
                {
                    this.$message.error("账单金额已经全部申请开票，无法操作！");
                    return false;
                }
                this.tip = flag ? "开票申请" : "金额核销";
                this.billNum = selectItem[0].billNum;
                this.showTable = flag;

                let that = this;
                that.initBillInvoiceData();
                await that.common.postUrl("fcCustBillTF", "queryCustomerBillInvoiceInfo", {billId: selectItem[0].billId}, function (data)
                {
                    that.custBillInfo = data;
                    that.custBillInfo.billNum = that.billNum;
                    that.billInvoiceData = data.list;//申请开票税率列表数据
                    for (let i = 0; i < that.billInvoiceData.length; i++) {
                        that.billInvoiceData[i].baseFlg = true;
                    }
                    if(that.common.isNotBlank(that.custBillInfo.settleBody)){
                        that.invoicingCompanyDisable = true;
                        for (let i = 0; i < that.billInvoiceData.length; i++) {
                            that.billInvoiceData[i].invoicingCompany = that.custBillInfo.settleBody+'';
                        }
                    }

                });
                //开票申请
                if (flag)
                    await this.loadAllCustomerRequestRemark(selectItem[0].tenantId);
            }
            this.invoiceShow = isOpen;
        },
        /**
         * 加载客户要求票面备注
         * @param tenantId
         * @returns {Promise<void>}
         */
        async loadAllCustomerRequestRemark(tenantId)
        {
            this.customerRequestRemarkData = await this.common.postUrl("fcCustBillTF", "loadAllCustomerRequestRemark", {tenantId: tenantId});
        },
        /**
         * 改变申请费用
         * @param item
         * @param flag
         */
        changeApplyInvoiceFee(item, flag)
        {
            if(flag)
            {
                if (this.common.isNotBlank(item.applyInvoiceFeeTotal) && this.common.isNotBlank(item.applyInvoiceFee) && !isNaN(item.applyInvoiceFee))
                {
                    if (item.applyInvoiceFeeTotal < item.applyInvoiceFee)
                    {
                        this.$message.error("发票税率为：" + item.invoiceTax +  "%申请开票金额" + item.applyInvoiceFee + " 大于可开票金额（含税）" + item.applyInvoiceFeeTotal);
                        return false;
                    }
                }
            }
            else
            {
                if (this.common.isNotBlank(item.writeoffFee) && !isNaN(item.writeoffFee) && item.applyInvoiceFeeTotal < item.writeoffFee)
                {
                    this.$message.error("发票税率为：" + item.invoiceTax +  "%核销金额" + item.writeoffFee + " 大于可开票金额（含税）" + item.applyInvoiceFeeTotal);
                    item.writeoffFee = '';
                    return false;
                }
            }
            return true;
        },
        add(index,item){
            let newItem = this.common.copyObj(item);
            newItem.baseFlg = false;
            this.billInvoiceData.splice(index+1, 0, newItem);
        },
        del(index){
            this.billInvoiceData.splice(index, 1);
        },
        /**
         * 确认提交发票申请
         */
        sureSubmit()
        {
            let applyInvoiceFeeTotal = 0;
            for(let i = 0; i < this.billInvoiceData.length; i++)
            {
                let data = this.billInvoiceData[i];
                if (this.common.isNotBlank(data.applyInvoiceFee))
                {
                    if (data.applyInvoiceFee == 0)
                    {
                        this.$message.error("开票金额不能为0！");
                        return false;
                    }
                    if (this.common.isBlank(data.invoiceType))
                    {
                        this.$message.error("请输入第" + (i + 1) + "条开票金额的发票类型！");
                        return false;
                    }
                    applyInvoiceFeeTotal = this.common.accAdd(applyInvoiceFeeTotal, data.applyInvoiceFee);
                    if (!this.changeApplyInvoiceFee(data, true))
                        return false;
                }
            }
            //总金额校验
            if (applyInvoiceFeeTotal == 0)
            {
                this.$message.error("开票总金额不能为0！");
                return false;
            }
            //js toFixed有问题  统一后台校验
            if (applyInvoiceFeeTotal > this.custBillInfo.noApplyInvoiceFee.toFixed(2))
            {
                // this.$message.error("开票总金额不能超过未申请发票的总金额" + this.custBillInfo.noApplyInvoiceFee + "！");
                // return false;
            }
            let that = this;
            this.custBillInfo.billInvoiceData = this.billInvoiceData;
            this.common.postUrl("fcCustBillTF", "saveBillApplyInvoice", this.custBillInfo, function (data)
            {
                that.$message.success("开票申请成功！");
                that.doQuery();
                that.showInvoice(false);
                // that.loadAllInvoiceTypeData();
            },null, null, true);
        },
        /**
         * 核销保存
         */
        sureWriteoffFee()
        {
            let applyInvoiceFeeTotal = 0;
            for(let i = 0; i < this.billInvoiceData.length; i++)
            {
                let data = this.billInvoiceData[i];
                if (this.common.isNotBlank(data.writeoffFee))
                {
                    if (data.writeoffFee == 0)
                    {
                        this.$message.error("请输入正确的核销金额！");
                        return false;
                    }
                    applyInvoiceFeeTotal = this.common.accAdd(applyInvoiceFeeTotal, data.writeoffFee);
                    if (!this.changeApplyInvoiceFee(data, false))
                        return false;
                }
            }
            //总金额校验
            if (applyInvoiceFeeTotal == 0)
            {
                this.$message.error("核销总金额不能为0！");
                return false;
            }
            if (applyInvoiceFeeTotal > this.custBillInfo.noApplyInvoiceFee)
            {
                this.$message.error("核销总金额不能超过未申请发票的总金额" + this.custBillInfo.noApplyInvoiceFee + "！");
                return false;
            }
            let that = this;
            that.custBillInfo.billInvoiceData = that.billInvoiceData;
            that.common.postUrl("fcCustBillTF", "saveWriteoffFee", that.custBillInfo, function (data)
            {
                that.$message.success("核销成功！");
                that.doQuery();
                that.showInvoice(false);
            },null, null, true);
        },
        /**
         * 是否打开发票申请明细
         * @param flag
         * @param isRelod 重新加载列表
         */
        showUpInvoiceDetailDialog(flag, isRelod)
        {
            if (flag)
            {
                let selectItem = this.$refs.table.getSelectItem();
                if (selectItem.length !== 1)
                {
                    this.$message.error("请选择一条需要查看发票申请明细的账单！");
                    return false;
                }
                this.upInvoiceDetailDialog = flag;//渲染表格
                this.billNum = selectItem[0].billNum;
                this.queryDetail.billId = selectItem[0].billId;
                this.$nextTick(() => this.loadBillInvoiceDetail())
            }
            else
            {
                if(isRelod) this.doQuery();
            }
            this.upInvoiceDetailDialog = flag;
        },
        /**
         * 加载账单开票明细
         */
        loadBillInvoiceDetail()
        {
            this.$refs.detailTable.load("fcCustBillTF", "queryCustomerBillInvoiceDetail", this.queryDetail);
        },
        /**
         * 发票申请撤销
         */
        revokeBillApplyInvoice()
        {
            let selectItem = this.$refs.detailTable.getSelectItem();
            if (selectItem.length !== 1)
            {
                this.$message.error("请选择一条需要撤销的发票申请明细！");
                return false;
            }
            let data = selectItem[0];
            if (data.verifyState == enumData.verifyState.approved)
            {
                this.$message.error("审核通过的发票申请不允许撤销！");
                return false;
            }
            let that = this;
            data.billNum = that.billNum;
            that.$confirm("确定需要撤销该发票申请？", "提示").then(() =>{
                that.common.postUrl("fcCustBillTF", "revokeBillApplyInvoice", data, function (data)
                {
                    that.loadBillInvoiceDetail();
                    that.$message.success("发票申请撤销成功!");
                },null,'',true);
            }).catch(() =>{})
        },
        /**
         * 确认账单的明细
         */
        toCustomerConfirmedBillDetail(data)
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
                urlId: 'confirmBillDetail_' + selectItems[0].billId,
                urlPathName: "/fc",
                urlPath: "/pt/fc/custBill/detail/confirmBillDetail.vue",
                query: {billId: selectItems[0].billId, flag: 1,unShowCheck: 1,},
            });
        },
        /**
         * 撤销账单确认
         */
        revokeBillConfirm()
        {
            let selectItem = this.$refs.table.getSelectItem();
            if (selectItem.length !== 1)
            {
                this.$message.error("请选择一条需要撤销审核的账单数据！");
                return false;
            }
            let data = selectItem[0];
            if (data.applyInvoiceFee > 0)
            {
                this.$message.error("账单已经申请开票,请先撤销该账单的所有开票申请之后再操作！");
                return false;
            }
            let that = this;
            that.$confirm("确定需要撤销账单审核,把账单回退到未审核状态？", "提示").then(async () =>{
                await that.common.postUrl("fcCustBillTF", "revokeBillConfirm", data,null,null,'',true);
                that.doQuery();
                that.$message.success("撤销审核成功!");
            }).catch(() =>{})
        },
        /**
         * 导出
         */
        downExcel() {
            this.$refs.table.downloadExcelFile();
        },
        showImg(data){
            if(!data.imgUrl){
                this.$message.error("没有附件~");
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
                // 创建一个URL对象
                const urlObj = new URL(data.imgUrl);
                
                // 检查是否已存在filename参数
                const params = new URLSearchParams(urlObj.search);
                if (!params.has('filename')) {
                    // 如果不存在，则添加filename参数
                    params.append('filename', urlObj.pathname.split('/').pop());
                    
                    // 更新URL对象的search部分
                    urlObj.search = params.toString();
                }
                data.imgUrl = urlObj.toString();
                let url = data.imgUrl;
                let fileType = this.common.getFileType('',url);
                // if(fileType=='pdf'){   //查看pdf
                //     let idx = url.indexOf("?");
                //     if(idx>=0){
                //         url = url.substring(idx,0);
                //     }
                //     this.srcList=[];
                //     this.srcList.push(url);
                //     this.showViewer = true;
                // }else if(fileType=='excel'||fileType=='word'||fileType=='ppt'){
                //     this.srcList=[];
                //     this.srcList.push(url);
                //     this.showViewer = true;
                // }else{  //下载文件
                //     this.common.downloadFile(url)
                // }
                if(data.imgUrl.indexOf(".pdf")>-1){   //查看pdf
                    // let index = data.imgUrl.indexOf("?");
                    // let url = data.imgUrl.substring(index,0);
                    window.open(data.imgUrl,'_blank')
                }else{  //下载文件
                    this.common.downloadFile(data.imgUrl)
                }
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
                param.billIds.push(selecctData[i].billId);
            }
            param.fileSubName = 'xlsx';
            param.selfCreateUrl = 'fcCustBillTF|downloadCustBillExcelById';
            this.common.downloadExcelFile('', param, '', '', '', 'customerConfirmedBillDetail');
        },
    },
}
