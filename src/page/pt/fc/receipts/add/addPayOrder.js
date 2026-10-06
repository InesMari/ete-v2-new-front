import myFileModel from '@/components/myFileModel/myFileModel.vue'
import mySimpleFileModelList from "@/components/myFileModel/mySimpleFileModelList.vue";
import enumData from "@/page/pt/enum";
import scrollSelect from "@/components/scrollSelect/scrollSelect.vue";

export default {
    name: 'addPayOrder',
    data()
    {
        return {
            projects:[this.getProject(),this.getProject(),this.getProject()],
            info: {},
            chineseMoney: [],
            payProjectOptions: [],
            subTypeData: [],
            bankData:[],
            allSpBankData:[],
            filterBankData:[],
            filterAllSpBankData:[],
            treeData: [],
            payTitleOptions: [],
            payTypeOptions: [],
            custOptions: [],
            payBizTypeOptions: [],
            orgUserData: [],
            billData: [],
            saveFlag: false,
            payeeDisable: false,
            isUpdate: this.common.isNotBlank(this.$route.query.id),
            writeOffFlag: false,
            orgData: [],
            contractData: [],

            pickerOptions: {
                disabledDate(time)
                {
                    let now = new Date();
                    now.setMonth(now.getMonth() + 3);
                    return time.getTime() > now.getTime();
                },
            },
            disabledBill:false,
            collapseTags:true,
            showBankList:false,
            hasSelectBank: false,//是否选择银行卡
            fromPaymentPlan:'',
            personalBankHaveEntity:true,
        }
    },
    async mounted()
    {
        // 初始化
        this.init();        
        await this.initData();        
        this.initChineseMoney();
        // 是否从指定跳转过来的
        if(this.$route.query.appointPage == 1){
            let {settleBodyName,month,laborCost} = this.$route.query
            this.projects[0].businessDate = month;
            this.projects[0].mustPayFee = laborCost;
            this.projects[0].payFee = laborCost;
            this.payTitleOptions.forEach(item => {
                if(item.codeName == settleBodyName){
                    this.info.payTitle = item.codeValue
                }
            })
            if(this.$route.query.type == 1){    //内部人工
                this.projects[0].payProjectData = ['101', '101001', '101001001'];
            }else{  //劳务人工
                this.projects[0].payProjectData = ['101', '101006'];
            }
            this.calTotalFee();
        }
        //供应商账单生成付款单传金额过来的处理下中午
        if (this.common.isNotBlank(this.$route.query.verifyInvoiceFee))
        {
            this.$nextTick(() =>
            {
                this.changeNumMoneyToChinese();
            });
        }
        if (this.$route.query.isFromSupplierBill == 1)
        {
            this.disabledBill = true;
            this.collapseTags = false;
            if (this.common.isNotBlank(this.$route.query.billId))
            {
                let otherList = await this.common.postUrl("fcSupplierBillTF", "getFcSupplierBillInfos", {billIds: this.$route.query.billId});
                let that =  this;
                if (otherList.length > 0)
                {
                    that.$nextTick(() => {
                        that.$refs.other.initFileList(otherList);//其他附件
                    })
                }
            }
            this.$forceUpdate();
        }

        if (this.common.isNotBlank(this.$route.query.id))
        {
            this.$nextTick(() =>
            {
                this.loadFcPayInfoById();
            });
        }
        else //新增
        {
            let feeIds = this.$route.query.feeIds;
            let feeType = this.$route.query.feeType;
            let bean = "";
            let method = "";
            if (feeType == 1)
            {
                bean = "vehicleWaybillCostService";
                method = "queryVehicleWaybillCostInfoByIds";
            }
            else if (feeType == 2)
            {
                bean = "vehicleRepairCostService";
                method = "queryVehicleRepairCostInfoByIds";
            }
            if (feeType == 1 || feeType == 2)
            {
                this.disabledBill = true;
                this.$nextTick(async () => {
                    let data = await this.common.postUrl(bean, method, {ids: feeIds});
                    try{
                        data.fileList.forEach(item => {
                            item.imgId = item.flowId;
                        })
                    }catch(e){}
                    this.projects[0].payRemark = data.info.remark;
                    this.projects[0].mustPayFee = data.info.fee;
                    this.projects[0].payFee = data.info.fee;
                    // data.dtlList.forEach((item,index) => {
                    //     this.projects[index].payRemark = item.remark;
                    //     this.projects[index].mustPayFee = item.fee;
                    //     this.projects[index].payFee = item.fee;
                    // })
                    if (this.common.isNotBlank(data.fileList))
                        this.$refs.other.initFileList(data.fileList);
                    if (data.info.fee > 0)
                        this.calTotalFee(String(data.info.fee));
                });
            }
        }
        if (this.$route.query.feeApplySrc == 2)
        {
            if (this.$route.query.isUpdate == 1 || this.$route.query.isCopy == 1)
                return;////修改不走下面逻辑  修改拿的数据是保存的
            this.$nextTick(async () =>
            {
                let {type,applyIdArray,applyIds} = this.$route.query;
                if(this.common.isNotBlank(applyIdArray) && type == 2){
                    for (let i = 0; i < applyIdArray.length; i++) {
                        let apply = await this.common.postUrl("purPayPlanTF", "queryPurPayPlanDtlByIds", {ids: applyIdArray[i]});
                        this.projects[i] = {};
                        this.projects[i].applyArray = apply.applyArray;
                        this.projects[i].applyIds = apply.applyIds;
                        this.projects[i].applyNum = apply.applyNum;
                        this.projects[i].payRemark = apply.payRemark;
                        this.projects[i].payProjectData = apply.payProjectData;
                        let payFee = 0;
                        apply.applyArray.forEach(item =>
                        {
                            payFee = this.common.accAdd(payFee, item.payFee);
                        })
                        this.projects[i].mustPayFee = payFee;
                        this.projects[i].payFee = payFee;
                    }
                    let ids = applyIdArray.join(",");
                    let apply = await this.common.postUrl("purPayPlanTF", "queryPurPayPlanDtlByIds", {ids});
                    let org = this.orgData.find(item => item.id == apply.orgId)
                    if(org){
                        this.info.relOrgId = org.id;
                        this.info.orgName = org.orgName;
                    }
                    this.$refs.other.initFileList(apply.list);
                }else{
                    let apply = await this.common.postUrl("purPayPlanTF", "queryPurPayPlanDtlByIds", {ids: applyIds});                    
                    // 匹配是否有当前部门，没有则清空
                    let org = this.orgData.find(item => item.id == apply.orgId)
                    if(org){
                        this.info.relOrgId = org.id;
                        this.info.orgName = org.orgName;
                    }
                    if (type == 2)
                    {
                        for (let i = 0; i < apply.applyArray.length; i++)
                        {
                            this.projects[i] = {};
                            this.projects[i].applyArray = [apply.applyArray[i]];
                            this.projects[i].applyIds = [apply.applyArray[i].applyId];
                            this.projects[i].applyId = apply.applyArray[i].applyId;
                            this.projects[i].applyNum = apply.applyArray[i].applyNum;
                            this.projects[i].payRemark = apply.applyArray[i].payRemark;
                            this.projects[i].payProjectData = apply.applyArray[i].payProjectData;
                            this.projects[i].mustPayFee = apply.applyArray[i].payFee;
                            this.projects[i].payFee = apply.applyArray[i].payFee;
                        }
                    }
                    else
                    {
                        this.projects[0] = {};
                        this.projects[0].applyArray = apply.applyArray;
                        this.projects[0].applyIds = apply.applyIds;
                        this.projects[0].payRemark = apply.payRemark;
                        this.projects[0].payProjectData = apply.payProjectData;
                        let payFee = 0;
                        apply.applyArray.forEach(item =>
                        {
                            payFee = this.common.accAdd(payFee, item.payFee);
                        })
                        this.projects[0].mustPayFee = payFee;
                        this.projects[0].payFee = payFee;
                    }
                    this.$refs.other.initFileList(apply.list);
                }
                this.calTotalFee();
            });
        }
        else
        {
            //todo  旧逻辑  可以删除了
            //加载采购申请回显
            if (this.common.isNotBlank(this.$route.query.applyIds))
            {
                if (this.$route.query.isUpdate == 1 || this.$route.query.isCopy == 1)
                    return;////修改不走下面逻辑  修改拿的数据是保存的
                this.$nextTick(async () =>
                {
                    let apply = await this.common.postUrl("purchaseApplyServiceImpl", "loadPurchaseApplyListByIds", {ids: this.$route.query.applyIds});
                    let orgName = apply.applyUserOrg.split("-")[1];
                    this.info.payType = apply.payTypeSet[0] + "";
                    if (apply.payTypeSet.length > 1)
                    {
                        this.$message.warning("选择生成付款单的采购申请付款方式不同,请确认是否需要更改!")
                    }
                    this.projects[0] = apply.project1;
                    this.projects[1] = apply.project2;
                    this.projects[2] = apply.project3;
                    this.$refs.other.initFileList(apply.list);
                    this.calTotalFee();
                    
                    // 匹配是否有当前部门，没有则清空
                    let org = this.orgData.find(item => item.orgName == orgName)
                    if(org){
                        this.info.relOrgId = org.orgId;
                        this.info.orgName = orgName;
                    };
                });
            }
        }
        if (this.common.isNotBlank(this.$route.query.ids))//修改的
        {
            let infos = await this.common.postUrl("requestServiceImpl", "loadRequestFeeByIds", {
                ids: this.$route.query.ids,
                type: this.$route.query.type
            });
            // 匹配是否有当前部门，没有则清空
            let relOrgId = infos[0].relOrgId;
            let org = this.orgData.find(item => item.id == relOrgId)
            if(org){
                this.info.relOrgId = org.id;
                this.info.orgName = org.orgName;
            }

            this.info.payTitle = infos[0].payTitle + '';
            // this.info.id = '';
            this.info.createDate = this.common.formatDate.getDate();
            this.info.orgApplyUser = '';
            let that = this;
            let list = [];
            for (let j = 0; j < infos.length; j++)
            {
                this.projects[j] = this.common.copyObj(infos[j]);
                this.projects[j].mustPayFee = this.projects[j].remainPayFee;
                this.projects[j].payFee = this.projects[j].remainPayFee;
                if (this.common.isNotBlank(infos[j].list))
                {
                    for (let i = 0; i < infos[j].list.length; i++)
                    {
                        list.push(this.common.copyObj(infos[j].list[i]));
                    }
                }
            }
            this.$refs.other.initFileList(list);
            this.info.payType = '3';
            this.$forceUpdate();
            this.calTotalFee();
            this.info.borrowFee = this.info.actualPayFee;
            this.info.actualPayFee = '  ';
            this.initPayee();
            this.writeOffFlag = true;
            
            this.info.bankAccountName = infos[0].bankAccountName;
            this.info.bankDeposit = infos[0].bankDeposit;
            this.info.bankCard = infos[0].bankCard;
            this.info.bankPhone = infos[0].bankPhone;
            // this.info.bankLinkman = infos[0].bankLinkman;
            this.info.payee = infos[0].bankLinkman;
        }
    },
    methods: {
        init()
        {
            let verifyInvoiceFee = this.$route.query.verifyInvoiceFee;
            this.projects=[this.getProject(),this.getProject(),this.getProject()];
            let billId = [];
            if (this.common.isNotBlank(this.$route.query.billId))
            {
                billId = this.$route.query.billId.split(",");
                billId = billId.map(Number);
            }
            this.info = {
                payTitle: '',
                feeApplySrc: this.$route.query.feeApplySrc,
                payFee: this.common.isNotBlank(verifyInvoiceFee) ? Number(verifyInvoiceFee) : '',
                borrowFee: '',
                actualPayFee: this.common.isNotBlank(verifyInvoiceFee) ? Number(verifyInvoiceFee) : '',
                payType: '2',
                expectDate: '',
                bankAccountName: '',
                bankDeposit: '',
                bankCard: '',
                billId: billId,
                orgApplyUser: '',
                projectList: [],
                receiptsList: [{}],
                payee: '',
                relOrgId: this.common.userInfo().oneLevelOrgId,
                orgName: this.common.userInfo().oneLevelOrgName,
                createDate: this.common.formatDate.getDate(),
                feeIds: this.$route.query.feeIds,
                feeType: this.$route.query.feeType,
            };
            this.chineseMoney = [];
            this.list = [{}];
            this.payProjectOptions = [];
            this.payTitleOptions = [];
            this.payTypeOptions = [];
            this.custOptions = [];
            this.payBizTypeOptions = [];
            this.orgUserData = [];
            this.saveFlag = false;
            this.payeeDisable = false;
            this.initPayee();
            this.fromPaymentPlan = this.$route.query.fromPaymentPlan;
            
            let entityIds = localStorage.getItem("entityIds").split(",");            
            if(entityIds.includes('1006198')){
                this.personalBankHaveEntity = true;
            }
        },

        getProject()
        {
            return {
                payProject: '',
                payProjectData: [],
                custTenantId: '',
                businessDate: '',
                mustPayFee:'',
                deduction:'',
                payFee: '',
                payBizType: '',
                payRemark: '',
                applyArray: [],
            }
        },
        initChineseMoney()
        {
            this.chineseMoney = [];
            for (var i = 0; i < 9; i++)
            {
                this.chineseMoney.push('');
            }
        },
        async initData()
        {
            let that = this;
            let data = await this.common.postUrl('commonTF','getSysStaticDataByCodeTypes',{codeType:
                    "PAY_TITLE,APPLY_PAY_TYPE,PAY_BIZ_TYPE,REQUEST_FEE_TYPE,REQUEST_FEE_TYPE_SUB,REQUEST_FEE_TYPE_THRD"});
            that.payTitleOptions = data.PAY_TITLE;
            that.payTypeOptions = data.APPLY_PAY_TYPE;
            that.payBizTypeOptions = data.PAY_BIZ_TYPE;
            that.payProjectOptions = data.REQUEST_FEE_TYPE;
            that.subTypeData = data.REQUEST_FEE_TYPE_SUB;
            that.thrdTypeData = data.REQUEST_FEE_TYPE_THRD;
            this.subTypeData.forEach(item =>
            {
                let codeValue = item.codeValue;
                item.children = '';
                this.thrdTypeData.forEach(item2 =>
                {
                    if (item2.codeId == codeValue)
                    {
                        let data2 = this.common.copyObj(item2);
                        if (item.children == '')
                        {
                            item.children = [];
                        }
                        item.children.push(data2);
                    }
                })
            })
            this.treeData = [];
            this.payProjectOptions.forEach(item =>
            {
                let data = this.common.copyObj(item);
                let codeValue = data.codeValue;
                data.children = '';
                this.subTypeData.forEach(item2 =>
                {
                    if (item2.codeId == codeValue)
                    {
                        let data2 = this.common.copyObj(item2);
                        if (data.children == '')
                        {
                            data.children = [];
                        }
                        data.children.push(data2);
                    }
                })
                this.treeData.push(data);
            })

            that.custOptions = await this.common.postUrl("customerTF", "queryCustomerListNoPage", {sts: enumData.STS.VALID});
            this.bankData = await this.common.postUrl("fcPayTF", "queryFcBankInfo", {});
            this.bankData.forEach(item =>{
                item.value = item.bankAccountName;
                that.filterBankData.push(item);
            });
            this.allSpBankData = await this.common.postUrl("bankTF", "queryAllBankInfoList", {});
            this.orgUserData = await this.common.postUrl("userTF", "loadCurrentOrgUserList", {
                entityId: 1006122,
                orgFlag: 1
            });
            if (this.orgUserData.length == 1)
            {
                this.info.orgApplyUser = this.orgUserData[0].userId;
            }
            //查询全部可应付金额大于0点
            this.billData = await this.common.postUrl("fcSupplierBillTF", "loadInvoiceCommitBillList", this.$route.query);

            let payTitle = await this.common.postUrl("userTF", "getRelSubsidiary");
            if(payTitle){
                this.info.payTitle=payTitle;
            }
            this.orgData = await this.common.postUrl("regionOrgTF", "queryOrgSel");
            //供应商账单生成付款单的处理一下
            if (this.common.isNotBlank(this.$route.query.verifyInvoiceFee))
            {
                await this.changebill();
            }
            this.contractData = await this.common.postUrl("contractService", "queryAllContracts");
        },
        async changeOrg()
        {
            let that = this;
            this.info.orgApplyUser = '';
            if (this.common.isNotBlank(this.info.relOrgId)) {
                let orgId = this.info.relOrgId;
                this.info.orgName = this.orgData.find(item => item.id === that.info.relOrgId).orgName;
                this.orgUserData = await this.common.postUrl("userTF", "loadCurrentOrgUserList", {
                    entityId: 1006122,
                    orgFlag: 1,
                    orgId: orgId
                });
                let payTitle = await this.common.postUrl("userTF", "getRelSubsidiary", {orgId});
                if(payTitle&&!this.writeOffFlag){
                    this.info.payTitle=payTitle;
                }
            } else {
                this.orgUserData = await this.common.postUrl("userTF", "loadCurrentOrgUserList", {
                    entityId: 1006122,
                    orgFlag: 1
                });
            }
            if (this.orgUserData.length == 1)
            {
                this.info.orgApplyUser = this.orgUserData[0].userId;
            }
        },
        async changebill()
        {
            if (this.info.billId && this.info.billId.length > 0)
            {
                let payFee = 0;
                let payTitleMap = new Map();
                for (let i = 0; i < this.billData.length; i++)
                {
                    let item = this.billData[i];
                    for (let j = 0; j < this.info.billId.length; j++)
                    {
                        let billInfo = this.info.billId[j];
                        if (billInfo == item.id)
                        {
                            payFee = this.common.accAdd(payFee, item.totalFee)
                            let orgId = item.orgId;
                            let payTitle = await this.common.postUrl("userTF", "getRelSubsidiary", {orgId});
                            if (this.common.isNotBlank(payTitle))
                            {
                                let count = payTitleMap.get(payTitle);
                                if(count > 0)
                                {
                                    count++;
                                    payTitleMap.set(payTitle, count);
                                }
                                else
                                {
                                    payTitleMap.set(payTitle, 1);
                                }
                            }
                            break;
                        }
                    }
                }
                this.projects[0].mustPayFee = payFee;
                this.projects[0].payFee = payFee;
                if (payTitleMap.size > 0&&!this.writeOffFlag)
                {
                    this.info.payTitle = payTitleMap.keys().next().value;
                }
                if (payTitleMap.size > 1)
                {
                    this.$message.warning("请注意,选择的供应商账单对应不同的报销公司！")
                }
                this.calTotalFee();
            }
        },
        /**
         * 加载数据
         * @returns {Promise<void>}
         */
        async loadFcPayInfoById()
        {
            this.info = await this.common.postUrl("fcPayTF", "loadFcPayInfoById", this.$route.query);
            if (this.common.isNotBlank(this.info.feeIds))
                this.disabledBill = true;
            if (this.common.isNotBlank(this.info.bankAccountName))
                this.hasSelectBank = true;
            if (this.info.payFee > 0)
            {
                this.changeNumMoneyToChinese();
            }

            if (this.$route.query.isCopy == 1)
            {
                this.info.expectDate = this.common.formatDate.getDate();
            }
            let that = this;
            that.info.payTitle = this.info.payTitle + '';
            that.info.payType = this.info.payType + '';
            for (let i = 0; i < this.info.projectList.length; i++)
            {
                this.projects[i] = this.info.projectList[i];
                if (this.$route.query.isCopy == 1){
                    this.projects[i].id='';
                }
                this.projects[i].payProject = this.info.projectList[i].payProject + '';
                this.projects[i].custTenantId = this.info.projectList[i].custTenantId + '';
                if (this.common.isNotBlank(this.projects[i].payBizType))
                {
                    this.projects[i].payBizType = this.info.projectList[i].payBizType + '';
                }
                this.projects[i].payProjectData = [this.projects[i].payProject];
                if (this.common.isNotBlank(this.projects[i].paySubProject))
                {
                    this.projects[i].payProjectData.push(this.projects[i].paySubProject + '');
                }
                if (this.common.isNotBlank(this.projects[i].payThrdProject))
                {
                    this.projects[i].payProjectData.push(this.projects[i].payThrdProject + '');
                }
                if (this.$route.query.isCopy == 1)
                {
                    this.projects[i].businessDate = this.common.formatDate.getMonth();
                }
                this.$nextTick(()=> {
                    this.cascaderChange('cascader' + i);
                });
            }
            let list = this.info.receiptsList;
            let invoiceNumList = [];
            let otherList = [];
            if (this.common.isNotBlank(list))
            {
                for (let i = 0; i < list.length; i++)
                {
                    if (this.common.isNotBlank(list[i].invoiceNums))
                    {
                        list[i].invoiceNums = list[i].invoiceNums.split(",");
                    }
                    else
                    {
                        list[i].invoiceNums = [];
                    }
                    if(list[i].fileType==1){
                        invoiceNumList.push(list[i]);
                    }else{
                        otherList.push(list[i]);
                    }
                }
                if (this.$route.query.isCopy != 1)
                {
                    this.$refs.invoiceNum.initFileList(invoiceNumList);//发票附件
                    this.$refs.other.initFileList(otherList);//其他附件
                }
            }
            
            // 更新审核人列表
            try{    //部门被删除时会报错，需要捕获异常
                // let orgId = this.orgData.find(item => item.orgName === this.info.orgName).id;
                this.orgUserData = await this.common.postUrl("userTF", "loadCurrentOrgUserList", {
                    entityId: 1006117,
                    orgFlag: 1,
                    orgId:this.info.relOrgId,
                });
            }catch(e){}

            // 匹配是否有当前部门，没有则清空
            let org = this.orgData.find(item => item.id == this.info.relOrgId)
            if(!org) {
                this.info.orgName = "";
            }else{
                this.info.orgName = org.orgName;
            }

            this.$forceUpdate();
        },
        calPayFee(idx){
            this.projects[idx].payFee = '';
            if(this.projects[idx].mustPayFee){
                this.projects[idx].payFee = this.common.accSub(this.projects[idx].mustPayFee, this.projects[idx].deduction);
            }
            this.calTotalFee();
        },
        calTotalFee()
        {
            this.info.mustPayFee = 0;
            this.info.deduction = 0;
            this.info.payFee = 0;
            for (let i = 0; i < this.projects.length; i++) {
                this.info.mustPayFee = this.common.accAdd(this.info.mustPayFee, this.projects[i].mustPayFee);
                this.info.deduction = this.common.accAdd(this.info.deduction, this.projects[i].deduction);
                this.info.payFee = this.common.accAdd(this.info.payFee, this.projects[i].payFee);
            }
            this.calActualPayFee();
            if (this.info.payFee >= 10000000)
            {
                this.$message.error("应补（退）金额不能超过一千万！");
                return false;
            }
            this.changeNumMoneyToChinese();
        },
        calActualPayFee()
        {
            this.info.actualPayFee = this.common.accSub(this.info.payFee, this.info.borrowFee);
            this.$forceUpdate();
        },
        /**
         * 银行卡过滤
         * @param queryString
         * @param cb
         */
        querySearch(queryString, cb)
        {
            let restaurants = this.bankData;
            let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            cb(results);
        },
        createFilter(queryString)
        {
            return (restaurant) =>
            {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
            };
        },
        blurBankAccountNameNew(e){
            if(this.info.bankDeposit){
                this.hasSelectBank = true;
            }else{
                this.hasSelectBank = false;
            }
            this.forceUpdate();
        },
        inputBankData(){
            // 输入时清空银行卡信息
            this.info.bankId= this.info.bankAccountName;
            this.info.bankDeposit = '';
            this.info.bankCard = '';
            this.info.bankPhone = '';
            this.info.bankLinkman = '';
            this.hasSelectBank = false;
            this.filterBankDataMethod();
        },
        filterBankDataMethod(query){
            query = this.info.bankAccountName;
            let escapeRegexpString = (value = '') => String(value).replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
            if(query){
                this.filterBankData = [];
                for (let i = 0; i < this.bankData.length; i++) {
                    let visible = new RegExp(escapeRegexpString(query), 'i').test(this.bankData[i].bankAccountName)
                    if (visible) {
                        this.filterBankData.push(this.bankData[i]);
                    }
                }
                this.filterAllSpBankData = [];
                for (let i = 0; i < this.allSpBankData.length; i++) {
                    let visible = new RegExp(escapeRegexpString(query), 'i').test(this.allSpBankData[i].bankAccountName)
                    if (visible) {
                        this.filterAllSpBankData.push(this.allSpBankData[i]);
                    }
                }
            }else{
                this.filterBankData = this.bankData;
                this.filterAllSpBankData = [];
            }
            this.forceUpdate();
        },
        changeBankAccountNameNew(item){
            this.handleSelect(item);
            this.showBankList = false;
            this.$forceUpdate();
        },
        deleteBankAccountName(item){
            let that = this;
            this.$confirm("确定需要删除"+item.bankAccountName+"？", "提示").then(() =>{
                that.common.postUrl("fcPayTF", "delFcBankInfo", item, async function (data) {
                    if (data) {
                        for (let i = 0; i < that.bankData.length; i++) {
                            if(that.bankData[i].value==item.value){
                                that.bankData.splice(i,1);
                                break;
                            }
                        }
                        for (let i = 0; i < that.filterBankData.length; i++) {
                            if(that.filterBankData[i].value==item.value){
                                that.filterBankData.splice(i,1);
                                break;
                            }
                        }
                        that.$message.success("删除成功！");
                        that.forceUpdate();
                    }
                });
            }).catch(() =>{})
        },
        /**
         * 选择银行卡下拉回调
         * @param item
         */
        handleSelect(item)
        {
            this.info.type = item.type;
            this.info.bankAccountName = item.bankAccountName;
            this.info.bankDeposit = item.bankDeposit;
            if(item.type==2){
                this.info.bankDeposit = item.bankDepositName+'-'+item.bankSubName;;
            }
            this.info.bankCard = item.bankCard;
            this.hasSelectBank = true;
            this.initPayee();
        },
        clearBankInfo(){
            if(!this.writeOffFlag){
                this.info.bankAccountName = '';
                this.info.bankDeposit = '';
                this.info.bankCard = '';
                this.info.bankPhone = '';
                this.info.bankLinkman = '';
                this.hasSelectBank = false;
            }
        },
        initPayee()
        {
            if (this.info.bankAccountName && (this.info.bankAccountName.length > 4 || this.info.bankAccountName.indexOf('公司') >= 0))
            {
                // this.info.payee='';
                this.payeeDisable = true;
            }
            else
            {
                if (!this.info.payee)
                {
                    // this.info.payee=this.common.userInfo().userName;
                }
                this.payeeDisable = false;
            }
        },
        changeNumMoneyToChinese()
        {
            let cnNums = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); //汉字的数字
            let none = '—';
            let yuan = '￥';
            this.initChineseMoney();
            if (!this.info.payFee)
            {
                return;
            }
            let money = this.common.accMul(this.info.payFee, 100);
            let moneyStr = money.toString(); //转换为字符串
            let zero = false;
            let j = 0;
            for (let i = moneyStr.length - 1; i >= 0; i--)
            {
                let num = parseInt(moneyStr.charAt(i));
                if (num > 0)
                {
                    zero = true;
                }
                if (zero || num != 0)
                {
                    this.chineseMoney[j] = cnNums[num] + '';
                }
                else
                {
                    this.chineseMoney[j] = none;
                }
                j++;
            }
            if (j <= this.chineseMoney.length - 1)
            {
                this.chineseMoney[j] = yuan;
            }
            else
            {
                this.chineseMoney[j - 1] = yuan + this.chineseMoney[j - 1];
            }
        },
        closePage()
        {
            this.init();
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true);
        },
        /**
         * 上传图片回调
         * @param flag
         */
        fileCallback(imgData,fileType)
        {
            imgData.imgId = imgData.flowId;
            imgData.imgPath = imgData.storePath;
            let allFileList = this.$refs.invoiceNum.getAllFileList();

            //发票编号校验
            if(fileType==1){
                let that = this;
                const loading = this.$loading({
                    lock: true,
                    text: '正在识别发票，请稍等...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                    customClass: 'customElLoadingStyle'
                });
                this.common.postUrl("fcPayTF", "multipleInvoice", {fileId: imgData.storePath,payId:this.$route.query.id}, function (data) {
                    loading.close();
                    let flag = true;
                    if(data.error){
                        that.$message.error(data.error);
                        flag = false;
                    }
                    for (let i = 0; i < allFileList.length; i++){
                        if (that.common.isNotBlank(allFileList[i].imgId)){
                            if(!that.checkInvoiceNums(allFileList[i].invoiceNums,data.invoiceNums)){
                                flag = false;
                            }
                        }
                    }
                    imgData.invoiceNums = data.invoiceNums;
                    if(flag){
                        allFileList.push(imgData);
                        that.$refs.invoiceNum.initFileList(allFileList);
                    }
                },function(){
                    loading.close();
                });
            }
        },
        checkInvoiceNums(invoiceNums1, invoiceNums2)
        {
            if (invoiceNums1 !== null && invoiceNums1 !== undefined && invoiceNums1.length != 0
                && invoiceNums2 !== null && invoiceNums2 !== undefined && invoiceNums2.length != 0)
            {
                for (let i = 0; i < invoiceNums1.length; i++)
                {
                    for (let j = 0; j < invoiceNums2.length; j++)
                    {
                        if (invoiceNums1[i] == invoiceNums2[j])
                        {
                            this.$message.error("发票重复使用！");
                            return false;
                        }
                    }
                }
            }
            return true;
        },
        /**
         * 保存
         * @returns {Promise<boolean>}
         */
        async saveOrUpdatePayOrder()
        {
            if (this.saveFlag)
            {
                this.$message.error("请勿重复保存！");
                return false;
            }
            if (this.common.isBlank(this.info.payTitle))
            {
                this.$message.error("报销公司不能为空!");
                return false;
            }
            if (this.common.isBlank(this.info.orgName))
            {
                this.$message.error("报销部门不能为空!");
                return false;
            }
            this.info.projectList = [];
            let flg = false;
            for (let i = 0; i < this.projects.length; i++){
                if ((this.common.isNotBlank(this.projects[i].payProjectData) && this.projects[i].payProjectData.length > 0)
                    || this.common.isNotBlank(this.projects[i].custTenantId)
                    || this.common.isNotBlank(this.projects[i].businessDate)
                    || this.common.isNotBlank(this.projects[i].payFee)
                    || this.common.isNotBlank(this.projects[i].payRemark))
                {
                    let lineStr = (i+1)+"";
                    // if (this.common.isBlank(this.projects[i].payProject)) {
                    //   this.$message.error("请选择第"+lineStr+"行报销内容!");
                    //   return false;
                    // }
                    let data1 = this.projects[i].payProjectData;
                    if (this.common.isBlank(data1) || data1.length === 0)
                    {
                        this.$message.error("第"+lineStr+"行的报销内容不能为空!");
                        return;
                    }
                    this.projects[i].payProject = data1[0];
                    if (data1.length > 1)
                    {
                        this.projects[i].paySubProject = data1[1];
                        if (data1.length > 2)
                        {
                            this.projects[i].payThrdProject = data1[2];
                        }
                    }

                    // if (this.common.isBlank(this.projects[i].custTenantId)) {
                    //   this.$message.error("请选择第"+lineStr+"行归属客户!");
                    //   return false;
                    // }
                    if (this.common.isBlank(this.projects[i].businessDate))
                    {
                        this.$message.error("请选择第"+lineStr+"行业务月份!");
                        return false;
                    }
                    // if (this.common.isBlank(this.projects[i].payBizType)) {
                    //   this.$message.error("请选择第"+lineStr+"行业务类型!");
                    //   return false;
                    // }
                    if (this.common.isBlank(this.projects[i].payFee))
                    {
                        this.$message.error("请填写第"+lineStr+"行报销金额!");
                        return false;
                    }
                    if (this.common.isNotBlank(this.projects[i].applyNum))
                    {
                        flg = true;
                    }
                    // if (this.projects[i].remainPayFee>0&&this.projects[i].payFee>this.projects[i].remainPayFee) {
                    //   this.$message.error("第"+lineStr+"行报销金额不能大于未核销金额!");
                    //   return false;
                    // }
                    this.info.projectList.push(this.projects[i]);
                }
            }
            if (this.info.projectList.length == 0)
            {
                this.$message.error("请填写至少一行报销内容!");
                return false;
            }

            if (this.common.isBlank(this.info.payType))
            {
                this.$message.error("请选择支付方式!");
                return false;
            }
            // if(!flg&&this.common.isBlank(this.info.contractId)){
            //   this.$message.error("采购申请单号跟合同不能同时为空!");
            //   return false;
            // }
            if (this.info.payType == '3')
            {
                for (let i = 0; i < this.info.projectList.length; i++)
                {
                    if (this.common.isBlank(this.info.projectList[i].payNum))
                    {
                        this.$message.error("选择核销的时候所有的报销内容必须关联请款单!");
                        return false;
                    }
                }
            }
            if (this.common.isBlank(this.info.bankAccountName))
            {
                this.$message.error("请填写收款方全称!");
                return false;
            }
            if (this.common.isBlank(this.info.bankDeposit))
            {
                this.$message.error("请填写开户行!");
                return false;
            }
            if (this.common.isBlank(this.info.bankCard))
            {
                this.$message.error("请填写账号!");
                return false;
            }
            // if (this.common.isBlank(this.info.payee))
            // {
            //   this.$message.error("请填写领款人!");
            //   return false;
            // }
            if (this.info.payType != '3')
            {
                if (this.common.isBlank(this.info.orgApplyUser))
                {
                    this.$message.error("请选择部门审核人!");
                    return false;
                }
            }

            if (this.common.isBlank(this.info.expectDate))
            {
                this.$message.error("请选择预计支付日期!");
                return false;
            }

            let list1 = this.$refs.invoiceNum.getAllFileList();
            // if(list1.length==0){
            //     this.$message.error("请上传发票!");
            //     return false;
            // }
            for (let i = 0; i < list1.length; i++){
              for (let j = i+1; j < list1.length; j++) {
                if (!this.checkInvoiceNums(list1[i].invoiceNums, list1[j].invoiceNums)) {
                  return;
                }
              }
            }

            let list2 = this.$refs.other.getAllFileList();

            this.info.receiptsList = [];
            for (let i = 0; i < list1.length; i++)
            {
                if (list1[i].imgId)
                {
                    list1[i].fileType=1;
                    this.info.receiptsList.push(list1[i]);
                }
            }
            for (let i = 0; i < list2.length; i++)
            {
                if (list2[i].imgId)
                {
                    list2[i].fileType=2;
                    this.info.receiptsList.push(list2[i]);
                }
            }

            let date = new Date();
            let nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
            let errorMonthStr = '';
            for (let i = 0; i < this.projects.length; i++) {
                if (this.common.isNotBlank(this.projects[i].businessDate) && new Date(this.projects[i].businessDate).getTime() >= nextMonth.getTime())
                {
                    errorMonthStr += "," + this.projects[i].businessDate.substring(0, 7);
                }
            }

            //请款单过来走核销的并且选择了对账单，则 应补（退）金额 必须不能大于0
            if (this.info.payType == '3' && this.info.actualPayFee > 0
                && this.common.isNotBlank(this.info.billId) && this.info.billId.length > 0)
            {
                this.$message.error("付款单的核销金额不能大于供应商账单金额!");
                return;
            }
            if (this.common.isNotBlank(errorMonthStr))
            {
                errorMonthStr = errorMonthStr.substring(1);
                var month = date.getMonth() + 1;
                if (month >= 1 && month <= 9)
                {
                    month = "0" + month;
                }
                month = date.getFullYear() + "-" + month;
                let that = this;
                let msg = `
                    <p style="text-align:center;">您选择的业务月份为：<span STYLE="color: red">${errorMonthStr}</span>，</p>
                    <p style="text-align:center;">本月是：<span STYLE="color: red">${month}</span>，</p>
                    <p style="text-align:center;font-weight:bold;margin-top:10px;">是否继续？</p>
                    `;
                this.$confirm(msg, {dangerouslyUseHTMLString: true}, '提示').then(() =>
                {
                    that.save();
                }).catch(() => {});
            }
            else
            {
                this.save();
            }
        },
        async save()
        {
            let method = 'addFcPayInfo';
            if (this.common.isNotBlank(this.$route.query.id) && this.$route.query.isCopy != 1)
            {
                method = 'updateFcPayInfo';
            }
            let info = this.common.copyObj(this.info);
            if (info.billId)
            {
                info.billId = info.billId.join(",");
            }
            let that = this;
            this.saveFlag = true;
            await this.common.postUrl("fcPayTF", method, info, ()=>{
                that.$message.success((that.common.isNotBlank(that.$route.query.id) ? "付款修改" : "付款保存") + "成功！");
                setTimeout(() =>
                {
                    that.saveFlag = false;
                    that.closePage();
                }, 500);
            },()=>{
                that.saveFlag = false;
            },null,true);
        },

        clickItem(param, type)
        {
            if (type == 1)
            {
                if (this.info.feeApplySrc == 2)
                {
                    this.$emit("openTab", {
                        query: {id: param.applyId},
                        urlId: "paymentPlanDetail" + param.applyId,
                        urlName: "查看费用清单",
                        urlPathName: "/paymentPlanDetail",
                        urlPath: "/pt/purchase/paymentPlan/paymentPlanDetail.vue"
                    });
                }
                else
                {
                    this.$emit("openTab", {
                        query: {id: param.applyId},
                        urlId: "purchaseDetail" + param.applyId,
                        urlName: "查看采购费用申请",
                        urlPathName: "/purchaseDetail",
                        urlPath: "/pt/biz/purchase/detail/purchaseApplyDetailMain.vue"
                    });
                }
            }
            else
            {
                this.$emit("openTab", {
                    urlId: "requestFeeDetail" + param,
                    urlName: '查看请款单',
                    urlPathName: '/requestFeeDetail',
                    query: {id: param, type: '0'},
                    urlPath: "/pt/fc/receipts/detail/requestFeeDetailMain.vue",
                });
            }
        },
        switchFile(item,index){
            let invoiceNumFileList = this.$refs.invoiceNum.getAllFileList();
            let otherFileList = this.$refs.other.getAllFileList();
            let that = this;
            this.common.postUrl("fcPayTF", "multipleInvoice", {fileId: item.storePath}, function (data) {
                for (let i = 0; i < invoiceNumFileList.length; i++){
                    if (that.common.isNotBlank(invoiceNumFileList[i].imgId)){
                        if(!that.checkInvoiceNums(invoiceNumFileList[i].invoiceNums,data.invoiceNums)){
                            return;
                        }
                    }
                }
                item.invoiceNums = data.invoiceNums;
                if(data.error){
                    that.$message.error(data.error);
                    return;
                }

                invoiceNumFileList.push(item);
                that.$refs.invoiceNum.initFileList(invoiceNumFileList);
                otherFileList.splice(index,1);
                that.$refs.other.initFileList(otherFileList);
            });
        },

        changeContract()
        {
            let that = this;
            if (!this.info.contractId)
            {
                this.info.accountPeriodName = '';
            }
            else
            {
                this.contractData.forEach(el =>
                {
                    if (el.contractId == that.info.contractId)
                    {
                        that.info.accountPeriodName = el.accountPeriodName;
                        return;
                    }
                });
            }
            this.$forceUpdate();
        },
        forceUpdate()
        {
            this.$forceUpdate();
        },
        cascaderChange(key){
            this.$nextTick(()=>{
                this.$refs[key].computePresentText();
                let label = this.$refs[key].presentText;
                let split = label.split("-");
                let newStr = null;
                if (split.length == 3) {
                    newStr = split[2].substring(0, 6) + split[0].substring(3) + "-" + split[1].substring(3) + "-" + split[2].substring(6);
                } else {
                    newStr = split[1].substring(0, 3) + split[0].substring(3) + "-" + split[1].substring(3);
                }
                this.$refs[key].presentText = newStr;
                this.$refs[key].inputValue = newStr;
            })
        }

    },
    components: {
        myFileModel,
        mySimpleFileModelList,
        scrollSelect,
    },
}
