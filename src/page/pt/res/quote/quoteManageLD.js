import tableCommon from "@/components/table/tableCommon.vue";
import myImport from "@/components/myImport/myImport";
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";


export default {
    name: 'quoteManageLD',
    data() {
        return {
            head: [
                {"name": "报价单号", "code": "quoteNum", "width": "110", "type": "text"},
                {"name": "供应商名称", "code": "supplierName", "width": "250", "type": "text"},
                {"name": "起始点", "code": "beginIndexSearchStr", "width": "300", "type": "text"},
                {"name": "目的地", "code": "endIndexSearchStr", "width": "300", "type": "text"},
                {"name": "指定客户", "code": "specifyTenantName", "width": "110", "type": "text"},
                {"name": "运输时效", "code": "transportTimeliness", "width": "110", "type": "text"},
                {"name": "生效时间", "code": "effectDate", "width": "110", "type": "text"},
                {"name": "失效时间", "code": "expireDate", "width": "110", "type": "text"},
                {"name": "状态", "code": "verifyStateName", "width": "110", "type": "text"},
                {"name": "审核时间", "code": "verifyDate", "width": "130", "type": "text"},
                {"name": "审核人", "code": "verifyUserName", "width": "110", "type": "text"}
            ],
            loadParam: {quoteNum: this.$route.query.quoteNum},
            impParam: {},//导入参数
            verifyStateData: [],//状态
            quoteData: {},//报价明细数据
            quoteFeeData: [],//报价费用明细数据
            supplierData:[],//供应商数组
            validStateData:[],//生失效状态
            uploadOpen : false,
            showTableDetail:false,
        }
    },
    computed:{
            formData()
            {
                return [
                    {"name":"报价单号","model":"quoteNum","type":"input","isshow":true},
                    {"name":"供应商名称","model":"tenantId","type":"select","options":this.supplierData, "label":"supplierName","value":"tenantId","method":"doQuery","isshow":true},
                    {"name":"起始地","model":"beginAddress","type":"input","isshow":true},
                    {"name":"目的地","model":"endAddress","type":"input","isshow":true},
                    {"name":"审核状态","model":"verifyState","type":"select","options":this.verifyStateData, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                    {"name":"生失效状态","model":"validState","type":"select","options":this.validStateData, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
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
        myImport,
        searchList,
    },
    /**
     * 绑定函数
     */
    methods: {
        async doQuery(loadParam = this.loadParam) {
            loadParam.quoteType = 2;
            this.loadParam = loadParam;
            let {items} = await this.$refs.table.load("quoteLDNewTF", "queryLDQuoteData", loadParam);
            items.forEach((el)=>{
                if(el.validState != 1){
                    el.disabled = true;
                }
            });
            this.$refs.table.resetData(items);
            this.$forceUpdate();
        },
        async init() {
            let that = this;
            //供应商
            that.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
            if(that.common.isNotBlank(that.$route.query.supplierId)){
                that.supplierData.forEach(item => {
                    if(that.$route.query.supplierId == item.tenantId){
                        that.loadParam.tenantId = Number(that.$route.query.supplierId);
                        return;
                    }
                });
            }
            //审核状态
            that.common.postUrl("commonTF", "getSysStaticData", {codeType: "VERIFY_STATE"}, function (data)
            {
                that.verifyStateData = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VALID_STATE"}, function (data){
                that.validStateData = data;
            });
        },
        clear() {
            this.loadParam = {};
        },
        /** 删除报价信息 */
        del() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length == 0) {
                this.$message.error("请选择需要删除的数据！");
                return;
            }
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的报价！");
                return false;
            }
            selectData[0].quoteType=enumData.quoteType.SUPLIER;
            let ids = "";
            let names = "";
            let bo = false;
            for (let i = 0; i < selectData.length; i++) {
                ids += selectData[i].id + ",";
                names += selectData[i].indexSearchStr + ",";
                if(selectData[i].id==this.quoteData.id){
                    bo = true;
                }
                if(selectData[i].verifyState==1){
                    this.$message.error("审核通过不能删除！");
                    return false;
                }
            }
            ids = ids.substring(0, ids.length - 1);
            names = names.substring(0, names.length - 1);
            let that = this;
            const h = this.$createElement;
            this.$msgbox({
                title: "删除供应商零担报价",
                message: h('p', null, [
                    h('span', null, "此操作将供应商零担报价："),
                    h('i', { style: 'color: red' }, names),
                    h('span', null, " 删除，是否继续？"),
                ]),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: "warning",
            }).then(() => {
                this.common.postUrl("quoteLDNewTF", "delQuoteInfo", selectData[0], function (data) {
                    if (that.common.isNotBlank(data)) {
                        that.doQuery();
                        that.$message.success("删除成功！");
                        if(bo){
                            that.quoteData = {};
                            that.quoteFeeData = [];
                        }
                    }
                });
            }).catch(() => {
                this.$message.info("已取消删除");
            });
        },
        /** 跳转新增报价页面 */
        add() {
            let item = {
                urlName: "新增供应商零担报价",
                urlId: new Date().getTime(),
                urlPath: "/pt/res/quote/addQuoteInfoLD.vue",
                query:{supplierId:this.$route.query.supplierId},
            }
            this.$emit('openTab', item);
        },
        copy(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据！");
                return;
            }
            let item = {
                urlName: "复制新增供应商零担报价",
                urlId: new Date().getTime(),
                urlPath: "/pt/res/quote/addQuoteInfoLD.vue",
                query:{sectionId: selectData[0].id,supplierId:this.$route.query.supplierId},
            }
            this.$emit('openTab', item);
        },
        /** 跳转修改报价页面 */
        modify() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据！");
                return;
            }
            let data = this.common.copyObj(selectData[0]);
            let modifyType = 1;
            if(data.validState==2||data.verifyState==0){
                //未生效或者未审核
                modifyType = 1;
            }else if(data.validState==1&&data.verifyState==1){
                //生效中
                modifyType = 2;
            }else if(data.validState==3){
                //失效
                this.$message.error("该报价已经失效，不能修改！");
                return false;
            }
            let item = {
                urlName: "修改供应商零担报价",
                urlId: new Date().getTime(),
                urlPath: "/pt/res/quote/upQuoteInfoLD.vue",
                query:{sectionId:selectData[0].id,unShowCheck: 1,modifyType},
            }
            this.$emit('openTab', item);
        },
        /** 列表单击行事件 */
        clickItem(data) {
            this.showTableDetail = data.isSelect?true:false;
            if(this.common.isNotBlank(data.detailList)) {
                this.quoteData = data;
                this.quoteFeeData = data.detailList;
            }
            this.common.tableStretch(this.$refs.quoteDetail);
        },
        dblclickItem(data){
            this.$emit("openTab",{
                urlId: 'supplierQuoteLDDetailMain' + data.id,
                query: {
                    data,
                    logId: data.id,
                    logType: enumData.LOG_TYPE.QUOTE,
                },
                urlName: "查看报价详情",
                urlPathName: "/quote",
                urlPath: "/pt/res/quote/supplierQuoteLDDetailMain.vue"});
        },
        /** 导出 */
        download() {
            // this.$refs.table.downloadExcelFile();
            var excelLables = "报价单号,供应商名称,报价方式,起始地,目的地,指定客户,运输时效,费用类型,区间,区间单位,计费方式,货物,费用,生效时间,失效时间";
            var excelKeys = "quoteNum,supplierName,quoteLevelName,beginIndexSearchStr,endIndexSearchStr,specifyTenantName," +
                "transportTimeliness,feeTypeName,rangeStr,rangeUnitName,billingTypeName,goodsNames,fee,effectDate,expireDate";
            var selectData = this.common.copyObj(this.loadParam);
            selectData.isDownload = 1;
            // for (const idx in selectData) {
            //     delete selectData[idx].loadingplanName;
            // }
            // var param = {excelLables:excelLables,excelKeys:excelKeys,selectData:selectData};
            this.common.downloadExcelFile("quoteLDNewTF|downloadLDQuoteData",selectData,excelLables,excelKeys);
        },
    },
}
