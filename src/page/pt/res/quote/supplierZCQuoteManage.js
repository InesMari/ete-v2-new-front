import tableCommon from "@/components/table/tableCommon.vue";
import myImport from "@/components/myImport/myImport";
import enumData from "@/page/pt/enum";
import searchList from "@/components/searchList/searchList.vue";


export default {
    name: 'supplierZCQuoteManage',
    data()
    {
        return {
            head: [
                {"name": "报价单号", "code": "quoteNum", "width": "180", "type": "text"},
                {"name": "供应商名称", "code": "tenantName", "width": "250", "type": "text"},
                {"name": "起始地", "code": "beginIndexSearchStr", "width": "150", "type": "text"},
                {"name": "目的地", "code": "endIndexSearchStr", "width": "150", "type": "text"},
                {"name": "中途点个数", "code": "midwayPointCount", "width": "100", "type": "text"},
                {"name": "指定客户", "code": "specifyTenantName", "width": "250", "type": "text"},
                {"name": "运输时效", "code": "transportTimeliness", "width": "110", "type": "text"},
                {"name": "生效时间", "code": "effectDate", "width": "110", "type": "text"},
                {"name": "失效时间", "code": "expireDate", "width": "110", "type": "text"},
                {"name": "审核状态", "code": "verifyStateName", "width": "90", "type": "text"},
                {"name": "审核时间", "code": "verifyDate", "width": "130", "type": "text"},
                {"name": "审核人", "code": "verifyUserName", "width": "110", "type": "text"},
                {"name": "申请人", "code": "applyUserName", "width": "150", "type": "text"},
                {"name": "申请部门", "code": "applyOrgName", "width": "200", "type": "text"},
                {"name": "合同编号", "code": "contractNum", "width": "150", "type": "diy"},
            ],
            query: this.initQuery(this.$route.query.supplierId, this.$route.query.quoteNum),//查询条件
            vehicleLengthData: [],//报价车长
            quoteVehicleTypeData: [],//报价车型
            verifyStateData: [],//审核状态
            validStateData:[],//生失效状态
            quoteData: this.initQuoteData(),//报价数据
            quoteDetailData: [],//报价明细数据
            showUploadPage: false,
            param:
            {
                quoteType: enumData.quoteType.SUPLIER,
                quoteSubType: enumData.quoteSubType.VEHICLE_ONE_WAY_QUOTE
            },
            showTableDetail:false,
            supplierData:[],
            modifyShow:false,
            modifyInfo:{}
        }
    },
    computed:{
        formData(){
            return [
                {"name":"报价单号","model":"quoteNum","type":"input","isshow":true},
                {"name":"合同编号","model":"contractNum","type":"input","isshow":true},
                {"name":"供应商名称","model":"tenantId","type":"select","options":this.supplierData, "label":"supplierName","value":"tenantId","method":"doQuery","isshow":true},
                {"name":"作业点","model":"workName","type":"input","isshow":true, "if": true},
                {"name":"起始地","model":"beginIndexSearchStr","type":"input","isshow":true, "if": true},
                {"name":"目的地","model":"endIndexSearchStr","type":"input","isshow":true, "if": true},
                {"name":"报价车型","model":"quoteVehicleType","type":"select","options":this.quoteVehicleTypeData, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true, "if": true, "multiple": true},
                {"name":"车长","model":"vehicleLength","type":"select","options":this.vehicleLengthData, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true, "if": true, "multiple": true},
                {"name":"审核状态","model":"verifyState","type":"select","options":this.verifyStateData, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                {"name":"生失效状态","model":"validState","type":"select","options":this.validStateData, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
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
        this.doQuery();
        this.init();
    },
    /**
     * 组件
     */
    components:
    {
        tableCommon,
        myImport,
        searchList,
    },
    /**
     * 绑定函数
     */
    methods:
    {
        initQuery(tenantId, quoteNum)
        {
            return this.query = {
                quoteNum: quoteNum,
                tenantId: this.common.isBlank(tenantId) ? '' : Number(tenantId),
                tenantName: '',
                workName: '',
                beginIndexSearchStr: '',
                endIndexSearchStr: '',
                quoteVehicleType: null,
                vehicleLength: null,
                verifyState: null,
                validState:null,
                quoteType: enumData.quoteType.SUPLIER,
                quoteSubType: enumData.quoteSubType.VEHICLE_ONE_WAY_QUOTE,
                applyUserName:null,
                applyOrgName:null,
            };
        },
        initQuoteData()
        {
            return this.quoteData = {
                quoteNum: '',
                tenantName: '',
                routeName: '',
                createUserName: '',
                createDate: null,
            };
        },
        async init()
        {
            this.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
            this.quoteVehicleTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VEHICLE_TYPE_QUOTE"});
            this.vehicleLengthData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VEHICLE_LENGTH"});
            this.verifyStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VERIFY_STATE"});
            this.validStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VALID_STATE"});
            if (this.isVerify) this.verifyStateData.splice(1, 1);
        },
        async doQuery(query=this.query)
        {
            query.todo = this.$route.query.todo;
            query.quoteType = enumData.quoteType.SUPLIER;
            query.quoteSubType = enumData.quoteSubType.VEHICLE_ONE_WAY_QUOTE;
            this.query = query;
            let {items} = await this.$refs.table.load("ZCQuoteNewTF", "queryQuote", query);
            items.forEach((el)=>{
                if(el.validState != 1){
                    el.disabled = true;
                }
            });
            this.$refs.table.resetData(items);
            this.$forceUpdate();
        },
        changeRowsCallback(data){
            data.forEach((el)=>{
                if(el.validState != 1){
                    el.disabled = true;
                }
            });
            this.$refs.table.resetData(data);
            this.$forceUpdate();
        },
        async clickItem(data)
        {
            this.showTableDetail = data.isSelect?true:false;
            this.quoteData = await this.common.postUrl("ZCQuoteNewTF", "loadQuoteDataByQuoteId", {quoteId: data.quoteId});
            this.quoteDetailData = this.quoteData.quoteList;
            this.common.tableStretch(this.$refs.quoteDetail);
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
        addZCQuote()
        {
            this.$emit("openTab",{
                urlId: 'addSupplierZCQuote' + new Date().getTime(),
                query: {supplierId: this.$route.query.supplierId},
                urlName: "新增供应商整车报价",
                urlPathName: "/quote",
                urlPath: "/pt/res/quote/addSupplierZCQuote.vue"});
        },
        copyZCQuote()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要复制的报价！");
                return false;
            }
            let data = this.common.copyObj(selectData[0]);
            this.$emit("openTab",{
                urlId: 'copySupplierZCQuote' + data.quoteId,
                query: {srcQuoteId: data.quoteId,supplierId: this.$route.query.supplierId},
                urlName: "复制新增供应商整车报价",
                urlPathName: "/quote",
                urlPath: "/pt/res/quote/addSupplierZCQuote.vue"});
        },
        updateZCQuote()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要修改的报价！");
                return false;
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
            //判断状态，如果已经失效不能修改
            this.$emit("openTab",{
                urlId: 'updateSupplierZCQuote' + data.quoteId,
                query: {quoteId: data.quoteId,unShowCheck: 1,modifyType},
                urlName: "修改供应商整车报价",
                urlPathName: "/quote",
                urlPath: "/pt/res/quote/updateSupplierZCQuote.vue"});
        },
        deleteZCQuote()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的报价！");
                return false;
            }

            if(selectData[0].verifyState==1){
                this.$message.error("审核通过不能删除！");
                return false;
            }
            selectData[0].quoteType=enumData.quoteType.SUPLIER;
            let that = this;
            that.$confirm("确认需要取消报价？", "提示").then(() =>{
                that.common.postUrl("ZCQuoteNewTF", "deleteQuoteByQuoteId", selectData[0], function (data)
                {
                    that.quoteDetailData = [];
                    that.initQuoteData();
                    that.doQuery();
                    that.$message.success("删除成功！");
                });
            }).catch(() =>{});
        },
        showUpload(flag)
        {
            this.showUploadPage = flag;
        },
        upload()
        {
            this.$refs.myImport.submitFileForm();
        },
        async uploadSuccess()
        {
            await this.doQuery();
            this.showUpload(false);
            this.$message.success("报价导入成功！");
        },
        open(item){
            let title = "查看供应商-仓储运作合同";
            this.$emit('openTab', {
                urlName: title,
                urlId: 'contractDetail'+new Date().getTime(),
                urlPathName: "/contractDetail",
                urlPath: "/pt/cm/contract/contractDetail.vue",
                query: {type:3,contractType:3,id:item.contractId},
            });
        },
        exportData()
        {
            let excelLables = "报价单号,供应商名称,报价级别,起始地,中途点1,中途点2,目的地,指定客户,运输时效,合同编号,计费方式,报价车型,车长,货物,单程运费单价,点位费单价,生效时间,失效时间";
            let excelKeys = "quoteNum,tenantName,quoteLevelName,beginIndexSearchStr,midwayPoint1IndexSearchStr,midwayPoint2IndexSearchStr,endIndexSearchStr," +
                    "specifyTenantName,transportTimeliness,contractNum,billingTypeName,quoteVehicleTypeName,vehicleLengthName,goodsIdName,feePrice,pointFee,effectDate,expireDate";
            let selectData = this.common.copyObj(this.query);
            this.common.downloadExcelFile("ZCQuoteNewTF|exportSupplierZCQuoteData", selectData, excelLables, excelKeys);
        },
        showModify(flag) {
            if(flag){
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length <= 0)
                {
                    this.$message.error("请至少选择一条需要修改失效日期的报价！");
                    return false;
                }
                let ids = [];
                for (let i = 0; i < selectData.length; i++) {
                    ids.push(selectData[i].quoteId);
                }
                this.modifyInfo.ids = ids;
            }else{
                this.modifyInfo = {};
            }
            this.modifyShow = flag;
        },
        sureModify(){
            let that = this;
            this.common.postUrl("ZCQuoteNewTF", "updateQuoteExpireDate", this.modifyInfo, function (data)
            {
                that.doQuery();
                that.$message.success("修改成功！");
                that.showModify(false);
            });
        }
    },
}
