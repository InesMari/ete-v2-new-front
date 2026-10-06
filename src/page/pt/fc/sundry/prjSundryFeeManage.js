import tableCommon from "@/components/table/tableCommon.vue";
import innerTab from "@/components/innerTab/innerTab.vue";
import paymentRegist from "@/page/pt/fc/sundry/paymentRegist.vue";
import enumData from "@/page/pt/enum.js";
import searchList from "@/components/searchList/searchList.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';

export default {
    name: 'prjSundryFeelManage',
    props: [],
    data() {
        return {
            tabs: [
                {name: "企业", active: true, pageType: 1},
                {name: "个人", pageType: 2},
            ],
            isCompany: this.initIsCompany(),
            billType: this.$route.query.t,
            head: [],
            query: {
                billType: this.$route.query.t,
                costType: '',
                supplierId: this.$route.query.supplierId,
                id: '',
                custId: this.common.isBlank(this.$route.query.custId) ? '' : Number(this.$route.query.custId),//客户详情其他费用跳转
                createUserName: '',
                payee: '',
                billMonths: this.common.isBlank(this.$route.query.startDate) ? '' :[this.$route.query.startDate,this.$route.query.endDate],
                isEntry: '',
                isEntryRpt: '',
                paySts: this.$route.query.paySts,
                supplierType: this.$route.query.supplierType,//供应商类型 1个体 2 企业 3 专线 code_type SUPPLIER_TYPE
            },
            showDialog: false,
            showCommitButton: false,
            storeHouseDisableSwitch: false,
            detailDisableSwitch: true,
            bizData: this.initBizData(),
            dialogTitle: '',
            hzTenantOptions: '',
            payeeOptions: '',
            supplierData: '',
            costBillIds: '',
            supplierTenantId: '',
            opType: '',
            dic_store_house_type: [],
            dic_other_fee_item_type: [],
            dic_whether: [],
            dic_paySts: [],
            showPaymentRegistDialog: {value: false},
            pageType: this.$route.query.t == 2 ? 0 : 1,
            supplierData2: [],
            disabledEdit: false,
            disabledDel: false,

            pickerOptions: {
                disabledDate(time) {
                    let preMonth = new Date();
                    preMonth.setMonth(preMonth.getMonth()-1);
                    preMonth.setDate(1);
                    return time<preMonth;
                    // let date = now.getDate();
                    // if (date <= 6) {
                    //     let curDate = new Date().getTime();
                    //     let monthTime = 30 * 24 * 3600 * 1000;
                    //     let startDate = curDate - monthTime;
                    //
                    //     return time.getTime() < startDate;
                    // } else {
                    //     return time.getTime() < new Date(now.toLocaleDateString()).getTime();
                    // }
                },
            },
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initData();
        this.doQuery();
    },

    /**
     * 组件
     */
    components: {
        innerTab,
        tableCommon,
        paymentRegist,
        searchList,
        myFileModel,
    },

    /**
     * 绑定函数
     */
    methods: {
        initBizData()
        {
            return this.bizData = {
                id: '',
                billType: '',
                costType: '',
                billMonth: '',
                custId: '',
                supplierId: '',
                feeType: '',
                feeAmount: '',
                feeAmountExTax: '',
                taxRate: '',
                bankCardType: '',
                payee: '',
                receiveAccount: '',
                bankAccountName: '',
                bankBranchName: '',
                remark: '',
                paySts: '',
                invoiceNumber: '',
                fcSupplierBillId: '',
                createUserId: '',
                createDate: '',
                updateUserId: '',
                updateDate: '',
                sts: '',
                tenantName: '',
                createUserName: ''
            }
        },
        /**
         * 供应商跳转新增
         * 默认是展示企业
         * 其他情况参数控制
         * @returns {boolean}
         */
        initIsCompany() {
            let isCompany = true;
            if (this.common.isNotBlank(this.$route.query.supplierType)) {
                //供应商类型 1个体 2 企业 3 专线 code_type SUPPLIER_TYPE
                if (this.$route.query.supplierType == 1)
                    isCompany = false;
            }
            return isCompany;
        },
        selectCallback(data) {
            this.tab = data;
            this.pageType = data.pageType
            this.clear();
            this.isCompany = data.name == '企业';
            this.refreshData();
        },
        /**
         *
         */
        doQuery(query = this.query) {
            this.query = query;
            if(this.common.isNotBlank(this.query.billMonths) && this.query.billMonths.length === 2){
                this.query.startBillMonth = this.query.billMonths[0];
                this.query.endBillMonth = this.query.billMonths[1];
            }else{
                this.query.startBillMonth = '';
                this.query.endBillMonth = '';
            }
            this.$refs.table.load("fcPrjSundryFeeBillBizTF", "queryFcPrjSundryFeeBillPage", this.query);
        },
        /**
         * 刷新数据
         */
        refreshData() {
            this.initData();
            this.doQuery();
        },
        /**
         * 初始化数据
         */
        async initData() {
            //billType: 1=成本，2=收入
            let that = this;
            that.query.costType = that.isCompany ? 2 : 1;
            if (that.billType == 1) {
                if (that.isCompany) {
                    //成本-公司
                    that.head = [
                            {"name": "客户", "code": "custName", "width": "250", "type": "text"},
                            {"name": "供应商", "code": "supplierName", "width": "200", "type": "text"},
                            {"name": "费用产生月份", "code": "billMonth", "width": "100", "type": "text"},
                            {"name": "费用类型", "code": "feeTypeName", "width": "90", "type": "text"},
                            {"name": "含税费用", "code": "feeAmount", "width": "100", "type": "text"},
                            {"name": "不含税费用", "code": "feeAmountExTax", "width": "100", "type": "text"},
                            {"name": "税率", "code": "taxRate", "width": "100", "type": "text"},
                            {"name": "备注", "code": "remark", "width": "300", "type": "text"},
                            {"name": "是否入账", "code": "isEntry", "width": "100", "type": "text"},
                            {"name": "是否生成报表", "code": "isEntryRpt", "width": "100", "type": "text"},
                            {"name": "账单编号", "code": "fcBillNum", "width": "120", "type": "diy"},
                            {"name": "创建人", "code": "createUserName", "width": "100", "type": "text"},
                            {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"}
                        ]
                } else {
                    //成本-个人
                    that.head =
                        [
                            {"name": "客户", "code": "custName", "width": "250", "type": "text"},
                            {"name": "供应商", "code": "supplierName", "width": "200", "type": "text"},
                            {"name": "费用产生月份", "code": "billMonth", "width": "100", "type": "text"},
                            {"name": "收款人", "code": "payee", "width": "100", "type": "text"},
                            {"name": "身份证号码", "code": "payeeIdCardNum", "width": "100", "type": "text"},
                            {"name": "收款手机号", "code": "bankPhone", "width": "100", "type": "text"},
                            {"name": "收款账号", "code": "receiveAccount", "width": "100", "type": "text"},
                            {"name": "开户行", "code": "bankAccountName", "width": "100", "type": "text"},
                            {"name": "支行名称", "code": "bankBranchName", "width": "100", "type": "text"},
                            {"name": "银行卡类型", "code": "bankCardTypeName", "width": "100", "type": "text"},
                            {"name": "费用类型", "code": "feeTypeName", "width": "90", "type": "text"},
                            {"name": "含税费用", "code": "feeAmount", "width": "100", "type": "text"},
                            {"name": "不含税费用", "code": "feeAmountExTax", "width": "100", "type": "text"},
                            {"name": "备注", "code": "remark", "width": "300", "type": "text"},
                            {"name": "付款状态", "code": "payStsName", "width": "100", "type": "text"},
                            {"name": "付款人", "code": "payorName", "width": "100", "type": "text"},
                            {"name": "付款时间", "code": "payTime", "width": "150", "type": "text"},
                            {"name": "是否生成报表", "code": "isEntryRpt", "width": "100", "type": "text"},
                            {"name": "创建人", "code": "createUserName", "width": "100", "type": "text"},
                            {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"}
                        ]
                }
            } else {
                //收入
                that.head =
                    [
                        {"name": "客户", "code": "custName", "width": "200", "type": "text"},
                        {"name": "费用产生月份", "code": "billMonth", "width": "100", "type": "text"},
                        {"name": "费用类型", "code": "feeTypeName", "width": "90", "type": "text"},
                        {"name": "含税费用", "code": "feeAmount", "width": "100", "type": "text"},
                        {"name": "税率", "code": "taxRate", "width": "100", "type": "text"},
                        {"name": "不含税费用", "code": "feeAmountExTax", "width": "100", "type": "text"},
                        {"name": "备注", "code": "remark", "width": "100", "type": "text"},
                        {"name": "是否入账", "code": "isEntry", "width": "100", "type": "text"},
                        {"name": "是否生成报表", "code": "isEntryRpt", "width": "100", "type": "text"},
                        {"name": "账单编号", "code": "fcBillNum", "width": "120", "type": "diy"},
                        {"name": "创建人", "code": "createUserName", "width": "100", "type": "text"},
                        {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"}
                    ]
            }

            this.common.postUrl("customerTF", "queryCustomerListNoPage", {sts: enumData.STS.VALID}, function (data) {
                that.hzTenantOptions = data;
            });
            //供应商
            this.common.postUrl("supplierTF", "queryAllSupplierList", {supplierType: ''}, function (data) {
                that.supplierData = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WHETHER"}, function (data) {
                that.dic_whether = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PAY_STS"}, function (data) {
                that.dic_paySts = data;
            });
            //加载静态枚举-费用类型
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "OTHER_FEE_ITEM_TYPE"}, function (data) {
                that.dic_other_fee_item_type = data;
                //修改操作时，删除其他费选项
                if (that.opType == 2) {
                    let otherFeeIndex = -1;
                    for (let i = 0; i < that.dic_other_fee_item_type.length; i++) {
                        let item = that.dic_other_fee_item_type[i];
                        if (item.codeName == '其他费') {
                            otherFeeIndex = i;
                            break;
                        }
                    }
                    if (otherFeeIndex >= 0) {
                        that.dic_other_fee_item_type.splice(otherFeeIndex, 1);
                    }
                }

                for (let i = 0; i < that.dic_other_fee_item_type.length; i++) {
                    let item = that.dic_other_fee_item_type[i];
                    if (item.codeName != '代理运输'&&item.codeName != '车辆租赁'&&item.codeName != '容器租赁'&&item.codeName != '技术服务') {
                        that.dic_other_fee_item_type.splice(i, 1);
                        i--;
                    }
                }
            });
            this.supplierData2 = await this.common.postUrl("supplierTF", "queryAllSupplierList", {supplierType: this.$route.query.supplierType});
        },

        toBillDetail(item) {
            if (this.billType == 1) {
                if (item.confirmState == 1) {
                    this.$emit('openTab', {
                        urlName: '账单明细',
                        urlId: 'confirmSupplierBillDetail',
                        urlPathName: "/fc",
                        urlPath: "/pt/fc/supplierBill/detail/confirmBillDetail.vue",
                        query: {
                            fcSupplierBillId: item.fcSupplierBillId,
                            tabId: enumData.FC_SUPPLIER_BILL_ITEM_TYPE.PROJECTSUNDRY
                        },
                    });
                } else {
                    this.$emit('openTab', {
                        urlName: '账单明细',
                        urlId: 'supplierBillDetail',
                        urlPathName: "/fc",
                        urlPath: "/pt/fc/supplierBill/detail/billDetail.vue",
                        query: {
                            fcSupplierBillId: item.fcSupplierBillId,
                            tabId: enumData.FC_SUPPLIER_BILL_ITEM_TYPE.PROJECTSUNDRY
                        },
                    });
                }
            } else {
                if (item.confirmState == 1) {
                    this.$emit('openTab', {
                        urlName: '确认账单明细',
                        urlId: 'confirmBillDetail',
                        urlPathName: "/fc",
                        urlPath: "/pt/fc/custBill/detail/confirmBillDetail.vue",
                        query: {
                            billId: item.fcCustBillId,
                            flag: 1,
                            tabId: enumData.FC_CUST_BILL_ITEM_TYPE.PROJECTSUNDRY
                        },
                    });
                } else {
                    this.$emit('openTab', {
                        urlName: '账单明细',
                        urlId: 'billDetail',
                        urlPathName: "/fc",
                        urlPath: "/pt/fc/custBill/detail/billDetail.vue",
                        query: {
                            billId: item.fcCustBillId,
                            flag: 1,
                            tabId: enumData.FC_CUST_BILL_ITEM_TYPE.PROJECTSUNDRY
                        },
                    });
                }
            }
        },
        /**
         * 清空
         */
        clear() {
            this.query =
                {
                    billType: this.$route.query.t,
                    costType: this.isCompany ? 2 : 1,
                    id: '',
                    custId: '',
                    createUserName: '',
                    payee: '',
                    billMonths: this.common.isBlank(this.$route.query.startDate) ? '' :[this.$route.query.startDate,this.$route.query.endDate],
                    isEntry: '',
                    isEntryRpt: '',
                    paySts: '',
                    supplierType: this.$route.query.supplierType
                };
            this.showCommitButton = false;
            this.storeHouseDisableSwitch = false;
            this.detailDisableSwitch = true;
            this.bizData = this.initBizData();
            this.dialogTitle = '';
            this.opType = '';
            this.supplierTenantId = '';
            this.payeeOptions = '';
        },
        dblclickItem(item)
        {
            this.displayDialog(3, item);
        },
        /**
         * 显示新增弹出框
         * type 1 新增  2 修改  3 查看
         */
        displayDialog(type, item) {
            this.clear();

            let that = this;
            that.opType = type;
            this.detailDisableSwitch = false;
            let subtitle = this.$route.query.t == 1 ? "成本" : "收入";
            if (type == 1) {
                this.dialogTitle = '新增' + subtitle;
                this.showCommitButton = true;
                let otherFeeIndex = -1;
                for (let i = 0; i < that.dic_other_fee_item_type.length; i++) {
                    let item = that.dic_other_fee_item_type[i];
                    if (item.codeName == '其他费') {
                        otherFeeIndex = i;
                        break;
                    }
                }
                if (otherFeeIndex >= 0) {
                    that.dic_other_fee_item_type.splice(otherFeeIndex, 1);
                }
                this.toImg();
            } else {
                let array = this.$refs.table.getSelectItem();
                if (type == 3)
                    array[0] = item;

                if (array.length !== 1) {
                    this.$message.error("请选择一条数据!");
                    return false;
                }
                let id = array[0].id;
                let fcBillNum = array[0].fcBillNum;
                let paySts = array[0].paySts;
                let billType = this.$route.query.t;

                this.toImg(array[0]);
                if (type == 2) {
                    if (paySts == 1) {
                        this.$message.error("已付款数据不允许修改！");
                        return false;
                    }
                    if (this.common.isNotBlank(fcBillNum)) {
                        this.$message.error("已入账数据不允许修改！");
                        return false;
                    }
                    this.dialogTitle = '修改' + subtitle;
                    this.showCommitButton = true;
                    this.disabledEdit = false;
                    this.disabledDel = false;
                } else if (type == 3) {
                    this.dialogTitle = '查看' + subtitle;
                    this.detailDisableSwitch = true;
                    this.disabledEdit = true;
                    this.disabledDel = true;
                }
                this.common.postUrl("fcPrjSundryFeeBillBizTF", 'queryFcPrjSundryFeeBillById', {
                    id: id,
                    billType: billType
                }, function (data) {
                    if (data) {
                        that.initData();
                        that.bizData = data;
                        that.bizData.feeType = data.feeType + '';

                      const supplier = that.supplierData.find(function (item) {
                        return item.supplierId === that.bizData.supplierId;
                      });
                      that.supplierTenantId = supplier.tenantId;
                    }
                }, null, '', true);
            }
            this.showDialog = true;
        },

        save() {
            // if(!this.supplier.supplierName){
            //   this.$message.error("供应商名称不能为空");
            //   return;

            let method = 'savePrjSundryFeeBill';
            this.bizData.billType = this.$route.query.t;
            this.bizData.costType = this.isCompany ? 2 : 1;
            this.bizData.bankCardType = this.isCompany ? 2 : 1;

            //个人成本银行卡收款人处理
            if (this.bizData.billType == 1 && this.bizData.costType == 1) {
                for (let i = 0; i < this.payeeOptions.length; i++) {
                    let data = this.payeeOptions[i];
                    if (data.bankCard == this.bizData.payee) {
                        this.bizData.payee = data.bankAccountName;
                        break;
                    }
                }
            }
            let that = this;
            if (this.bizData.billType == 1){
                this.bizData.tenantName = that.supplierData.find(item=>item.tenantId==that.supplierTenantId).supplierName;
            }else{
                this.bizData.tenantName = that.hzTenantOptions.find(item=>item.custId==that.bizData.custId).name;
            }
            this.common.postUrl("fcPrjSundryFeeBillBizTF", method, this.bizData, function (data) {
                if (data) {
                    that.showDialog = false;
                    that.refreshData();
                    that.$msgbox(that.dialogTitle + "成功！");
                }
            }, null, '', true);
        },
        updateStateToInvalid(state) {
            let that = this;
            let array = this.$refs.table.getSelectItem();
            if (array.length == 0) {
                this.$message.error("请至少选择一条数据");
                return false;
            }
            let ids = '';
            for (let i = 0; i < array.length; i++) {
                if (array[i].paySts == 1) {
                    this.$message.error("已付款数据不允许删除！");
                    return false;
                }
                if (this.common.isNotBlank(array[i].fcBillNum)) {
                    this.$message.error("已入账数据不允许删除！账单编号：" + array[i].fcBillNum);
                    return false;
                }
                if (array[i].sts == state) {
                    this.$message.error("数据错误!当前状态与目标操作状态一致!");
                    return false;
                }
                ids += ',' + array[i].id;
            }
            ids = ids.substr(1);
            let info = '';
            if (state == 0) {
                info = '删除';
            }
            this.common.postUrl("fcPrjSundryFeeBillBizTF", 'updateStateToInvalid', {ids: ids}, function (data) {
                if (data) {
                    that.doQuery();
                    that.$msgbox(info + "成功！");
                }
            }, null, '', true);
        },
        forceInput() {
            this.$forceUpdate();//强制刷新视图，每一个无法输入的input框都需要使用该方法
        },
        /**
         * 关闭新增客户弹出框
         */
        closeDialog() {
            this.showDialog = false;
        },
        /** 选择供应商 */
        changeSupplier(tenantId) {
            let that = this;
            that.payeeOptions = '';
            that.bizData.payee = '';
            that.bizData.receiveAccount = '';
            that.bizData.bankAccountName = '';
            that.bizData.bankBranchName = '';
            that.bizData.supplierId = '';

            var supplier = {};
            supplier = this.supplierData.find(function (item) {
                return item.tenantId === tenantId;
            });
            let supplierId = supplier.supplierId;
            that.bizData.supplierId = supplierId;

            if (!that.isCompany) {
                this.common.postUrl("supplierTF", "getSupplierBankInfo", {
                    supplierId: supplierId,
                    bankType: 1
                }, function (data) {
                    that.payeeOptions = data;
                    that.payeeOptions.unshift({bankCard: '', bankAccountName: ''});
                });
            }
        },
        /** 选择收款人 */
        changePayee(bankCard) {
            let that = this;
            that.bizData.receiveAccount = '';
            that.bizData.bankAccountName = '';
            that.bizData.bankBranchName = '';

            for (let i = 0; i < that.payeeOptions.length; i++) {
                let data = that.payeeOptions[i];
                if (data.bankCard == bankCard) {
                    that.bizData.receiveAccount = data.bankCard;
                    that.bizData.bankAccountName = data.bankDepositName;
                    that.bizData.bankBranchName = data.bankSubName;
                    that.bizData.bankPhone = data.bankPhone;
                    that.bizData.payeeIdCardNum = data.userPayeeCard;
                    break;
                }
            }
        },
        /**
         * 输入收款人信息
         * @param e
         */
        inputPayee(e) {
            let payee = e.target.value;
            if (this.common.isNotBlank(payee) && payee.length > 1) {
                this.bizData.payee = payee;
                this.$forceUpdate();
            }
        },
        //添加非系统供应商车辆至下拉框数据源
        addExtVehicleData(prefix) {
            let vehicleId = this.transitOrderData[this.getRealKey(prefix, 'VEHICLE_ID')];
            let plateNumber = this.transitOrderData[this.getRealKey(prefix, 'PLATE_NUMBER')];
            let vehicleType = this.transitOrderData[this.getRealKey(prefix, 'VEHICLE_TYPE')];
            let vehicleLength = this.transitOrderData[this.getRealKey(prefix, 'VEHICLE_LENGTH')];

            if (this.common.isNotBlank(plateNumber)) {
                let isSysVehicle = false;
                for (let i = 0; i < this.vehicleData.length; i++) {
                    if (vehicleId == this.vehicleData[i].vehicleId || plateNumber == this.vehicleData[i].plateNumber) {
                        isSysVehicle = true;
                        break;
                    }
                }
                //用户输入的车辆数据
                if (isSysVehicle === false) {
                    // console.log('addExtVehicleData -- vehicleId:' + vehicleId + ' ---plateNumber:' + plateNumber);
                    this.vehicleData.unshift({
                        vehicleId: vehicleId,
                        plateNumber: plateNumber,
                        vehicleType: vehicleType,
                        vehicleLength: vehicleLength
                    });
                    this.vehicleDisable[prefix] = false;
                }
            }
        },
        /**
         * 计算不含税费用
         */
        calculateFeeAmountExTax() {
            // let feeAmountExTax = this.bizData.feeAmountExTax;//不含税费用
            let feeAmount = this.bizData.feeAmount;//含税费用
            if (this.billType == 1) {
                if (this.isCompany) {
                    let taxRate = this.bizData.taxRate;//税率
                    if (taxRate > 0) {
                        this.bizData.feeAmountExTax = this.common.accDiv(feeAmount,
                            1 + this.common.accDiv(taxRate, 100)).toFixed(4);
                    }
                } else {
                    //个人成本默认为高登税点，不含税费用计算公式为： 含税费用*1.071/1.06
                    this.bizData.feeAmountExTax = this.common.accMul(feeAmount, this.common.accDiv(1.071, 1.06)).toFixed(4);
                }
            } else if (this.billType == 2) {
                // this.bizData.taxRate = 9;
                let taxRate = this.bizData.taxRate;//税率
                if (taxRate > 0) {
                    this.bizData.feeAmountExTax = this.common.accDiv(feeAmount,
                        1 + this.common.accDiv(taxRate, 100)).toFixed(4);
                }
            }
        },
        /**
         * 导出EXCEL
         */
        download() {
            this.$refs.table.downloadExcelFile("项目成本", "fcPrjSundryFeeBillBizTF", "queryFcPrjSundryFeeBillPage", this.query);
        },
        /**
         * 付款登记
         * @returns {boolean}
         */
        toPaymentRegist(type) {
            let array = this.$refs.table.getSelectItem();
            if (array.length === 0) {
                this.$message.error("请选择数据");
                return false;
            }
            let ids = '';
            for (let i = 0; i < array.length; i++) {
                if (type == 'rev') {
                    if (array[i].paySts == 0) {
                        this.$message.error("该笔费用当前是未付款状态!");
                        return false;
                    }
                }
                ids += ',' + array[i].id;
            }
            ids = ids.substr(1);
            this.costBillIds = ids;
            if (type == 'rev') {
                this.revocationPaymentRegist();
            } else {
                this.showPaymentRegistDialog.value = true;
                this.$nextTick(() => {
                    this.$refs.paymentRegist.doQuery();
                });
            }
        },
        /**
         * 撤销付款登记
         */
        async revocationPaymentRegist() {
            let that = this;
            let opType = 'rev';
            let method = 'savePaymentRegist';
            let param = {'costBillIds': this.costBillIds, 'opFlag': opType, 'billType': 1, 'costType': 1};
            if (opType == 'rev') {
                await this.$confirm('确定要撤销此条付款登记信息?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                });
            }
            this.common.postUrl("fcPrjSundryFeeBillBizTF", method, param, function (data) {
                if (data == 'SUCCESS') {
                    that.$msgbox("撤销成功！");
                    that.doQuery();
                } else {
                    that.$msgbox("撤销失败！");
                }
            }, null, '', true);
        },
        /**
         * 回调获取图片的信息
         * @param imgData
         */
        setImgData(imgData)
        {
            this.bizData.imgId = imgData.flowId;
            this.bizData.fileName = imgData.fileName;
            this.bizData.imgPath = imgData.storePath;
        },
        toImg(item)
        {
            if (this.common.isNotBlank(item) && this.common.isNotBlank(item.imgId))
            {
                this.$nextTick(() =>
                {
                    if (this.common.isNotBlank(item.imgId))
                        this.$refs.img.initDate(item.imgId);
                });
            }
            else
            {
                if (this.$refs && this.$refs.img)
                    this.$refs.img.clean();
            }
        }

    },
    computed: {
        formData() {
            return [
              {"name":"客户","model":"custId","type":"select","options":this.hzTenantOptions,"label":"name","value":"custId","placeholder":"客户","method":"doQuery","isshow":true},
              {"name":"供应商","model":"supplierId","type":"select","options":this.supplierData2,"label":"supplierName","value":"tenantId","placeholder":"供应商","method":"doQuery","isshow":true,if:this.billType==1},
              {"name":"付款状态","model":"paySts","type":"select","options":this.dic_paySts,"label":"codeName","value":"codeValue","placeholder":"付款状态","method":"doQuery","isshow":true,if:!this.isCompany},
              {"name":"创建人","model":"createUserName","type":"input","placeholder":"创建人","isshow":true},
              {"name":"收款人","model":"payee","type":"input","placeholder":"收款人","isshow":true,if:this.billType==1},
              {"name":"费用产生月份","model":"billMonths","type":"monthrange","isshow":true},
              {"name":"是否入账","model":"isEntry","type":"select","options":this.dic_whether,"label":"codeName","value":"codeValue","placeholder":"是否入账","method":"doQuery","isshow":true},
              {"name":"是否生成报表","model":"isEntryRpt","type":"select","options":this.dic_whether,"label":"codeName","value":"codeValue","placeholder":"是否生成报表","method":"doQuery","isshow":true},
            ]
        }
    },
}
