import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import myImport from "@/components/myImport/myImport.vue";


export default {
    name: 'feeInfoManage',
    data() {
        return {
            head: [
                {"name": "费用类型", "code": "feeSubTypeName", "width": "300", "type": "text"},
                {"name": "成本类型", "code": "accrualCostSubTypeName", "width": "180", "type": "text"},
                {"name": "费用类别", "code": "codeTip", "width": "120", "type": "text"},
                // {"name": "采购类型", "code": "purchaseTypeName", "width": "150", "type": "text"},
                {"name": "品名/项目", "code": "projectName", "width": "150", "type": "text"},
                {"name": "启用禁用状态", "code": "stsName", "width": "90", "type": "text"},
                {"name": "规格型号", "code": "specification", "width": "200", "type": "text"},
                {"name": "数量单位", "code": "unit", "width": "100", "type": "text"},
                {"name": "付款类型", "code": "payTypeName", "width": "120", "type": "text"},
                {"name": "参考含税单价", "code": "referPrice", "width": "120", "type": "text"},
                {"name": "是否需要走采购单", "code": "isPurchaseName", "width": "120", "type": "text"},
                {"name": "是否资产管理", "code": "isAssetName", "width": "120", "type": "text"},
                {"name": "税率(%)", "code": "rate", "width": "120", "type": "text"},
                {"name": "租赁/分期/折旧月份数", "code": "depreciationMonthCount", "width": "200", "type": "text"},
                {"name": "物品下限数量", "code": "up", "width": "100", "type": "text"},
                {"name": "物品上限数量", "code": "floor", "width": "160", "type": "text"},
                {"name": "备货周期", "code": "stockingCycle", "width": "150", "type": "text"},
                {"name": "供应商", "code": "tenantName", "width": "300", "type": "text"},
                {"name": "供应商合同", "code": "contractNum", "width": "150", "type": "diy"},
                {"name": "合同开始日期", "code": "contractBeginDate", "width": "120", "type": "text"},
                {"name": "合同结束日期", "code": "contractEndDate", "width": "160", "type": "text"},
                {"name": "付款条件", "code": "payCondition", "width": "120", "type": "text"},
                {"name": "银行账号", "code": "bankCard", "width": "300", "type": "text"},
                {"name": "供应商联系人", "code": "linkman", "width": "160", "type": "text"},
                {"name": "联系人电话", "code": "linkPhone", "width": "160", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "160", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "160", "type": "text"},
            ],
            loadParam: {
                isPurchase:'',
                // purchaseType:'',
                feeType:'',
                feeSubType:'',
                feeTypeData:[],
                projectName:'',
                tenantName:'',
                createDate:'',

                accrualCostTypeData:[],
                accrualCostType:'',
                accrualCostSubType:'',
            },
            whetherData:[],
            purchaseTypeData:[],
            feeTypeData:[],
            feeSubTypeData:[],
            props: { checkStrictly: true,value: 'codeValue',label: 'codeName' },
            treeData:[],
            uploadOpen:false,

            accrualCostTypeData:[],
            accrualCostSubTypeData:[],
            accrualCostTypeTreeData:[],

            codeTipData:[{codeValue:'1',codeName:'固定资产'},{codeValue:'2',codeName:'易耗品'},{codeValue:'3',codeName:'服务类'}],
            stsData:[],
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
        myImport,
        tableCommon,
        searchList,
    },
    /**
     * 绑定函数
     */
    methods: {
        async initStaticData() {
            this.whetherData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WHETHER"});
            this.purchaseTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PUR_PURCHASE_TYPE"});
            this.feeTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_TYPE"});
            this.feeSubTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PURCHASE_TYPE_SUB"});
            this.stsData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "STS"});
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

            this.accrualCostTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "ACCRUAL_COST_TYPE"});
            this.accrualCostSubTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "ACCRUAL_COST_SUB_TYPE"});
            this.accrualCostTypeTreeData = [];

            this.accrualCostTypeData.forEach(item => {
                let data = this.common.copyObj(item);
                let codeValue = data.codeValue;
                data.children = '';
                this.accrualCostSubTypeData.forEach(item2 => {
                    if (item2.codeId == codeValue) {
                        let data2 = this.common.copyObj(item2);
                        if(data.children == ''){
                            data.children = [];
                        }
                        data.children.push(data2);
                    }
                })
                this.accrualCostTypeTreeData.push(data);
            });
        },
        async doQuery(query = this.loadParam) {
            this.uploadOpen = false;
            this.loadParam = query;
            // console.log(query);
            if (this.common.isNotBlank(this.loadParam.createDate) && this.loadParam.createDate.length == 2) {
                this.loadParam.beginCreateDate = this.loadParam.createDate[0];
                this.loadParam.endCreateDate = this.loadParam.createDate[1];
            } else {
                this.loadParam.beginCreateDate = '';
                this.loadParam.endCreateDate = '';
            }
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

            let accrualCostTypeData = this.loadParam.accrualCostTypeData;
            if(this.common.isNotBlank(accrualCostTypeData) && accrualCostTypeData.length > 0) {
                this.loadParam.accrualCostType = accrualCostTypeData[0];
                if (accrualCostTypeData.length > 1) {
                    this.loadParam.accrualCostSubType = accrualCostTypeData[1];
                }else{
                    this.loadParam.accrualCostSubType = '';
                }
            }else{
                this.loadParam.accrualCostType = '';
                this.loadParam.accrualCostSubType = '';
            }


            let {items} = await this.$refs.table.load("purFeeBaseService", "queryPurFeePage", this.loadParam);
            items.forEach((el)=>{
                el.disabled = el.sts == 0;
            });
            this.$refs.table.resetData(items);
        },
        addItem() {
            this.open({
                query:{type: 1},
                urlId: 'addPurFee' + new Date().getTime(),
                urlName: '新增费用信息',
                urlPathName: '/addPurFee',
                urlPath: "/pt/purchase/feeInfo/purFeeInfo.vue",
            });
        },
        copyItem(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据复制！");
                return;
            }
            this.open({
                query:{id:selectData[0].id, type: 3},
                urlId: 'copyItem' + selectData[0].id + 1,
                urlName: '复制新增费用信息',
                urlPathName: '/copyItem',
                urlPath: "/pt/purchase/feeInfo/purFeeInfo.vue",
            });
        },
        updateItem(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据修改！");
                return;
            }
            this.open({
                query:{id:selectData[0].id, type: 2},
                urlId: 'updatePurFee' + selectData[0].id + 1,
                urlName: '修改费用信息',
                urlPathName: '/updatePurFee',
                urlPath: "/pt/purchase/feeInfo/purFeeInfo.vue",
            });
        },
        dblclickItem(item){
            this.open({
                query:{id:item.id,type:0},
                urlId: 'detailPurFee' + item.id + 0,
                urlName: '费用信息详情',
                urlPathName: '/detailPurFee',
                urlPath: "/pt/purchase/feeInfo/purFeeInfo.vue",
            });
        },
        toContract(item){
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
            this.open({
                urlName: title,
                urlId: 'contractDetail'+new Date().getTime(),
                urlPathName: "/contractDetail",
                urlPath: "/pt/cm/contract/contractDetail.vue",
                query: {type:3,contractType:item.contractType,id:item.contractId},
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
        deleteItem() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据删除！");
                return;
            }
            this.$confirm("是否确认启用/禁用该费用信息？", "提示").then(async () =>{
                let data = await this.common.postUrl("purFeeBaseService", "deletePurFeeById", {id:selectData[0].id},
                        null, null, '', true);
                this.$message.success(data);
                await this.doQuery();
            }).catch(() =>{
                //取消
            });
        },
        handleSuccess()
        {
            this.doQuery();
            this.uploadOpen = false;
        },
        importExcel()
        {
            this.uploadOpen = true;
        },
    },
    computed:{
        formData(){
            return [
                {"name":"费用类型","model":"feeTypeData","type":"cascader","options":this.treeData,"props":this.props,"placeholder":"费用类型","method":"doQuery","isshow":true},
                {"name":"费用类别","model":"codeTip","type":"select","options":this.codeTipData,"label":"codeName","value":"codeValue","placeholder":"费用类别","method":"doQuery","isshow":true},
                {"name":"成本类型","model":"accrualCostTypeData","type":"cascader","options":this.accrualCostTypeTreeData,"props":this.props,"placeholder":"成本类型","method":"doQuery","isshow":true},
                // {"name":"采购类型","model":"purchaseType","type":"select","options":this.purchaseTypeData,"label":"codeName","value":"codeValue","placeholder":"采购类型","method":"doQuery","isshow":true},
                {"name":"品名/项目","model":"projectName","type":"input","placeholder":"品名/项目","isshow":true},
                {"name":"供应商名称","model":"tenantName","type":"input","placeholder":"供应商名称","isshow":true},
                {"name":"创建时间","model":"createDate","type":"daterange","isshow":true},
                {"name":"启用/禁用","model":"sts","type":"select","options":this.stsData,"label":"codeName","value":"codeValue","placeholder":"启用/禁用","method":"doQuery","isshow":true},
            ]
        }
    },
}
