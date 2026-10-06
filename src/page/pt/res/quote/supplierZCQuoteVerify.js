import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum";
import searchList from "@/components/searchList/searchList.vue";


export default {
    name: 'supplierZCQuoteVerify',
    data()
    {
        return {
            head: [
                {"name": "报价单号", "code": "quoteNum", "width": "180", "type": "text"},
                {"name": "供应商名称", "code": "tenantName", "width": "250", "type": "text"},
                {"name": "起始地", "code": "beginIndexSearchStr", "width": "150", "type": "text"},
                {"name": "目的地", "code": "endIndexSearchStr", "width": "150", "type": "text"},
                {"name": "中途点个数", "code": "midwayPointCount", "width": "100", "type": "text"},
                {"name": "指定客户", "code": "specifyTenantName", "width": "110", "type": "text"},
                {"name": "运输时效", "code": "transportTimeliness", "width": "110", "type": "text"},
                {"name": "生效时间", "code": "effectDate", "width": "110", "type": "text"},
                {"name": "失效时间", "code": "expireDate", "width": "110", "type": "text"},
                {"name": "审核状态", "code": "verifyStateName", "width": "90", "type": "text"},
                {"name": "审核时间", "code": "verifyDate", "width": "110", "type": "text"},
                {"name": "审核人", "code": "verifyUserName", "width": "110", "type": "text"},
                {"name": "申请人", "code": "applyUserName", "width": "150", "type": "text"},
                {"name": "申请部门", "code": "applyOrgName", "width": "200", "type": "text"},
            ],
            query: this.initQuery(this.$route.query.supplierId),//查询条件
            vehicleLengthData: [],//报价车长
            quoteVehicleTypeData: [],//报价车型
            verifyStateData: [],//审核状态
            quoteData: {},//报价数据
            quoteDetailData: [],//报价明细数据
            showUploadPage: false,
            param:
            {
                quoteType: enumData.quoteType.SUPLIER,
                quoteSubType: enumData.quoteSubType.VEHICLE_ONE_WAY_QUOTE
            },
            showTableDetail:false,
            supplierData:[],
        }
    },
    computed:{
        formData(){
            return [
                {"name":"报价单号","model":"quoteNum","type":"input","isshow":true},
                {"name":"供应商名称","model":"tenantId","type":"select","options":this.supplierData, "label":"supplierName","value":"tenantId","method":"doQuery","isshow":true},
                {"name":"审核状态","model":"verifyState","type":"select","options":this.verifyStateData, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                {"name":"申请人","model":"applyUserName","type":"input","placeholder":"申请人","isshow":true},
                {"name":"申请部门","model":"applyOrgName","type":"input","placeholder":"申请部门","isshow":true},
            ]
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.query.verifyState=this.$route.query.verifyState;
        this.doQuery(that.query);
        this.init();
    },
    /**
     * 组件
     */
    components:
    {
        tableCommon,
        searchList,
    },
    /**
     * 绑定函数
     */
    methods:
    {
        clearQuery(param)
        {
            this.initQuery();
        },
        initQuery(tenantId)
        {
            return this.query = {
                quoteNum: this.$route.query.quoteNum,
                tenantId: this.common.isBlank(tenantId) ? '' : Number(tenantId),
                tenantName: '',
                workName: '',
                beginIndexSearchStr: '',
                endIndexSearchStr: '',
                quoteVehicleType: null,
                vehicleLength: null,
                verifyState: '',
                quoteType: enumData.quoteType.SUPLIER,
                quoteSubType: enumData.quoteSubType.VEHICLE_ONE_WAY_QUOTE,
                applyUserName:null,
                applyOrgName:null,
            };
        },
        async init()
        {
            this.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
            this.quoteVehicleTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VEHICLE_TYPE_QUOTE"});
            this.vehicleLengthData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VEHICLE_LENGTH"});
            this.verifyStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VERIFY_STATE"});
            this.verifyStateData.splice(1, 1);
            this.query.verifyState='0';
        },
        doQuery(query=this.query)
        {
            query.todo = 1;
            query.quoteType = enumData.quoteType.SUPLIER;
            query.quoteSubType = enumData.quoteSubType.VEHICLE_ONE_WAY_QUOTE;
            this.query = query;
            this.$refs.table.load("ZCQuoteNewTF", "queryQuote", query);
        },
        async clickItem(data)
        {
            this.showTableDetail = data.isSelect?true:false;
            this.quoteData = await this.common.postUrl("ZCQuoteNewTF", "loadQuoteDataByQuoteId", {quoteId: data.quoteId});
            this.quoteDetailData = this.quoteData.quoteList;
        },
        dblclickItem(data){
            this.$emit("openTab",{
                urlId: 'supplierZCQuoteDetailMain' + data.quoteId,
                query: {
                    quoteId:data.quoteId,
                    logId: data.quoteId,
                    logType: enumData.LOG_TYPE.QUOTE,
                },
                urlName: "查看报价详情",
                urlPathName: "/supplier",
                urlPath: "/pt/res/quote/supplierZCQuoteDetailMain.vue"});
        },
        async verifyQuote(flag)
        {
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length !== 1)
            {
                this.$message.error("请选择一个需要审核的报价！");
                return false;
            }
            let data = selectData[0];
            let tip = "审核通过";
            if (flag)
            {
                if (data.verifyState == enumData.verifyState.approved)
                {
                    this.$message.error("已经审核通过的报价,请勿重复操作！");
                    return false;
                }
                if (data.verifyState == enumData.verifyState.noApproved)
                {
                    this.$message.error("已经审核不通过的报价,不允许操作！");
                    return false;
                }
            }
            else
            {
                if (data.verifyState == enumData.verifyState.noApproved)
                {
                    this.$message.error("已经审核不通过的报价,请勿重复操作！");
                    return false;
                }
                if (data.verifyState == enumData.verifyState.approved)
                {
                    this.$message.error("已经审核通过的报价,不允许操作操作！");
                    return false;
                }
                tip = "审核不通过";
            }
            let param = this.common.copyObj(data);
            param.verifyState=flag;
            param.quoteType=enumData.quoteType.SUPLIER;
            this.$confirm("是否确认" + tip +"？", "提示").then(async () =>{
                await this.common.postUrl("ZCQuoteNewTF", "verifyQuote", param, null, null, '', true);
                this.$message.success(tip + "成功！");
                await this.doQuery();
                this.$parent.loadTodoData();
            }).catch(() =>{
                //取消
            });
        }
    },
}
