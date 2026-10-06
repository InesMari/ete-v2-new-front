import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum";
import searchList from "@/components/searchList/searchList.vue";
import cosole from "decimal.js";

export default {
    name: 'feeChangeBillMakeUpManage',
    data() {
        return {
            head: [
                {"name": "账单编号", "code": "billNum", "width": "130", "type": "diy"},
                {"name": "账单月份", "code": "billMonth", "width": "130", "type": "text"},
                {"name": "供应商", "code": "tenantName", "width": "250", "type": "text"},
                {"name": "费用类型", "code": "feeTypeName", "width": "180", "type": "text"},
                {"name": "补录金额", "code": "makeupFee", "width": "100", "type": "text"},
                {"name": "税点", "code": "taxRate", "width": "80", "type": "text"},
                {"name": "是否已确认", "code": "confirmStateName", "width": "90", "type": "text"},
                {"name": "所属区域", "code": "regionName", "width": "120", "type": "text"},
                {"name": "所属部门", "code": "orgName", "width": "120", "type": "text"},
                {"name": "不通过原因", "code": "verifyRemark", "width": "120", "type": "text"},
                {"name": "部门审核", "code": "verifyStr1", "width": "120", "type": "text"},
                // {"name": "审计审核", "code": "verifyStr2", "width": "120", "type": "text"},
                {"name": "审核状态", "code": "stsName", "width": "120", "type": "text"},
                {"name": "补录人", "code": "createUserName", "width": "100", "type": "text"},
                {"name": "补录时间", "code": "createDate", "width": "130", "type": "text"},
            ],
            loadParam: {tenantName: this.$route.query.supplierName,
                sts:this.common.isBlank(this.$route.query.sts) ? [] : this.$route.query.sts,
            },
            showAddMakeup:false,
            makeupInfo:{},
            feeTypeData:[],
            custTenantData:[],//查询账单关联的客户？
            shareDatas:[{}],
            verifyFlg:false,
            viewFlg:false,
            stsData:[],
            orgData:[],

            accrualCostTypeData:[],
            accrualCostSubTypeData:[],
            accrualCostTypeTreeData:[],

            feeTypeDisable:false,
        }
    },
    computed:{
        formData(){
            return [
                {"name":"账单编号","model":"billNum","type":"input","isshow":true},
                {"name":"账单月份","model":"billMonth","type":"input","isshow":true},
                {"name":"供应商名称","model":"tenantName","type":"input","isshow":true},
                {"name":"审核状态","model":"sts","type":"select","options":this.stsData,"label":"codeName","value":"codeValue","clearable":true,"multiple":true,"method":"doQuery","isshow":true},
                {"name":"所属部门","model":"orgId","type":"select","options":this.orgData,"label":"orgName","value":"id","clearable":true,"multiple":true,"method":"doQuery","isshow":true},
            ]
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.init();
        this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        searchList,
    },
    /**
     * 绑定函数
     */
    methods: {
        doQuery(query = this.loadParam) {
            this.loadParam =query;
            this.$refs.table.load("fcSupplierBillTF", "queryBillFeeChangePageForBill", query);
        },
        async init() {
            let that = this;
            that.common.postUrl("commonTF", "getSysStaticData", {codeType: "SUPPLIER_BILL_FEE_TYPE"}, function (data) {
                that.feeTypeData = data;
            });
            that.common.postUrl("commonTF", "getSysStaticData", {codeType: "REQUEST_FEE_STATE"}, function (data) {
                that.stsData = data;
                that.stsData.splice(3, 1);
                that.stsData.splice(4, 1);
            });

            this.accrualCostTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "ACCRUAL_COST_TYPE"});
            this.accrualCostSubTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "ACCRUAL_COST_SUB_TYPE"});
            this.accrualCostTypeTreeData = [];
            this.orgData = await this.common.postUrl("regionOrgTF", "getOrgInfoList", {});

            this.accrualCostTypeData.forEach(item => {
                let data = this.common.copyObj(item);
                let codeValue = data.codeValue;
                data.children = '';
                this.accrualCostSubTypeData.forEach(item2 => {
                    if (item2.codeId == codeValue) {
                        let data2 = this.common.copyObj(item2);
                        if (data.children == '') {
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
            }
        },
        clear() {
            this.loadParam = {};
        },
        /**
         * 账单明细
         */
        toFcSupplierBillDetail(data)
        {
            this.$emit('openTab', {
                urlName: '账单明细',
                urlId: 'supplierBillDetaill_' + data.billId,
                urlPathName: "/fc",
                urlPath: "/pt/fc/supplierBill/detail/billDetail.vue",
                query: {fcSupplierBillId: data.billId},
            });
        },
        /**
         * 删除账单
         */
        deleteFeeChange()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一个需要删除的费用补录数据！");
                return false;
            }
            let data = selectData[0];
            // if (data.confirmState == enumData.FC_CONFIRM_STATE.CONFIRMED)
            // {
            //     this.$message.error("账单已确认，无法删除！");
            //     return false;
            // }
            if (!(enumData.FC_STS.WAIT == data.sts || enumData.FC_STS.NOT == data.sts)) {
                this.$message.error("只有未审核和审核不通过的数据才可以删除！");
                return false;
            }
            let that = this;

            that.$confirm("是否删除补录费用？", "提示").then(() =>{
                that.common.postUrl("fcSupplierBillTF", "delMakeupInfo", data, function (data)
                {
                    that.$message.success("删除成功！");
                    that.doQuery();
                },null,'',true);
            }).catch(() =>{
                //取消新增确认
            });
        },

        forceUpdate(){
            this.$forceUpdate();
        },
        addMakeup(flag){
            if(flag){
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length !== 1) {
                    this.$message.error("请选择一条需要修改账单补录的数据！");
                    return false;
                }
                if(selectData[0].sts!=1&&selectData[0].sts!=9){
                    this.$message.error("已经审核的数据不允许修改！");
                    return false;
                }

                this.makeupInfo= this.common.copyObj(selectData[0]);
                this.makeupInfo.feeType = this.makeupInfo.feeType+'';

                if(this.makeupInfo.feeType=='2'){
                    this.makeupInfo.accrualCostType = String(this.makeupInfo.accrualCostType);
                    this.makeupInfo.accrualCostTypeData = [this.makeupInfo.accrualCostType];
                    if (this.common.isNotBlank(this.makeupInfo.accrualCostSubType)){
                        this.makeupInfo.accrualCostSubType = String(this.makeupInfo.accrualCostSubType);
                        this.makeupInfo.accrualCostTypeData.push(this.makeupInfo.accrualCostSubType);
                    }
                    if(selectData[0].regionId!=1){
                        this.feeTypeDisable=true;
                    }else{
                        this.feeTypeDisable=false;
                    }
                }

                let that = this;
                //查询分摊情况
                this.common.postUrl("fcSupplierBillTF", "queryMakeupShareDatas",{id: selectData[0].id}, function (data) {
                    that.shareDatas = data;
                });

                this.common.postUrl("fcSupplierBillTF", "queryAllBillCustTenantInfo",{billId: selectData[0].billId}, function (data) {
                    that.custTenantData = data;
                    that.showAddMakeup=true;
                });
            }else{
                this.makeupInfo={};
                this.shareDatas=[{}];
                this.showAddMakeup=false;
                this.viewFlg = false;
            }
            this.verifyFlg = false;
            this.$forceUpdate();
        },
        async viewMakeup(data) {
            this.makeupInfo = this.common.copyObj(data);
            this.makeupInfo.feeType = this.makeupInfo.feeType + '';

            if(this.makeupInfo.feeType=='2'){
                this.makeupInfo.accrualCostType = String(this.makeupInfo.accrualCostType);
                this.makeupInfo.accrualCostTypeData = [this.makeupInfo.accrualCostType];
                if (this.common.isNotBlank(this.makeupInfo.accrualCostSubType)){
                    this.makeupInfo.accrualCostSubType = String(this.makeupInfo.accrualCostSubType);
                    this.makeupInfo.accrualCostTypeData.push(this.makeupInfo.accrualCostSubType);
                }
            }
            let that = this;
            //查询分摊情况
            this.common.postUrl("fcSupplierBillTF", "queryMakeupShareDatas", {id: data.id}, function (data) {
                that.shareDatas = data;
            });

            this.common.postUrl("fcSupplierBillTF", "queryAllBillCustTenantInfo", {billId: data.billId}, function (data) {
                that.custTenantData = data;
                that.showAddMakeup = true;
            });
            this.viewFlg = true;
            this.verifyFlg = false;
            this.$forceUpdate();
        },

        async verifyMakeup(flag) {
            if (flag) {
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length !== 1) {
                    this.$message.error("请选择一条需要修改账单补录的数据！");
                    return false;
                }
                if (selectData[0].sts != 1 && selectData[0].sts != 2) {
                    this.$message.error("未审核以及审核中的数据才能审核！");
                    return false;
                }

                //校验审核人
                let data = await this.common.postUrl("fcSupplierBillTF", "checkVerifyMakeupInfo", {id: selectData[0].id});

                this.makeupInfo = this.common.copyObj(selectData[0]);
                this.makeupInfo.feeType = this.makeupInfo.feeType + '';

                if(this.makeupInfo.feeType=='2'){
                    this.makeupInfo.accrualCostType = String(this.makeupInfo.accrualCostType);
                    this.makeupInfo.accrualCostTypeData = [this.makeupInfo.accrualCostType];
                    if (this.common.isNotBlank(this.makeupInfo.accrualCostSubType)){
                        this.makeupInfo.accrualCostSubType = String(this.makeupInfo.accrualCostSubType);
                        this.makeupInfo.accrualCostTypeData.push(this.makeupInfo.accrualCostSubType);
                    }
                }
                let that = this;
                //查询分摊情况
                this.common.postUrl("fcSupplierBillTF", "queryMakeupShareDatas", {id: selectData[0].id}, function (data) {
                    that.shareDatas = data;
                });

                this.common.postUrl("fcSupplierBillTF", "queryAllBillCustTenantInfo", {billId: selectData[0].billId}, function (data) {
                    that.custTenantData = data;
                    that.showAddMakeup = true;
                });
                this.verifyFlg = true;
            } else {
                this.makeupInfo = {};
                this.shareDatas = [{}];
                this.showAddMakeup = false;
                this.verifyFlg = false;
            }
            this.$forceUpdate();
        },
        async verifyMakeupInfo(type) {
            if (this.common.isBlank(this.makeupInfo.id)) {
                this.$message.error("网络异常,关闭当前页面重新选择费用补录审核!");
                return false;
            }
            if (!(enumData.FC_STS.WAIT == this.makeupInfo.sts || enumData.FC_STS.DOING == this.makeupInfo.sts)) {
                this.$message.error("只有未审核和审核中的数据才可以审核！");
                return false;
            }
            this.makeupInfo.type = type;
            if (type === 2) {
                this.$prompt('请输入不通过原因', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(async ({value}) => {
                    if (this.common.isBlank(value)) {
                        this.$message.error("请填写不通过原因！");
                        return false;
                    }
                    this.makeupInfo.verifyRemark = value;
                    await this.verifyMakeupInfoById();
                }).catch(() => {
                });
            } else
                await this.verifyMakeupInfoById();
        },
        async verifyMakeupInfoById(){
            await this.common.postUrl("fcSupplierBillTF", "verifyMakeupInfo", this.makeupInfo);
            this.$message.success("审核成功！");
            let that = this;
            setTimeout(() => {
                that.showAddMakeup = false;
                that.doQuery();
            }, 500);
        },
        async cancelVerifyMakeupInfo() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一条需要取消审核账单补录的数据！");
                return false;
            }
            if (selectData[0].sts != 2 && selectData[0].sts != 3) {
                this.$message.error("审核中以及审核完毕的数据才能取消审核！");
                return false;
            }
            let that = this;
            that.$confirm("确认需要取消审核？", "提示").then(() =>{
                that.common.postUrl("fcSupplierBillTF", "cancelVerifyMakeupInfo", selectData[0], function (data)
                {
                    that.doQuery();
                    that.$message.success("取消审核成功！");
                },null,'',true);
            }).catch(() =>{});
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
                that.$message.success("修改成功！");
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
    },
}
