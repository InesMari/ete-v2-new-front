import tableCommon from "@/components/table/tableCommon.vue"
import enumData from "@/page/pt/enum.js"
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'purchaseApplyManage',
    data()
    {
        return {
            head: [
                {"name": "申请单号", "code": "applyNum", "width": "120", "type": "text"},
                {"name": "请款单号", "code": "reqNums", "width": "330", "type": "diy"},
                {"name": "付款单号", "code": "payNums", "width": "330", "type": "diy"},
                {"name": "申请人", "code": "applyUser", "width": "90", "type": "text"},
                {"name": "申请部门", "code": "applyUserOrg", "width": "150", "type": "text"},
                {"name": "标题", "code": "title", "width": "200", "type": "text"},
                {"name": "紧急程度", "code": "urgentLevelName", "width": "70", "type": "text"},
                {"name": "申请日期", "code": "applyDate", "width": "90", "type": "text"},
                {"name": "采购类型", "code": "purchaseTypeName", "width": "90", "type": "text"},
                {"name": "当前审核人", "code": "currentVerifyUserName", "width": "120", "type": "text"},
                {"name": "部门审核人", "code": "orgVerifyName", "width": "120", "type": "text"},
                {"name": "部门审核时间", "code": "orgVerifyDate", "width": "120", "type": "text"},
                {"name": "部门审核备注", "code": "orgVerifyRemark", "width": "120", "type": "text"},
                {"name": "财务/经管/运营审核人", "code": "nextVerifyName", "width": "200", "type": "text"},
                {"name": "财务/经管/运营审核时间", "code": "nextVerifyDate", "width": "150", "type": "text"},
                {"name": "财务/经管/运营审核备注", "code": "nextVerifyRemark", "width": "150", "type": "text"},
                {"name": "副总经理审核人", "code": "gmoaVerifyName", "width": "120", "type": "text"},
                {"name": "副总经理审核时间", "code": "gmoaVerifyDate", "width": "120", "type": "text"},
                {"name": "副总经理审核备注", "code": "gmoaVerifyRemark", "width": "120", "type": "text"},
                {"name": "总经办审核人", "code": "gmoVerifyName", "width": "120", "type": "text"},
                {"name": "总经办审核时间", "code": "gmoVerifyDate", "width": "120", "type": "text"},
                {"name": "总经办审核备注", "code": "gmoVerifyRemark", "width": "120", "type": "text"},
                {"name": "审核状态", "code": "verifyStateName", "width": "90", "type": "text"},
                {"name": "完结状态", "code": "finishedStateName", "width": "90", "type": "text"},
                {"name": "采购名称", "code": "purchaseName", "width": "200", "type": "text"},
                {"name": "采购方式", "code": "purchasePayTypeName", "width": "90", "type": "text"},
                {"name": "采购金额", "code": "payFee", "width": "90", "type": "text"},
                {"name": "付款方式", "code": "payTypeName", "width": "90", "type": "text"},
                {"name": "预计到货时间", "code": "expectDate", "width": "120", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "120", "type": "text"},
                {"name": "创建日期", "code": "createDate", "width": "130", "type": "text"},
            ],
            query: this.initQuery(),
            stateData: [],
            finishedStateData:[],
            enumData: enumData,
            purchaseTypeData: [],//采购类型
        }
    },
    mounted()
    {
        this.doQuery();
        this.initData();
    },
    components: {
        tableCommon,
        searchList
    },
    methods: {
        initQuery(init)
        {
            this.query = {
                applyNum: '',
                applyUserOrg: '',
                applyUser: '',
                verifyState: this.common.isBlank(this.$route.query.verifyState) ? [] : init ? [] : this.$route.query.verifyState,
                finishedState:'',
                currentVerifyUserName:this.common.isBlank(this.$route.query.currentVerifyUserName) ? null : this.$route.query.currentVerifyUserName,
            };
            return this.query;
        },
        async initData()
        {
            this.stateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "APPLY_VERIFY_STATE"});
            this.finishedStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "FINISHED_STATE"});
            this.purchaseTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_TYPE"});
        },
        async doQuery(query=this.query)
        {
            this.query=query;
            await this.$refs.table.load("purchaseApplyServiceImpl", "loadPurchaseApplyPage", this.query);
        },
        /**
         * 跳转请款单/付款单详情
         * @param param
         * @param code
         * @param index
         * @returns {Promise<void>}
         */
        async toDetail(param, code, index)
        {
            if (code == 'reqNums')
            {
                let id = param.reqIdArray[index];
                await this.open({
                    urlId: "requestFeeDetail" + id,
                    urlName: '查看请款单',
                    urlPathName: '/requestFeeDetail',
                    type: '0',
                    id: id,
                    urlPath: "/pt/fc/receipts/detail/requestFeeDetailMain.vue",
                });
            }
            else if (code == 'payNums')
            {
                let id = param.payIdArray[index];
                await this.open({
                    urlName: '查看付款单',
                    urlId: "payOrderDetail" + id,
                    urlPathName: "/payOrderDetail",
                    urlPath: "/pt/fc/receipts/detail/payOrderDetailMain.vue",
                    id: id,
                    type:0
                });
            }
        },
        async open(data)
        {
            this.$emit("openTab",{
                query: data,
                urlId: data.urlId,
                urlName: data.urlName,
                urlPathName: data.urlPathName,
                urlPath: data.urlPath});
        },
        async addPurchaseApply()
        {
            let data = {
                type: 1,
                urlId: 'purchaseAdd',
                urlName: '新增采购费用申请单',
                urlPathName: '/purchaseAdd',
                urlPath: "/pt/biz/purchase/add/addPurchaseApply.vue",
            }
            await this.open(data);
        },
        async updatePurchaseApply()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要需要修改的采购费用申请单！");
                return false;
            }
            if (enumData.applyVerifyState.approved == selectData[0].verifyState)
            {
                this.$message.error("审核完的采购费用申请不可以修改！");
                return false;
            }
            if (this.common.userInfo().userId != selectData[0].createUserId)
            {
                this.$message.error("只有采购费用申请人自己才可以修改！");
                return false;
            }
            let param = {id : selectData[0].id,type: 2};
            param.urlId = "purchaseUpdate" + param.id;
            param.urlName = "修改采购费用申请单";
            param.urlPathName = "/purchaseUpdate";
            param.urlPath = "/pt/biz/purchase/add/addPurchaseApply.vue";
            await this.open(param);
        },
        async dblclickItem(data)
        {
            let param = {id : data.id,type: 0};
            param.urlId = "purchaseDetail" + param.id;
            param.urlName = "查看采购费用申请单";
            param.urlPathName = "/purchaseDetail";
            param.urlPath = "/pt/biz/purchase/detail/purchaseApplyDetailMain.vue";
            await this.open(param);
        },
        async deletePurchaseApply()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的采购费用申请单！");
                return false;
            }
            if (this.common.userInfo().userId != selectData[0].createUserId)
            {
                this.$message.error("只有采购费用申请人自己才可以删除！");
                return false;
            }
            if (!(enumData.applyVerifyState.notReviewed == selectData[0].verifyState || enumData.applyVerifyState.noApproved == selectData[0].verifyState))
            {
                this.$message.error("只有未审核或审核不通过的采购费用申请单才可以删除！");
                return false;
            }
            let that = this;
            this.$confirm("确定需要删除？", "提示").then(() =>{
                this.common.postUrl("purchaseApplyServiceImpl", "deletePurchaseApplyById", selectData[0], function ()
                {
                    that.doQuery();
                    that.$message.success("删除成功!");
                });
            }).catch(() =>{})
        },
        /**
         * 生成请款/付款申请
         * @returns {Promise<boolean>}
         */
        async generatePayApplyCheck(type)
        {
            let isReq = type === enumData.PAY_TYPE.REQ;
            let selectData = this.$refs.table.getSelectItem();
            // if (selectData.length !== 1)
            // {
            //     this.$message.error("请选择一条需要生成" + (isReq ? "请" : "付") + "款单的采购费用申请单！");
            //     return false;
            // }
            if (selectData.length > 3)
            {
                this.$message.error("最多只能选择3条采购费用申请单生成" + (isReq ? "请" : "付") + "款单！");
                return false;
            }
            let ids = new Array();
            for (let i = 0; i < selectData.length; i++)
            {
                if (enumData.applyVerifyState.approved != selectData[i].verifyState)
                {
                    this.$message.error((selectData.length > 1 ? "第" + (i + 1)+ "条" : "该") + "采购单未审核完,只有审核完的采购费用申请单才可以生成" + (isReq ? "请" : "付") + "款单！");
                    return false;
                }
                ids.push(selectData[i].id);
            }
            let str = ids.join(",")
            let result = await this.common.postUrl("purchaseApplyServiceImpl", "generatePayApplyCheck", {type: type, ids: str});
            if (this.common.isNotBlank(result))
            {
                this.$message.error(result);
                return false;
            }
            await this.open({
                applyIds: str,
                urlName: isReq ? '采购费用申请生成请款单' : '采购费用申请生成付款单',
                urlId: new Date().getTime(),
                urlPathName: isReq ? "/addReq" : "/addPayOrder",
                urlPath: isReq ? "/pt/fc/receipts/add/addRequestFee.vue" : "/pt/fc/receipts/add/addPayOrder.vue",
            });
        },
        /**
         * 审核
         * @returns {Promise<boolean>}
         */
        async verifyPurchaseApply()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要审核的采购费用申请单！");
                return false;
            }
            if (!(enumData.applyVerifyState.notReviewed == selectData[0].verifyState || enumData.applyVerifyState.approving == selectData[0].verifyState))
            {
                this.$message.error("只有未审核或审核中的采购费用申请单才可以审核！");
                return false;
            }
            if (this.common.userInfo().userId != selectData[0].currentVerifyUserId)
            {
                this.$message.error("您不是当前的审核人！");
                return false;
            }
            let that = this;
            let param = this.common.copyObj(selectData[0]);
            this.$prompt("您正在操作审核确认，是否继续?", "提示",{
                confirmButtonText: '通过',
                cancelButtonText: '不通过',
                type: 'warning',
                center: true,
                showInput: true,
                closeOnClickModal: false,
                distinguishCancelAndClose: true,
                inputPlaceholder: '审核备注',
                beforeClose:async function (action, instance, done)
                {
                    param.verifyRemark = instance.inputValue;
                    if (action == 'confirm')
                    {
                        param.type = 1;
                        await that.common.postUrl("purchaseApplyServiceImpl", "verifyPurchaseApplyById", param, null, null, '', true);
                        await that.doQuery();
                        that.$message.success("操作成功！");
                    }
                    else if (action === 'cancel')
                    {
                        param.type = 2;
                        await that.common.postUrl("purchaseApplyServiceImpl", "verifyPurchaseApplyById", param, null, null, '', true);
                        await that.doQuery();
                        that.$message.success("操作成功！");
                    }
                    done();
                }
            });
        },
        donePurchaseApply(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length <0) {
                this.$message.error("请至少选择一条需要审核的采购费用申请单！");
                return false;
            }
            let ids = [];
            let applyNum = [];
            for (let i = 0; i < selectData.length; i++) {
                let data = selectData[i];
                if (enumData.applyVerifyState.approved != data.verifyState) {
                    this.$message.error("只有审核完的采购费用申请单才可以设定完结状态！");
                    return false;
                }
                ids.push(data.id);
                applyNum.push(data.applyNum);
            }
            let applyNumStr = applyNum.join(",")
            let that = this;
            this.$confirm("您正在操作完结确认，申请单号为："+applyNumStr+"！ 是否继续？", "提示").then(() =>{
                this.common.postUrl("purchaseApplyServiceImpl", "donePurchaseApply", {ids,applyNumStr}, function ()
                {
                    that.doQuery();
                    that.$message.success("设定成功!");
                });
            }).catch(() =>{})
        },
        // 打印采购单
        printPurchaseApply(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要审核的采购费用申请单！");
                return false;
            }
            if (enumData.applyVerifyState.approved != selectData[0].verifyState) {
                this.$message.error("只有审核完的采购费用申请单才可以打印！");
                return false;
            }
            this.$emit("openTab",{
                urlId: new Date().getTime(),
                urlName: "打印采购费用申请单",
                urlPath: "/pt/biz/purchase/purchaseApplyPrint.vue",
                query: {id: selectData[0].id}});
        },
        // 审批流程设置
        setProcess(){
            this.$emit("openTab",{
                urlId: new Date().getTime(),
                urlName: "采购审批流程设置",
                urlPath: "/pt/biz/purchase/processSet.vue",
                query: {branchType: 1}});
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
                {"name":"申请单号","placeholder":"请输入申请单号","model":"applyNum","type":"input","isshow":true},
                {"name":"申请人","placeholder":"请输入申请人","model":"applyUser","type":"input","isshow":true},
                {"name":"当前审核人","placeholder":"请输入当前审核人","model":"currentVerifyUserName","type":"input","isshow":true},
                {"name":"申请部门","placeholder":"请输入申请部门","model":"applyUserOrg","type":"input","isshow":true},
                {"name":"审核状态","model":"verifyState","type":"select","options":this.stateData,"label":"codeName","value":"codeValue","multiple":true, "method":"doQuery","isshow":true},
                {"name":"完结状态","model":"finishedState","type":"select","options":this.finishedStateData,"label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                {"name":"采购类型","model":"purchaseType","type":"select","options":this.purchaseTypeData,"label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
            ]
        }
    },
}
