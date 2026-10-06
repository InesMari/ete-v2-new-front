import enumData from "@/page/pt/enum.js"
import mySimpleFileModelList from "@/components/myFileModel/mySimpleFileModelList.vue";
import scrollSelect from "@/components/scrollSelect/scrollSelect.vue";

export default {
    name: 'addRequestFee',
    data()
    {
        return {
            request: this.initRequest(),
            moneyArray: this.initMoney(),
            map: enumData.yuanMap,
            typeData: [],
            subTypeData:[],
            treeData:[],
            bankData:[],
            allSpBankData:[],
            filterBankData:[],
            filterAllSpBankData:[],
            orgUserData: [],
            list: [{}],
            hasSelectBank: false,//是否选择银行卡
            showBankList:false,
            saveFlag: false,
            titleData: [],
            payTypeData: [],
            isUpdate: this.common.isNotBlank(this.$route.query.id),
            orgData:[],
            contractData:[],
            personalBankHaveEntity:true,
        }
    },
    async mounted()
    {
        await this.initData();
        if (this.common.isNotBlank(this.$route.query.id))
        {
            setTimeout((async () =>
            {
                await this.loadRequestFeeById();
            }), 500);
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
                this.$nextTick(async () => {
                    let data = await this.common.postUrl(bean, method, {ids: feeIds});
                    this.request.payRemark = data.info.remark;
                    this.request.payFee = data.info.fee;
                    if (this.common.isNotBlank(data.fileList))
                        this.$refs.other.initFileList(data.fileList);
                    if (data.info.fee > 0)
                        this.changeMoney(String(data.info.fee));
                });
            }
        }
        if(this.$route.query.feeApplySrc==2){
            if (this.$route.query.isUpdate == 1 || this.$route.query.isCopy == 1)
                return;////修改不走下面逻辑  修改拿的数据是保存的
            this.$nextTick(async () => {
                let apply = await this.common.postUrl("purPayPlanTF", "queryPurPayPlanDtlByIds", {ids: this.$route.query.applyIds});
                // 匹配是否有当前部门，没有则清空
                let org = this.orgData.find(item => item.id == apply.orgId)
                if(org){
                    this.request.relOrgId = org.id;
                    this.request.orgName = org.orgName;
                }
                this.request.applyArray = apply.applyArray;
                this.request.payRemark = apply.payRemark;
                this.request.payProjectData = apply.payProjectData;
                let payFee = 0;
                apply.applyArray.forEach(item => {
                    payFee = this.common.accAdd(payFee, item.payFee);
                })
                if (this.common.isNotBlank(apply.list))
                {
                    this.$refs.other.initFileList(apply.list);
                }
                this.request.payFee = payFee;
                if (this.request.payFee > 0)
                    this.changeMoney(String(this.request.payFee));
            });
        }
        else
        {
            //加载采购申请回显
            if (this.common.isNotBlank(this.$route.query.applyIds))
            {
                if (this.$route.query.isUpdate == 1||this.$route.query.isCopy==1)
                    return;////修改不走下面逻辑  修改拿的数据是保存的
                this.$nextTick(async () => {
                    let apply = await this.common.postUrl("purchaseApplyServiceImpl", "loadPurchaseApplyListByIds", {ids: this.$route.query.applyIds});
                    let orgName = apply.applyUserOrg.split("-")[1];
                    this.request.payType = apply.payTypeSet[0] + "";
                    this.request.applyArray = apply.applyArray;
                    this.request.payRemark = apply.payRemark;
                    let payFee = 0;
                    apply.applyArray.forEach(item => {
                        payFee = this.common.accAdd(payFee, item.payFee);
                    })
                    this.request.payFee = payFee;
                    if (this.common.isNotBlank(apply.list))
                    {                        
                        this.$refs.other.initFileList(apply.list);
                    }
                    if (this.request.payFee > 0)
                        this.changeMoney(String(this.request.payFee));
                        
                    // 匹配是否有当前部门，没有则清空
                    let org = this.orgData.find(item => item.orgName == orgName)
                    if(org){
                        this.request.relOrgId = org.id;
                        this.request.orgName = org.orgName;
                    }

                });
            }
        }

        let entityIds = localStorage.getItem("entityIds").split(",");            
        if(entityIds.includes('1006197')){
            this.personalBankHaveEntity = true;
        }
    },
    methods: {
        /**
         * 初始化请款单对象
         * @returns {{bankAccountName: string, orgName: (null|string|string|*), bankCard: string, bankDeposit: string, bankLinkman: string, createUserName, payRemark: string, payee, orgApplyUser: string, bankPhone: string, payFee: string, payType: number, orgApplyName: string, payProject: string, expectDate: string, createDate: string}}
         */
        initRequest()
        {
            return {
                id: this.$route.query.id,
                feeApplySrc:this.$route.query.feeApplySrc,
                relOrgId: this.common.userInfo().oneLevelOrgId,
                orgName: this.common.userInfo().oneLevelOrgName,
                payProject: '',
                payProjectData:[],
                payTitle: '',
                payRemark: '',
                expectDate: this.common.formatDate.getDate(),
                createDate: this.common.formatDate.getDate(),
                createUserName: this.common.userInfo().userName,
                payee: this.common.userInfo().userName,//领款人默认是自己
                payFee: '',
                bankAccountName: '',
                bankDeposit: '',
                bankCard: '',
                bankPhone: '',
                bankLinkman: '',
                orgApplyName: '',
                payType: '',
                orgApplyUser: '',
                accountPeriodName:'',
                feeIds: this.$route.query.feeIds,
                feeType: this.$route.query.feeType,
            }
        },
        /**
         *
         * @returns {*}
         */
        initMoney()
        {
            this.moneyArray = [];
            for(let i = 0;i < 9; i++)
                this.moneyArray.push('');
            return this.moneyArray;
        },
        /**
         * 初始化静态数据
         */
        async initData()
        {
            this.typeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "REQUEST_FEE_TYPE"});
            this.subTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "REQUEST_FEE_TYPE_SUB"});
            this.thrdTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "REQUEST_FEE_TYPE_THRD"});
            this.subTypeData.forEach(item => {
                let codeValue = item.codeValue;
                item.children = '';
                this.thrdTypeData.forEach(item2 => {
                    if (item2.codeId == codeValue)
                    {
                        let data2 = this.common.copyObj(item2);
                        if(item.children == ''){
                            item.children = [];
                        }
                        item.children.push(data2);
                    }
                })
            })
            this.treeData = [];
            this.typeData.forEach(item => {
                let data = this.common.copyObj(item);
                let codeValue = data.codeValue;
                data.children = '';
                this.subTypeData.forEach(item2 => {
                    if (item2.codeId == codeValue)
                    {
                        let data2 = this.common.copyObj(item2);
                        if(data.children == ''){
                            data.children = [];
                        }
                        data.children.push(data2);
                    }
                })
                this.treeData.push(data);
            })
            let that = this;
            this.bankData = await this.common.postUrl("fcPayTF", "queryFcBankInfo", {});
            this.bankData.forEach(item =>{
                item.value = item.bankAccountName;
                that.filterBankData.push(item);
            });
            this.allSpBankData = await this.common.postUrl("bankTF", "queryAllBankInfoList", {});
            this.orgUserData = await this.common.postUrl("userTF", "loadCurrentOrgUserList", {entityId:1006117,orgFlag:1});
            if(this.orgUserData.length==1){
                this.request.orgApplyUser = this.orgUserData[0].userId;
            }
            this.titleData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PAY_TITLE"});
            let data = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "APPLY_PAY_TYPE"});
            this.payTypeData = [];
            for (let i = 0; i < data.length; i++)
            {
                if (data[i].codeValue != 3)
                {
                    this.payTypeData.push(data[i]);
                }
            }
            this.orgData = await this.common.postUrl("regionOrgTF", "queryOrgSel");
            this.$forceUpdate();
            let payTitle = await this.common.postUrl("userTF", "getRelSubsidiary");
            if(payTitle){
                this.request.payTitle=payTitle;
            }
            this.contractData =  await this.common.postUrl("contractService", "queryAllContracts");
        },
        async changeOrg() {
            let that = this;
            this.request.orgApplyUser = '';
            if (this.common.isNotBlank(this.request.relOrgId)) {
                let orgId = this.request.relOrgId;
                this.request.orgName = this.orgData.find(item => item.id === that.request.relOrgId).orgName;
                this.orgUserData = await this.common.postUrl("userTF", "loadCurrentOrgUserList", {
                    entityId: 1006117,
                    orgFlag: 1,
                    orgId:orgId
                });
                let payTitle = await this.common.postUrl("userTF", "getRelSubsidiary", {orgId});
                if(payTitle){
                    this.request.payTitle=payTitle;
                }
            }else{
                this.orgUserData = await this.common.postUrl("userTF", "loadCurrentOrgUserList", {entityId:1006117,orgFlag:1});
            }
            if (this.orgUserData.length == 1) {
                this.request.orgApplyUser = this.orgUserData[0].userId;
            }
        },
        /**
         * 加载数据
         * @returns {Promise<void>}
         */
        async loadRequestFeeById()
        {
            this.request = await this.common.postUrl("requestServiceImpl", "loadRequestFeeById", {id:this.$route.query.id});
            if (this.request.payFee > 0)
                this.changeMoney(String(this.request.payFee));
            if (this.common.isNotBlank(this.request.bankAccountName))
                this.hasSelectBank = true;

            this.request.payProjectData = [this.request.payProject];
            if(this.common.isNotBlank(this.request.paySubProject)){
                this.request.payProjectData.push(this.request.paySubProject);
            }
            if(this.common.isNotBlank(this.request.payThrdProject)){
                this.request.payProjectData.push(this.request.payThrdProject);
            }
            if (this.$route.query.isCopy == 1)
            {
                this.request.createUserName = this.common.userInfo().userName;
            }

            if (this.common.isNotBlank(this.request.list))
            {
                this.$refs.other.initFileList(this.request.list);
            }
            this.$nextTick(()=> {
                this.cascaderChange('cascader');
            });
            // 更新审核人列表
            try{    //部门被删除时会报错，需要捕获异常
                // let orgId = this.orgData.find(item => item.orgName === this.request.orgName).id;
                this.orgUserData = await this.common.postUrl("userTF", "loadCurrentOrgUserList", {
                    entityId: 1006117,
                    orgFlag: 1,
                    orgId:this.request.relOrgId,
                });
            }catch(e){}
            // 匹配是否有当前部门，没有则清空
            let org = this.orgData.find(item => item.id == this.request.relOrgId)
            if(!org) {
                this.request.orgName = "";
            }else{
                this.request.orgName = org.orgName;
            }

            this.$forceUpdate();
        },
        /**
         * 输入金额
         * @param data
         * @returns {boolean}
         */
        changeMoney(data)
        {
            let none = '—';
            let yuan = '￥';
            if (data >= 10000000)
            {
                this.$message.error("目前不允许报销超过一千万的数额，请重新填写金额！");
                return false;
            }
            this.initMoney();
            if (this.common.isNotBlank(data) && !isNaN(data))
            {
                let money = this.common.accMul(data, 100);
                let moneyStr = money.toString(); //转换为字符串
                let zero = false;
                let j = 0;//￥放的位置

                for (let i = moneyStr.length - 1; i >= 0; i--)
                {
                    let num = parseInt(moneyStr.charAt(i));
                    if (num > 0)
                        zero = true;
                    if (zero || num != 0)
                        this.moneyArray[j] = this.map.get(String(num));
                    else
                        this.moneyArray[j] = none;
                    j++;
                }
                //处理￥
                if(j <= this.moneyArray.length - 1)
                    this.moneyArray[j] = yuan;
                else
                    this.moneyArray[j - 1] = yuan + this.moneyArray[j - 1];
            }
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
            return (restaurant) => {
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
            };
        },
        blurBankAccountNameNew(){
            if(this.request.bankDeposit){
                this.hasSelectBank = true;
            }else{
                this.hasSelectBank = false;
            }
            this.forceUpdate();
        },
        inputBankData(){            
            // 输入时清空银行卡信息
            this.request.bankId= this.request.bankAccountName;
            this.request.bankDeposit = '';
            this.request.bankCard = '';
            this.request.bankPhone = '';
            this.request.bankLinkman = '';
            this.hasSelectBank = false;
            this.filterBankDataMethod();
        },
        filterBankDataMethod(query){
            query = this.request.bankAccountName;
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
                this.common.postUrl("fcPayTF", "delFcBankInfo", item, async function (data) {
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
            this.request.type = item.type;
            this.request.bankAccountName = item.bankAccountName;
            this.request.bankDeposit = item.bankDeposit;
            this.request.bankCard = item.bankCard;
            this.request.bankPhone = item.bankPhone;
            this.request.bankLinkman = item.bankLinkman;
            if(item.type==2){
                this.request.bankDeposit = item.bankDepositName+'-'+item.bankSubName;
            }
            this.hasSelectBank = true;
        },
        clearBankInfo(){
            this.request.bankAccountName = '';
            this.request.bankDeposit = '';
            this.request.bankCard = '';
            this.request.bankPhone = '';
            this.request.bankLinkman = '';
            this.hasSelectBank = false;
        },
        /**
         * 上传图片回调
         * @param flag
         */
        fileCallback(imgData)
        {            
            imgData.imgId = imgData.flowId;
            imgData.imgPath = imgData.storePath;
            // //发票编号校验
            // let that = this;
            // this.common.postUrl("fcPayTF", "multipleInvoice", {fileId: imgData.storePath}, function (data) {
            //     for (let i = 0; i < that.list.length; i++){
            //         if (that.common.isNotBlank(that.list[i].imgId)){
            //             if(!that.checkInvoiceNums(that.list[i].invoiceNums,data.invoiceNums)){
            //                 return;
            //             }
            //         }
            //     }
            //     that.list[imgData.componentId].invoiceNums = data.invoiceNums;
            //     if(data.error){
            //         that.$message.error(data.error);
            //     }
            // });
        },
        checkInvoiceNums(invoiceNums1,invoiceNums2){
            if(invoiceNums1 !== null && invoiceNums1 !== undefined &&invoiceNums1.length!=0
                &&invoiceNums2 !== null && invoiceNums2 !== undefined &&invoiceNums2.length!=0){
                for (let i = 0; i < invoiceNums1.length; i++) {
                    for (let j = 0; j < invoiceNums2.length; j++) {
                        if(invoiceNums1[i]==invoiceNums2[j]){
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
        async saveOrUpdateRequestFee()
        {
            if (this.saveFlag)
            {
                this.$message.error("请重新勿重复保存！");
                return false;
            }
            if (this.common.isBlank(this.request.payTitle))
            {
                this.$message.error("请选择报销公司!");
                return false;
            }
            if (this.common.isBlank(this.request.orgName))
            {
                this.$message.error("请输入报销部门!");
                return false;
            }
            // if (this.common.isBlank(this.request.payProject))
            // {
            //     this.$message.error("请选择报销内容!");
            //     return false;
            // }
            if (this.common.isBlank(this.request.payFee))
            {
                this.$message.error("请填写报销金额!");
                return false;
            }
            if (this.common.isBlank(this.request.payType))
            {
                this.$message.error("请选择支付方式!");
                return false;
            }
            if (this.common.isBlank(this.request.bankAccountName))
            {
                this.$message.error("请填写收款方全称!");
                return false;
            }
            if (this.common.isBlank(this.request.bankDeposit))
            {
                this.$message.error("请填写开户行!");
                return false;
            }
            if (this.common.isBlank(this.request.bankCard))
            {
                this.$message.error("请填写账号!");
                return false;
            }
            if (this.common.isBlank(this.request.orgApplyUser))
            {
                this.$message.error("请选择部门审核人!");
                return false;
            }
            // if((this.request.applyArray==null||this.request.applyArray.length==0)&&this.common.isBlank(this.request.contractId)){
            //     this.$message.error("采购费用申请跟合同不能同时为空!");
            //     return false;
            // }
            this.request.list = this.$refs.other.getAllFileList();
            this.request.applyIds = this.$route.query.applyIds;//采购申请
            // for (let i = 0; i < this.request.list.length; i++){
            //     for (let j = i+1; j < this.request.list.length; j++) {
            //         if (!this.checkInvoiceNums(this.request.list[i].invoiceNums, this.request.list[j].invoiceNums)) {
            //             return;
            //         }
            //     }
            // }
            if(this.$route.query.isCopy==1){
                this.request.id=null;
            }
            let data = this.request.payProjectData;
            if(this.common.isBlank(data) || data.length === 0)
            {
                this.$message.error("报销内容不能为空!");
                return;
            }
            this.request.payProject = data[0];
            if (data.length > 1)
            {
                this.request.paySubProject = data[1];
                if(data.length>2){
                    this.request.payThrdProject = data[2];
                }
            }
            this.saveFlag = true;
            let that = this;
            await this.common.postUrl("requestServiceImpl", "saveOrUpdateRequestFee", this.request, (data) => {
                that.$message.success((that.common.isNotBlank(that.$route.query.id)&&that.$route.query.isCopy!=1? "请款修改" :"请款保存") +"成功！");
                setTimeout(() => {
                    that.saveFlag = false;
                    that.closePage();
                }, 500);
            },(data)=>{
                that.saveFlag = false;
            },null,true);

        },
        changeDate()
        {
            this.$forceUpdate();
        },
        changeContract(){
            let that = this;
            if(!this.request.contractId){
                this.request.accountPeriodName='';
            }else{
                this.contractData.forEach(el => {
                    if(el.contractId==that.request.contractId){
                        that.request.accountPeriodName=el.accountPeriodName;
                        return;
                    }
                });
            }
            this.$forceUpdate();
        },
        closePage() {
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId);
        },
        async clickItem(item, index)
        {
            if(this.request.feeApplySrc==2){
                this.$emit("openTab",{
                    query: {id : item.applyId},
                    urlId: "paymentPlanDetail" + item.applyId,
                    urlName: "查看费用清单",
                    urlPathName: "/paymentPlanDetail",
                    urlPath: "/pt/purchase/paymentPlan/paymentPlanDetail.vue"});
            }else{
                this.$emit("openTab",{
                    query: {id : item.applyId},
                    urlId: "purchaseDetail" + item.applyId,
                    urlName: "查看采购费用申请",
                    urlPathName: "/purchaseDetail",
                    urlPath: "/pt/biz/purchase/detail/purchaseApplyDetailMain.vue"});
            }
        },
        forceUpdate(){
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
        mySimpleFileModelList,
        scrollSelect,
    },
}
