import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import myImport from "@/components/myImport/myImport.vue";
import printJS from 'print-js'

export default {
    name: 'allotManage',
    data()
    {
        return {
            head: [
                {"name": "调拨单号", "code": "transferOrderNum", "width": "150", "type": "text"},
                {"name": "费用申请单号", "code": "applyNum", "width": "150", "type": "diy"},
                {"name": "调出地", "code": "fromWorkName", "width": "120", "type": "text"},
                {"name": "调入地", "code": "toWorkName", "width": "120", "type": "text"},
                {"name": "调拨日期", "code": "chargeDate", "width": "120", "type": "text"},
                {"name": "物种品类", "code": "feeSubTypeName", "width": "200", "type": "text"},
                {"name": "品名", "code": "projectName", "width": "120", "type": "text"},
                {"name": "规格型号", "code": "specification", "width": "120", "type": "text"},
                {"name": "数量单位", "code": "unit", "width": "100", "type": "text"},
                {"name": "调拨数量", "code": "nums", "width": "100", "type": "text"},
                {"name": "调拨返回数量", "code": "returnNums", "width": "160", "type": "text"},
                {"name": "调拨返回日期", "code": "lastDealDate", "width": "160", "type": "text"},
                {"name": "操作日期", "code": "createDate", "width": "150", "type": "text"},
                {"name": "操作人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "验收状态", "code": "verifyStateName", "width": "150", "type": "text"},
                {"name": "验收意见", "code": "verifyRemark", "width": "150", "type": "text"},
                {"name": "验收人", "code": "verifyUserName", "width": "150", "type": "text"},
                {"name": "验收时间", "code": "verifyDate", "width": "150", "type": "text"},
            ],
            query: {
                transferOrderNum: this.$route.query.allocatNum,
                verifyState: '',
                feeType: '',
                feeSubType: '',
                projectName: '',
            },
            props: { checkStrictly: true,value: 'codeValue',label: 'codeName' },
            treeData:[],
            feeTypeData: [],
            feeSubTypeData: [],
            info: {
                returnNum: null,
                returnDate: null,
            },
            allotReturnDialogShow: false,

            allocateDialogShow: false,
            allocateInfo: {
                applyId: null,
                applyDtlId: null,
                allocateNum: null,
                custTenantId: null,
                allocateWorkId: null,
                chargeDate: null,
                settleBody: null,
                remark: null,
            },
            feeApplyData:[],
            customerData: [],
            deliveryWorkData:[],
            orgData:[],
            settleBodyData:[],

            disable:false,
            openFlg:this.$route.query.openFlg,
            isShowSetUserDialog:false,
            emailUserList:[],
            staffData:[],
            title:"提示",

            printData:{},
            allotPrintDialogShow:false,
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.initStaticData();
        this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        myImport,
        tableCommon,
        searchList,
    },
    /**
     * 绑定函数
     */
    methods: {
        async initStaticData()
        {
            this.verifyStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "ACCEPTANCE_STATE"});
            this.feeTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_TYPE"});
            this.feeSubTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_TYPE_SUB"});
            this.customerData = await this.common.postUrl("deviceContractService", "queryContractTenant", {});
            this.orgData = await this.common.postUrl("regionOrgTF", "getOrgInfoList", {});
            this.settleBodyData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType:"PAY_TITLE"});
            for (let i = 0; i < this.feeTypeData.length; i++)
            {
                let item = this.feeTypeData[i];
                if (item.codeValue <= 5)
                {
                    this.feeTypeData.splice(i, 1);
                    i--;
                }
            }
            this.treeData = [];
            this.feeTypeData.forEach(item => {
                let data = this.common.copyObj(item);
                let codeValue = data.codeValue;
                data.children = [];
                this.feeSubTypeData.forEach(item2 => {
                    if (item2.codeId == codeValue)
                    {
                        let data2 = this.common.copyObj(item2);
                        data.children.push(data2);
                    }
                })
                this.treeData.push(data);
            });
            await this.loadWork();
        },
        async doQuery(query = this.query)
        {
            this.query = query;
            let feeTypeData = this.query.feeTypeData;
            if(this.common.isNotBlank(feeTypeData) && feeTypeData.length > 0) {
                this.query.feeType = feeTypeData[0];
                if (feeTypeData.length > 1) {
                    this.query.feeSubType = feeTypeData[1];
                }else{
                    this.query.feeSubType = '';
                }
            }else{
                this.query.feeType = '';
                this.query.feeSubType = '';
            }
            let {items} = await this.$refs.table.load("purStockService", "queryPurAllocatePage", this.query);
            if(this.openFlg==1){
                this.viewItem(items[0]);
                this.openFlg = '';
            }
        },
        async updateItem(flag)
        {
            this.disable = false;
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要修改的调拨！");
                return false;
            }
            if (selectData[0].verifyState == 1)
            {
                this.$message.error("验收通过的不允许修改！");
                return false;
            }
            this.allocateInfo = this.common.copyObj(selectData[0]);
            if (this.common.isNotBlank(this.allocateInfo.settleBody))
            {
                this.allocateInfo.settleBody = this.allocateInfo.settleBody + "";
            }
            this.feeApplyData = await this.common.postUrl("purFeeApplyTF", "loadPurFeeApplyData", {includeApplyId: selectData[0].applyId});
            this.openAllocateDialogShow(flag);
        },
        async viewItem(data)
        {
            this.allocateInfo = this.common.copyObj(data);
            if (this.common.isNotBlank(this.allocateInfo.settleBody))
            {
                this.allocateInfo.settleBody = this.allocateInfo.settleBody + "";
            }
            this.feeApplyData = await this.common.postUrl("purFeeApplyTF", "loadPurFeeApplyData", {includeApplyId: data.applyId});
            this.disable = true;
            this.openAllocateDialogShow(true);
        },
        openAllocateDialogShow(flag)
        {
            this.allocateDialogShow = flag;
            this.$forceUpdate();
        },
        toApplyDetail(item, index){
            let data = {
                query:{id:item.applyId,viewType:1},
                urlId: 'feeApplyDetail'+item.applyId,
                urlName: '查看费用申请单',
                urlPathName: '/feeApplyDetail',
                urlPath: "/pt/purchase/feeApply/examFeeApply.vue",
            }
            this.open(data);
        },
        open(data)
        {
            this.$emit("openTab", {
                query: data.query,
                urlId: data.urlId,
                urlName: data.urlName,
                urlPathName: data.urlPathName,
                urlPath: data.urlPath
            });
        },
        changeApply()
        {
            if (this.common.isNotBlank(this.allocateInfo.applyDtlId))
            {
                this.feeApplyData.forEach(item => {
                    if (item.applyDtlId == this.allocateInfo.applyDtlId)
                    {
                        this.allocateInfo.allocateNum = this.common.accSub(item.demandNums, item.purchaseNums);
                    }
                })
            }
            this.$forceUpdate();
        },
        async changeCustTenant(){
            this.allocateInfo.allocateWorkId = null;
            await this.loadWork();
            this.$forceUpdate();
        },
        async loadWork(tenantId)
        {
            this.deliveryWorkData = await this.common.postUrl("devPurchaseOrderService", "queryDeliveryWorkId", {workId:0,tenantId:tenantId});
        },
        async savePurAllocate()
        {
            let param = this.allocateInfo;
            // if (this.common.isBlank(param.applyDtlId))
            // {
            //     this.$message.error("费用申请单单号为空！");
            //     return false;
            // }
            if (this.common.isBlank(param.allocateNum))
            {
                this.$message.error("调拨数量为空！");
                return false;
            }
            if (this.common.isBlank(param.allocateWorkId))
            {
                this.$message.error("库存地为空！");
                return false;
            }
            if (this.common.isBlank(param.chargeDate))
            {
                this.$message.error("开始计费日期为空！");
                return false;
            }
            if (this.common.isBlank(param.settleBody))
            {
                this.$message.error("结算主体为空！");
                return false;
            }
            if (this.common.isBlank(param.orgId))
            {
                this.$message.error("调入部门为空！");
                return false;
            }
            await this.common.postUrl('purStockService', 'updatePurAllocate', param, null, null, null, true);
            this.$message.success("提交成功");
            await this.doQuery();
            await this.openAllocateDialogShow(false);
        },
        allotReturn()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1)
            {
                this.$message.error("请选择一条数据调拨返回！");
                return;
            }
            if (selectData[0].verifyState != 1)
            {
                this.$message.error("只有验收通过的才能调回！");
                return false;
            }
            this.info = this.common.copyObj(selectData[0]);
            this.info.returnNum = selectData[0].nums;
            this.info.returnDate = null;
            this.openAllotReturnDialogShow(true);
        },
        openAllotReturnDialogShow(flag)
        {
            this.allotReturnDialogShow = flag;
            this.$forceUpdate();
        },
        async saveAllotReturn()
        {
            if (this.common.isBlank(this.info.id))
            {
                this.$message.error("调拨单为空！");
                return false;
            }
            if (this.common.isBlank(this.info.returnNum))
            {
                this.$message.error("调拨返回数量为空！");
                return false;
            }
            if (this.common.isBlank(this.info.returnDate))
            {
                this.$message.error("调拨返回日期为空！");
                return false;
            }
            await this.common.postUrl('purStockService', 'saveAllotReturn', this.info, null, null, null, true);
            this.$message.success("提交成功");
            await this.doQuery();
            this.openAllotReturnDialogShow(false);
        },
        forceUpdate()
        {
            this.$forceUpdate();
        },
        /**
         * 调拨验收
         */
        verifyAllot()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要验收的调拨单!");
                return;
            }
            let item = selectData[0];
            if (item.verifyState != 0)
            {
                this.$message.error("调拨不是未验收的！");
                return;
            }
            let that = this;
            let param = {id: item.id};
            this.$prompt("您正在验收采购库存调拨,是否继续?", "验收",{
                confirmButtonText: '验收通过',
                cancelButtonText: '验收不通过',
                type: 'warning',
                center: true,
                closeOnClickModal: false,
                distinguishCancelAndClose: true,
                beforeClose:async function (action, instance, done)
                {
                    param.verifyRemark = instance.inputValue;
                    if (action == 'confirm')
                    {
                        if (this.common.isBlank(instance.inputValue)) {
                            this.$message.error("请输入验收意见！");
                            return false;
                        }
                        param.verifyState = 1;
                        await this.common.postUrl("purStockService", "verifyPurAllocat", param);
                        await that.doQuery();
                        that.$message.success("操作成功！");
                    }
                    else if (action === 'cancel')
                    {
                        param.verifyState = 2;
                        await this.common.postUrl("purStockService", "verifyPurAllocat", param);
                        await that.doQuery();
                        that.$message.success("操作成功！");
                    }
                    done();
                }
            });
        },
        deleteItem()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1)
            {
                this.$message.error("请选择一条数据删除！");
                return;
            }
            this.$confirm("是否确认删除调拨单？", "提示").then(async () =>
            {
                await this.common.postUrl("purStockService", "deletePurAllocatById", {id: selectData[0].id},
                        null, null, '', true);
                this.$message.success("删除成功！");
                await this.doQuery();
            }).catch(() =>
            {
                //取消
            });
        },
        /**
         * 展示接收邮件人员Dialog
         * @param isShow
         */
        showSetUserDialog(isShow) {
            this.title = "接收邮件人员";
            if (isShow) {
                this.isShowSetUserDialog = true;
                let that = this;
                this.common.postUrl("commonTF", "getRemindEmails", {cfgName:"ALLOT_REMIND_EMAIL_USER"}, function (data) {
                    if (data) {
                        that.emailUserList = data;
                        if (that.emailUserList.length == 0) {
                            that.addRow();
                        }
                        that.queryStaffData();
                    }
                });
            }else {
                this.isShowSetUserDialog = false;
            }
        },

        addRow() {
            let newRow = {
                id: '',
                userName:'',
                billId: '-',
                email: '-',
            };
            this.emailUserList.push(newRow);
            this.$forceUpdate();
        },
        delRow(index) {
            this.emailUserList.splice(index,1);
            if(this.emailUserList.length === 0){
                this.addRow();
            }
            this.$forceUpdate();
        },

        /** 查询人员列表 */
        queryStaffData() {
            let that = this;
            this.common.postUrl("regionOrgTF", "queryStaffData", {haveEmail:1}, function (data) {
                that.staffData = data;
            });
        },

        /**
         * 选择用户
         * @param userData
         */
        selectUser(userData) {
            for (let i = 0; i < this.staffData.length; i++) {
                if (this.staffData[i].userId == userData.userId) {
                    userData.billId = this.staffData[i].billId;
                    userData.userName = this.staffData[i].staffName;
                    userData.email = this.staffData[i].email;
                    break;
                }
            }
        },

        /**
         * 保存仓库人员信息
         */
        saveEmailUser() {
            let method = 'saveEmailUser';
            let that = this;
            let param = {emailUserList : that.emailUserList,cfgName:"ALLOT_REMIND_EMAIL_USER"};
            this.common.postUrl("commonTF", method, param, function (data) {
                if (data) {
                    that.showSetUserDialog(false);
                    that.$message.success("操作成功！");
                }
            },null,'',true);
        },
        toPrint(){            
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1)
            {
                this.$message.error("请选择一条需要打印的数据！");
                return;
            }
            this.printData  = selectData[0];
            this.customerData.forEach(item => {
                if(item.tenantId == this.printData.custTenantId){
                    this.printData.custTenantName = item.tenantName;
                }
            })
            this.deliveryWorkData.forEach(item => {
                if(item.workId == this.printData.allocateWorkId){
                    this.printData.allocateWorkName = item.workName;
                }
            })
            this.orgData.forEach(item => {
                if(item.id == this.printData.orgId){
                    this.printData.orgName = item.orgName;
                }
            })
            this.settleBodyData.forEach(item => {
                if(item.codeValue == this.printData.settleBody){
                    this.printData.settleBodyName = item.codeName;
                }
            })
            console.log(this.printData)
            this.openAllotPrintDialogShow(true);
        },

        // 打开/关闭打印窗口
        openAllotPrintDialogShow(flag){
            this.allotPrintDialogShow = flag;
        },
        print(){
            printJS({
                printable: 'printTable',
                type: 'html',
                css: './static/css/printAllot.css',  //真实路径/public//static/css/print.css
                scanStyles: false,
            })
        },
    },
    computed:{
        formData(){
            return [
                {"name":"调拨单号","model":"transferOrderNum","type":"input","isshow":true},
                {"name":"费用申请单号","model":"applyNum","type":"input","isshow":true},
                {"name":"验收状态","model":"verifyState","type":"select","options":this.verifyStateData,"label":"codeName","value":"codeValue","placeholder":"审核状态","method":"doQuery","isshow":true},
                {"name":"物品种类","model":"feeTypeData","type":"cascader","options":this.treeData,"props":this.props,"placeholder":"物品种类","method":"doQuery","isshow":true},
                {"name":"品名","model":"projectName","type":"input","isshow":true},
            ]
        }
    },
}
