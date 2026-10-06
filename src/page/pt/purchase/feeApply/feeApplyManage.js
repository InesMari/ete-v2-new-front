import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";


export default {
    name: 'feeApplyManage',
    data() {
        return {
            head: [
                {"name": "申请部门", "code": "orgName", "width": "120", "type": "text"},
                {"name": "申请时间", "code": "applyDate", "width": "120", "type": "text"},
                {"name": "申请人", "code": "applyUserName", "width": "120", "type": "text"},
                {"name": "费用申请单单号", "code": "applyNum", "width": "150", "type": "text"},
                {"name": "采购单单号", "code": "purchaseNums", "width": "300", "type": "diy"},
                {"name": "调拨单单号", "code": "allocatNums", "width": "150", "type": "diy"},
                {"name": "费用类型", "code": "feeNames", "width": "300", "type": "text"},
                {"name": "品名/项目", "code": "projectNames", "width": "250", "type": "text"},
                {"name": "需求总数量", "code": "demandNums", "width": "120", "type": "text"},
                {"name": "已采购总数量", "code": "totalPurchaseNums", "width": "120", "type": "text"},
                {"name": "核销总数量", "code": "totalWriteOffNums", "width": "120", "type": "text"},
                {"name": "核销备注", "code": "writeOffRemark", "width": "120", "type": "text"},
                {"name": "参考含税总金额", "code": "referTotalFee", "width": "120", "type": "text"},
                {"name": "申请理由", "code": "applyRemark", "width": "100", "type": "text"},
                {"name": "紧急程度", "code": "urgentLevelName", "width": "160", "type": "text"},
                {"name": "期望完成时间", "code": "expectDate", "width": "120", "type": "text"},
                {"name": "状态", "code": "stateName", "width": "120", "type": "text"},
                {"name": "当前审核人", "code": "currentVerifyUserName", "width": "120", "type": "text"},
                {"name": "申请部门审核", "code": "verifyStr1", "width": "160", "type": "text"},
                {"name": "申请部门审核意见", "code": "verifyRemark1", "width": "160", "type": "text"},
                {"name": "二级审核", "code": "verifyStr2", "width": "160", "type": "text"},
                {"name": "二级审核意见", "code": "verifyRemark2", "width": "160", "type": "text"},
                {"name": "股东代表审核", "code": "verifyStr3", "width": "160", "type": "text"},
                {"name": "股东代表审核意见", "code": "verifyRemark3", "width": "160", "type": "text"},
                {"name": "副总经理审核", "code": "verifyStr4", "width": "160", "type": "text"},
                {"name": "副总经理审核意见", "code": "verifyRemark4", "width": "160", "type": "text"},
                {"name": "总经理审核", "code": "verifyStr5", "width": "160", "type": "text"},
                {"name": "总经理审核意见", "code": "verifyRemark5", "width": "160", "type": "text"},
            ],
            query: {
                applyNum:'',
                isPurchase:'',
                feeType:'',
                feeSubType:'',
                feeTypeData:[],
                projectName:'',
                orgId:'',
                daterange1:'',
                state:this.$route.query.todo == 1?['0','1']:[],
                payState:'',
                currentVerifyUserName:this.$route.query.todo == 1?this.common.userInfo().userName:'',
            },
            whetherData:[],
            feeTypeData:[],
            feeSubTypeData:[],
            stateData:[],
            payStateData:[],
            orgData:[],
            props: { checkStrictly: true,value: 'codeValue',label: 'codeName',multiple: true },
            treeData:[],
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
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
        async init() {
            this.whetherData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WHETHER"});
            this.feeTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_TYPE"});
            this.feeSubTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_TYPE_SUB"});
            this.stateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PUR_FEE_APPLY_STATE"});
            this.payStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_PAY_STATE"});
            this.orgData = await this.common.postUrl("regionOrgTF", "getOrgInfoList", {});
            this.treeData = [];
            for (let i = 0; i < this.feeTypeData.length; i++)
            {
                let item = this.feeTypeData[i];
                if (item.codeValue <= 5)
                {
                    this.feeTypeData.splice(i, 1);
                    i--;
                }
            }
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
        async doQuery(query = this.query) {
            this.query = query;
            if (this.common.isNotBlank(this.query.daterange1) && this.query.daterange1.length == 2) {
                this.query.startApplyDate = this.query.daterange1[0];
                this.query.endApplyDate = this.query.daterange1[1];
            } else {
                this.query.startApplyDate = '';
                this.query.endApplyDate = '';
            }
            let feeTypeData = this.query.feeTypeData;
            let feeTypeSet = new Set();
            let feeSubTypeSet = new Set();
            if(this.common.isNotBlank(feeTypeData) && feeTypeData.length > 0) {
                for (let i = 0; i < feeTypeData.length; i++)
                {
                    let item = feeTypeData[i];
                    if (item.length >= 1)
                    {
                        let feeType = item[0];
                        feeTypeSet.add(feeType);
                    }
                    if (item.length >= 2)
                    {
                        let feeSubType = item[1];
                        feeSubTypeSet.add(feeSubType);
                    }
                }
            }else{
                // this.query.feeType = '';
                // this.query.feeSubType = '';
            }
            this.query.feeTypes = Array.from(feeTypeSet).join(",");
            this.query.feeSubTypes = Array.from(feeSubTypeSet).join(",");
            await this.$refs.table.load("purFeeApplyTF", "queryPurFeeApplyInfoPage", this.query);
        },

        toDel() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据删除");
                return;
            }
            if(selectData[0].state!=0&&selectData[0].state!=2){
                this.$message.error("只有未审核或者审核不通过的数据才能删除");
                return;
            }
            if (this.common.userInfo().userId != selectData[0].applyUser){
                this.$message.error("只有提交人才可以删除");
                return false;
            }
            this.$confirm("是否确认删除费用申请单？", "提示").then(async () =>{
                await this.common.postUrl("purFeeApplyTF", "delPurFeeApplyInfo", {id:selectData[0].id},
                    null, null, '', true);
                this.$message.success("删除费用申请单成功！");
                await this.doQuery();
            }).catch(() =>{
                //取消
            });
        },
        addFeeApply() {
            let data = {
                query:{},
                urlId: 'addFeeApply'+new Date().getTime(),
                urlName: '新增费用申请单',
                urlPathName: '/addFeeApply',
                urlPath: "/pt/purchase/feeApply/addFeeApply.vue",
            }
            this.open(data);
        },
        examFeeApply(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据审核！");
                return;
            }
            if(selectData[0].state!=0&&selectData[0].state!=1){
                this.$message.error("只有未审核或者审核中的数据才能审核");
                return;
            }
            if (this.common.userInfo().userId != selectData[0].currentVerifyUserId){
                this.$message.error("只有当前审核人才可以审核");
                return false;
            }

            let id = selectData[0].id;
            let data = {
                query:{id,viewType:2},
                urlId: 'examFeeApply'+id,
                urlName: '审核费用申请单',
                urlPathName: '/examFeeApply',
                urlPath: "/pt/purchase/feeApply/examFeeApply.vue",
            }
            this.open(data);
        },
        updateFeeApply(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据修改！");
                return;
            }
            if(!(selectData[0].state == 0 || selectData[0].state == 1 || selectData[0].state == 2)){
                this.$message.error("未审核、审核中、审核不通过的数据才能修改！");
                return;
            }
            // if (this.common.userInfo().userId != selectData[0].applyUser){
            //     this.$message.error("只有提交人自己才可以修改！");
            //     return false;
            // }
            let data = {
                query:{id:selectData[0].id},
                urlId: 'updateFeeApply'+new Date().getTime(),
                urlName: '费用申请单修改',
                urlPathName: '/updateFeeApply',
                urlPath: "/pt/purchase/feeApply/addFeeApply.vue",
            }
            this.open(data);
        },
        writeOffPurOrder(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据核销！");
                return;
            }
            if(!(selectData[0].state == 3 || selectData[0].state == 4)){
                this.$message.error("审核完、已处理的数据才能核销！");
                return;
            }
            let nums = this.common.accSub(selectData[0].demandNums,selectData[0].totalPurchaseNums);
            nums = this.common.accSub(nums,selectData[0].totalWriteOffNums);
            nums = this.common.accSub(nums,selectData[0].allocatNums);
            if(nums<=0){
                this.$message.error("可核销数量小于等于0，无需核销！");
                return;
            }
            let data = {
                query:{id:selectData[0].id},
                urlId: 'writeOffFeeApply'+new Date().getTime(),
                urlName: '核销费用申请单',
                urlPathName: '/writeOffFeeApply',
                urlPath: "/pt/purchase/feeApply/writeOffFeeApply.vue",
            }
            this.open(data);

        },
        toDetail(item){
            let viewType = 1;
            if (this.common.userInfo().userId == item.currentVerifyUserId && (item.state == 0 || item.state == 1)){
                viewType = 2;
            }
            let data = {
                query:{id:item.id,viewType:viewType},
                urlId: 'feeApplyDetail'+new Date().getTime(),
                urlName: '查看费用申请单',
                urlPathName: '/feeApplyDetail',
                urlPath: "/pt/purchase/feeApply/examFeeApply.vue",
            }
            this.open(data);
        },
        addPurOrder(){
            let data = {
                urlId: 'addPurOrder'+new Date().getTime(),
                query:{type: 1},
                urlName: '进行采购',
                urlPathName: '/addPurOrder',
                urlPath: "/pt/purchase/purOrder/addPurOrder.vue",
            }
            this.open(data);
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
        toPurOrderDetail(item,index){
            if(item.isOldDev==1){
                this.open({
                    urlId: 'viewDevicePurchase'+item.purchaseIdArray[index],
                    urlName: '查看器具采购单',
                    urlPathName: '',
                    query:{type:3,id:item.purchaseIdArray[index]},
                    urlPath: '/pt/device/devicePurchaseManage/addDevicePurchase.vue'})
            }else{
                this.open({
                    query:{id:item.purchaseIdArray[index],type:0},
                    urlId: 'detailPurOrder' +item.purchaseIdArray[index] + 0,
                    urlName: '采购单详情',
                    urlPathName: '/purFeeDetail',
                    urlPath: "/pt/purchase/purOrder/addPurOrder.vue",
                });
            }
        },
        toAllocatDetail(item,index){
            this.open({
                query:{allocatNum:item.allocatNumArray[index],openFlg:1},
                urlId: 'detailPurOrder' +item.allocatNumArray[index] + 0,
                urlName: '调拨管理',
                urlPathName: '/allotManage',
                urlPath: "/pt/purchase/allot/allotManage.vue",
            });
        },
        // 审批流程设置
        setProcess(){
            this.$emit("openTab",{
                urlId: new Date().getTime(),
                urlName: "费用申请审批流程设置",
                urlPath: "/pt/purchase/feeApply/processSet.vue",
                query: {branchType: 1}});
        },
    },
    computed:{
        formData(){
            return [
                {"name":"费用申请单单号","model":"applyNum","type":"input","placeholder":"费用申请单单号","isshow":true},
                {"name":"费用类型","model":"feeTypeData","type":"cascader","options":this.treeData,"props":this.props,"placeholder":"费用类型","method":"doQuery","isshow":true},
                {"name":"品名/项目","model":"projectNames","type":"textarea","placeholder":"品名/项目","isshow":true},
                {"name":"申请部门","model":"orgId","type":"select","options":this.orgData,"label":"orgName","value":"id","placeholder":"申请部门","method":"doQuery","isshow":true},
                {"name":"申请时间","model":"daterange1","type":"daterange","isshow":true},
                {"name":"状态","model":"state","type":"select","options":this.stateData,"label":"codeName","value":"codeValue","placeholder":"状态","method":"doQuery","isshow":true},
                {"name":"当前审核人","model":"currentVerifyUserName","type":"input","placeholder":"当前审核人","isshow":true},
                // {"name":"付款状态","model":"payState","type":"select","options":this.payStateData,"label":"codeName","value":"codeValue","placeholder":"付款状态","method":"doQuery","isshow":true},
            ]
        }
    },
}
