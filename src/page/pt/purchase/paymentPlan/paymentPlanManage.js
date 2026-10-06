import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";

export default {
    name: 'paymentPlanManage',
    data() {
        return {
            head: [
                {"name": "费用清单编号", "code": "planNum", "width": "150", "type": "text"},
                {"name": "费用申请人", "code": "applyUserName", "width": "150", "type": "text"},
                {"name": "采购人", "code": "purchaseUserName", "width": "150", "type": "text"},
                {"name": "成本发生月份", "code": "billMonth", "width": "120", "type": "text"},
                {"name": "成本发生部门", "code": "orgName", "width": "150", "type": "text"},
                {"name": "含税金额", "code": "fee", "width": "120", "type": "text"},
                {"name": "采购单号", "code": "purchaseNum", "width": "120", "type": "diy"},
                {"name": "供应商合同号", "code": "contractNum", "width": "120", "type": "diy"},
                {"name": "供应商", "code": "tenantName", "width": "100", "type": "text"},
                // {"name": "是否入账", "code": "entryBillFlgName", "width": "100", "type": "text"},
                // {"name": "对账单编号", "code": "billNum", "width": "160", "type": "text"},
                {"name": "付款状态", "code": "payStateName", "width": "150", "type": "text"},
                {"name": "请款单号", "code": "reqNums", "width": "150", "type": "diy"},
                {"name": "付款单号", "code": "payNums", "width": "150", "type": "diy"},
                {"name": "付款条件", "code": "payCondition", "width": "150", "type": "text"},
                {"name": "实际付款时间", "code": "payDate", "width": "150", "type": "text"},
                {"name": "费用申请单号", "code": "applyNum", "width": "150", "type": "diy"},
                {"name": "申请理由", "code": "applyRemark", "width": "100", "type": "text"},
                {"name": "费用类型", "code": "feeNames", "width": "150", "type": "text"},
                {"name": "品名/项目", "code": "projectName", "width": "150", "type": "text"},
                {"name": "规格型号", "code": "specification", "width": "150", "type": "text"},
                {"name": "数量", "code": "nums", "width": "150", "type": "text"},
                {"name": "付款类型", "code": "payTypeName", "width": "150", "type": "text"},
                {"name": "租赁/分期月份数", "code": "depreciationMonthCount", "width": "150", "type": "text"},
                {"name": "开始计费日期", "code": "chargeDate", "width": "150", "type": "text"},
                {"name": "增值税", "code": "rate", "width": "150", "type": "text"},
                {"name": "含税参考单价", "code": "referPrice", "width": "150", "type": "text"},
                {"name": "收货日期", "code": "inDate", "width": "150", "type": "text"},
                {"name": "账期（天）", "code": "accountPeriod", "width": "120", "type": "text"},
                {"name": "超期0-30天", "code": "fee1", "width": "100", "type": "text"},
                {"name": "超期31-60天", "code": "fee2", "width": "100", "type": "text"},
                {"name": "超期61-90天", "code": "fee3", "width": "100", "type": "text"},
                {"name": "超期91-180天", "code": "fee4", "width": "100", "type": "text"},
                {"name": "超期181-360天", "code": "fee5", "width": "100", "type": "text"},
                {"name": "超期360天以上", "code": "fee6", "width": "100", "type": "text"},

                // {"name": "超期应付账龄", "width": "480", "type": "text",
                //     "children":[
                //         {"name": "0-30天", "code": "fee1", "width": "80", "type": "text"},
                //         {"name": "31-60天", "code": "fee2", "width": "80", "type": "text"},
                //         {"name": "61-90天", "code": "fee3", "width": "80", "type": "text"},
                //         {"name": "91-180天", "code": "fee4", "width": "80", "type": "text"},
                //         {"name": "181-360天", "code": "fee5", "width": "80", "type": "text"},
                //         {"name": "360天以上", "code": "fee6", "width": "80", "type": "text"},
                //     ]
                // },
            ],
            loadParam: {
                applyUserName:this.common.userInfo().userName,
                purchaseUserName:'',
                billMonth:'',
                orgId:'',
                applyNum:'',
                contractNum:'',
                tenantName:'',
                entryBillFlg:'',
                payState:'',
                feeType:'',
                feeTypeData:[],
                feeSubType:'',
            },
            feeTypeData:[],
            feeSubTypeData:[],
            orgData:[],
            whetherData:[],
            payStateData:[],
            enumData: enumData,
            props: { checkStrictly: true,value: 'codeValue',label: 'codeName' },
            treeData:[],

            showViewDialog:false,
            info:{type:1},
            payPlanList:[],
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initStaticData();
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
        async initStaticData() {
            this.orgData = await this.common.postUrl("regionOrgTF", "getOrgInfoList", {});
            this.whetherData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WHETHER"});
            this.feeTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_TYPE"});
            this.feeSubTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_TYPE_SUB"});
            this.payStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_PAY_STATE"});
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
            })
        },
        async doQuery(query = this.loadParam) {
            this.loadParam = query;
            let feeTypeData = this.loadParam.feeTypeData;
            if(this.common.isNotBlank(feeTypeData) && feeTypeData.length > 0) {
                this.loadParam.feeType = feeTypeData[0];
                if (feeTypeData.length > 1) {
                    this.loadParam.feeSubType = feeTypeData[1];
                }else{
                    this.loadParam.feeSubType = '';
                }
            }else{
                this.loadParam.feeType = '';
                this.loadParam.feeSubType = '';
            }
            await this.$refs.table.load("purPayPlanTF", "queryPurPayPlanInfoPage", this.loadParam);
        },
        dblclickItem(item){
            this.open({
                query:{id:item.id},
                urlId: 'paymentPlanDetail' + item.id,
                urlName: '费用清单详情',
                urlPathName: '/paymentPlanDetail',
                urlPath: "/pt/purchase/paymentPlan/paymentPlanDetail.vue",
            });
        },
        open(data)
        {
            this.$emit("openTab",{
                query: data.query,
                urlId: data.urlId,
                urlName: data.urlName,
                urlPathName: data.urlPathName,
                urlPath: data.urlPath});
        },

        /**
         * 生成请款/付款申请
         * @returns {Promise<boolean>}
         */
        async generatePayApplyCheck(type) {
            let isReq = type === enumData.PAY_TYPE.REQ;
            let selectData = this.$refs.table.getSelectItem();
            let ids = new Array();
            let tenantIdSet  = new Set();
            let orgIdSet  = new Set();
            if(selectData.length<=0){
                this.$message.error("请先选择费用清单");
                return false;
            }
            for (let i = 0; i < selectData.length; i++) {
                if (selectData[i].payState==2) {
                    this.$message.error((selectData.length > 1 ? "第" + (i + 1)+ "条" : "该") + "费用清单已经全部生成" + (isReq ? "请" : "付") + "款单！");
                    return false;
                }
                if (selectData[i].payFee>=selectData[i].fee) {
                    this.$message.error((selectData.length > 1 ? "第" + (i + 1)+ "条" : "该") + "费用清单已经全部生成" + (isReq ? "请" : "付") + "款单！");
                    return false;
                }
                ids.push(selectData[i].id);
                tenantIdSet.add(selectData[i].tenantId);
                orgIdSet.add(selectData[i].orgId);
            }
            if(tenantIdSet.size>1){
                this.$message.error("不能选择不同的供应商");
                return false;
            }
            if(orgIdSet.size>1){
                this.$message.error("不能选择不同的部门");
                return false;
            }
            let str = ids.join(",")
            if(!isReq&&ids.length>1){
                this.info={type: 1,str:str,ids:ids};
                this.payPlanList = this.common.copyObj(selectData);
                if(selectData.length<4){
                    selectData.forEach((item,index) => {
                        this.info['payPlanIds'+(index+1)] = [item.id];
                    })
                }
                this.showViewDialog=true;
            }else{
                await this.open({
                    query:{applyIds: str,type:1,feeApplySrc:2,fromPaymentPlan:1},
                    urlName: isReq ? '采购申请生成请款单' : '采购申请生成付款单',
                    urlId: new Date().getTime(),
                    urlPathName: isReq ? "/addReq" : "/addPayOrder",
                    urlPath: isReq ? "/pt/fc/receipts/add/addRequestFee.vue" : "/pt/fc/receipts/add/addPayOrder.vue",
                });
            }
        },
        async addPayOrder() {
            this.showViewDialog=false;
            let applyIdArray;
            if(this.info.type==2){
                if(this.payPlanList.length>2){
                    let id1 = this.info.payPlanIds1.join(",");
                    let id2 = this.info.payPlanIds2.join(",");
                    let id3 = this.info.payPlanIds3.join(",");
                    applyIdArray = [];
                    if(id1) applyIdArray.push(id1);
                    if(id2) applyIdArray.push(id2);
                    if(id3) applyIdArray.push(id3);
                }
            }
            await this.open({
                query: {applyIds: this.info.str, applyIdArray, type: this.info.type, feeApplySrc: 2,fromPaymentPlan:1},
                urlName: '采购申请生成付款单',
                urlId: new Date().getTime(),
                urlPathName: "/addPayOrder",
                urlPath: "/pt/fc/receipts/add/addPayOrder.vue",
            });
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
                    query:{id: id,type:0},
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
                    query:{id: id,type:0}
                });
            }
        },
        toApplyDetail(item){
            let data = {
                query:{id:item.applyId,viewType:1},
                urlId: 'feeApplyDetail'+item.applyId,
                urlName: '查看费用申请单',
                urlPathName: '/feeApplyDetail',
                urlPath: "/pt/purchase/feeApply/examFeeApply.vue",
            }
            this.open(data);
        },
        /**
         * 导出
         */
        download() {
            this.$refs.table.downloadExcelFile();
        },
        toPurOrderDetail(item){
            this.open({
                query:{id:item.purchaseOrderId,type:0},
                urlId: 'detailPurOrder' +item.purchaseOrderId + 0,
                urlName: '采购单详情',
                urlPathName: '/purFeeDetail',
                urlPath: "/pt/purchase/purOrder/addPurOrder.vue",
            });
        },
        toContractDetail(item){
            let baseTitle = '';
            if(item.contractType==2){
                baseTitle = "供应商-运输";
            }else if(item.contractType==3){
                baseTitle = "供应商-仓储运作";
            }else if(item.contractType==4){
                baseTitle = "供应商-器具容器";
            }else if(item.contractType==5){
                baseTitle = "供应商-保险";
            }
            let title = "查看"+baseTitle+"合同";
            this.$emit('openTab', {
                urlName: title,
                urlId: 'contractDetail'+new Date().getTime(),
                urlPathName: "/contractDetail",
                urlPath: "/pt/cm/contract/contractDetail.vue",
                query: {type:3,contractType:item.contractType,id:item.contractId},
            });
        },
        toSummaryPage(){
            this.$emit("openTab",{
                urlId: 'paymentPlanSummary',
                urlName: "汇总表",
                urlPathName: "/paymentPlanSummary",
                urlPath: "/pt/purchase/paymentPlan/paymentPlanSummaryMain.vue"});
        },
        payPlanIdsChange(){
            this.payPlanList.forEach(item=>{
                if(this.info.payPlanIds1.includes(item.id) || this.info.payPlanIds2.includes(item.id) || this.info.payPlanIds3.includes(item.id)){
                    item.disabled = true;
                }else{
                    item.disabled = false;
                }
            })
            this.$forceUpdate();
        },
    },
    computed:{
        formData(){
            return [
                {"name":"费用清单编号", "model": "planNum", "type": "input","isshow":true},
                {"name":"费用申请人","model":"applyUserName","type":"input","isshow":true},
                {"name":"采购人","model":"purchaseUserName","type":"input","isshow":true},
                {"name":"费用申请单号","model":"applyNum","type":"input","isshow":true},
                {"name":"申请理由","model":"applyRemark","type":"input","isshow":true},
                {"name":"采购单号","model":"purchaseNum","type":"input","isshow":true},
                {"name":"费用类型","model":"feeTypeData","type":"cascader","options":this.treeData,"props":this.props,"placeholder":"费用类型","method":"doQuery","isshow":true},
                {"name":"成本发生月份","model":"billMonth","type":"month","isshow":true},
                {"name":"成本发生部门","model":"orgId","type":"select","options":this.orgData,"label":"orgName","value":"id","method":"doQuery","isshow":true},
                {"name":"供应商合同号","model":"contractNum","type":"input","isshow":true},
                {"name":"供应商","model":"tenantName","type":"input","isshow":true},
                // {"name":"是否入账","model":"entryBillFlg","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                {"name":"付款状态","model":"payState","type":"select","options":this.payStateData,"label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                // {"name":"费用类型","model":"feeType","type":"select","options":this.feeTypeData,"label":"codeName","value":"codeValue","placeholder":"费用类型","method":"doQuery","isshow":true},
                // {"name":"费用子类型","model":"feeSubType","type":"select","options":this.feeSubTypeData,"label":"codeName","value":"codeValue","placeholder":"费用子类型","method":"doQuery","isshow":true},
            ]
        }
    },
}
