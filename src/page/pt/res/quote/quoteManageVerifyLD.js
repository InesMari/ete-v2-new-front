import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";

export default {
    name: 'quoteManageVerifyLD',
    data() {
        return {
            head: [
                {"name": "报价单号", "code": "quoteNum", "width": "110", "type": "text"},
                {"name": "供应商名称", "code": "supplierName", "width": "110", "type": "text"},
                {"name": "起始点", "code": "beginIndexSearchStr", "width": "110", "type": "text"},
                {"name": "目的地", "code": "endIndexSearchStr", "width": "110", "type": "text"},
                {"name": "指定客户", "code": "specifyTenantName", "width": "110", "type": "text"},
                {"name": "运输时效", "code": "transportTimeliness", "width": "110", "type": "text"},
                {"name": "生效时间", "code": "effectDate", "width": "110", "type": "text"},
                {"name": "失效时间", "code": "expireDate", "width": "110", "type": "text"},
                {"name": "状态", "code": "verifyStateName", "width": "110", "type": "text"},
                {"name": "审核时间", "code": "verifyDate", "width": "110", "type": "text"},
                {"name": "审核人", "code": "verifyUserName", "width": "110", "type": "text"}
            ],
            loadParam: {isVerify:1, quoteNum: this.$route.query.quoteNum,verifyState:'0'},
            verifyStateData: [],//状态
            quoteData: {},//报价明细数据
            quoteFeeData: [],//报价费用明细数据
            supplierData:[],//供应商数组
            showTableDetail:false,
        }
    },
    computed:{
        formData(){
            return [
                {"name":"报价单号","model":"quoteNum","type":"input","isshow":true},
                {"name":"供应商名称","model":"tenantId","type":"select","options":this.supplierData, "label":"supplierName","value":"tenantId","method":"doQuery","isshow":true},
                {"name":"审核状态","model":"verifyState","type":"select","options":this.verifyStateData, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
            ]
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.doQuery();
        this.init();
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
        async doQuery(loadParam = this.loadParam) {
            loadParam.isVerify = 1;
            loadParam.quoteType = 2;
            await this.$refs.table.load("quoteLDNewTF", "queryLDQuoteData", loadParam);
        },
        init() {
            let that = this;
            //供应商
            this.common.postUrl("supplierTF", "queryAllSupplierList", {supplierType:2}, function (data) {
                that.supplierData = data;
            });
            //审核状态
            that.common.postUrl("commonTF", "getSysStaticData", {codeType: "VERIFY_STATE"}, function (data)
            {
                for (let i = 0; i < data.length; i++) {
                    if(data[i].codeValue=='1'){
                        data.splice(i,1);
                        break;
                    }
                }
                that.verifyStateData = data;
            })
        },
        clear() {
            this.loadParam = {};
        },
        /** 审核 1审核通过 2审核不通过 */
        verify(state) {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据！");
                return;
            }
            if(selectData[0].verifyState==state){
                let mess = state == 1 ? "审核通过" : "审核不通过";
                this.$message.error("该报价信息已是"+mess+"状态！");
                return;
            }
            let param = this.common.copyObj(selectData[0]);
            param.sectionId=selectData[0].id;
            param.verifyState=state;
            param.quoteType=enumData.quoteType.SUPLIER;
            let tip = state == 1 ? "审核通过" : "审核不通过";
            let that = this;
            this.$confirm("是否确认" + tip +"？", "提示").then(async () =>{
                this.common.postUrl("quoteLDNewTF","verifyQuote", param, function (data)
                {
                    that.$message.success("审核成功！");
                    that.doQuery();
                    that.$parent.loadTodoData();
                },null,'',true);
            }).catch(() =>{
                //取消
            });
        },
        /** 列表单击行事件 */
        clickItem(data) {
            this.showTableDetail = data.isSelect?true:false;
            if(this.common.isNotBlank(data.detailList)) {
                this.quoteData = data;
                this.quoteFeeData = data.detailList;
            }
        },
        dblclickItem(data){
            this.$emit("openTab",{
                urlId: 'supplierQuoteLDDetailMain' + data.id,
                query: {
                    data,
                    logId: data.id,
                    logType: enumData.LOG_TYPE.QUOTE,},
                urlName: "查看报价详情",
                urlPathName: "/quote",
                urlPath: "/pt/res/quote/supplierQuoteLDDetailMain.vue"});
        },
    },
}
