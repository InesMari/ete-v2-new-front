import tableCommon from "@/components/table/tableCommon.vue";
import myImport from "@/components/myImport/myImport";
import enumData from "@/page/pt/enum";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'supplierWMSQuoteManage',
    data()
    {
        return {
            head: [
                {"name": "报价单号", "code": "quoteNum", "width": "180", "type": "text"},
                {"name": "供应商名称", "code": "tenantName", "width": "250", "type": "text"},
                {"name": "起始地", "code": "beginIndexSearchStr", "width": "150", "type": "text"},
                {"name": "目的地", "code": "endIndexSearchStr", "width": "150", "type": "text"},
                {"name": "生效时间", "code": "effectDate", "width": "110", "type": "text"},
                {"name": "失效时间", "code": "expireDate", "width": "110", "type": "text"},
                {"name": "生失效状态", "code": "validStateName", "width": "110", "type": "text"},
                {"name": "审核状态", "code": "verifyStateName", "width": "90", "type": "text"},
                {"name": "审核时间", "code": "verifyDate", "width": "150", "type": "text"},
                {"name": "审核人", "code": "verifyUserName", "width": "110", "type": "text"},
                {"name": "备注", "code": "remark", "width": "150", "type": "text"}
            ],
            query: this.initQuery(this.$route.query.quoteNum),//查询条件
            vehicleLengthData: [],//报价车长
            quoteVehicleTypeData: [],//报价车型
            verifyStateData: [],//审核状态
            validStateData:[],//生失效状态
            supplierData:[],
            quoteData: this.initQuoteData(),//报价数据
            quoteDetailData: [],//报价明细数据
            showUploadPage: false,
            showTableDetail:false,
            uploadParam:
            {
                quoteType: enumData.quoteType.SUPLIER,
                quoteSubType: enumData.quoteSubType.WMS_QUOTE
            },

        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.init();
        this.doQuery();//table 分页进来走这里
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
        initQuery(quoteNum)
        {
            return this.query = {
                quoteNum: quoteNum,
                tenantId: this.common.isBlank(this.$route.query.supplierId) ? '' : Number(this.$route.query.supplierId),
                tenantName: '',
                beginIndexSearchStr: '',
                endIndexSearchStr: '',
                quoteVehicleType: null,
                vehicleLength: null,
                verifyState: null,
                validState:null,
                quoteType: enumData.quoteType.SUPLIER,
                quoteSubType: enumData.quoteSubType.WMS_QUOTE,
            };
        },
        /**
         * 初始化单击点开明细界面展示数据
         * @returns {{quoteNum: string, tenantName: string, createUserName: string, routeName: string, createDate: null}}
         */
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
        },
        async doQuery(query=this.query)
        {
            query.todo = this.$route.query.todo;
            query.quoteType = enumData.quoteType.SUPLIER;
            query.quoteSubType = enumData.quoteSubType.WMS_QUOTE;
            this.query = query;
            let {items} = await this.$refs.table.load("quoteService", "queryWmsQuotePage", query);
            items.forEach((el)=>{
                if(el.validState != 1){
                    el.disabled = true;
                }
            });
            this.$refs.table.resetData(items);
            this.$forceUpdate();
        },
        async clickItem(data)
        {
            this.quoteData = await this.common.postUrl("quoteService", "loadWmsQuoteDataByQuoteId", {quoteId: data.quoteId});
            this.quoteDetailData = this.quoteData.quoteList;
            this.common.tableStretch(this.$refs.quoteDetail);
            this.showTableDetail = data.isSelect ? true : false;
        },
        addWMSQuote()
        {
            this.$emit("openTab",{
                urlId: 'addSupplierWMSQuote' + new Date().getTime(),
                query: {supplierId: this.$route.query.supplierId},
                urlName: "新增供应商仓配报价",
                urlPathName: "/quote",
                urlPath: "/pt/res/quote/addSupplierWMSQuote.vue"});
        },
        updateWMSQuote()
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
                urlId: 'updateSupplierWMSQuote' + data.quoteId,
                query: {quoteId: data.quoteId,modifyType},
                urlName: "修改供应商仓配报价",
                urlPathName: "/quote",
                urlPath: "/pt/res/quote/addSupplierWMSQuote.vue"});
        },
        copyWMSQuote()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要复制的报价！");
                return false;
            }
            let data = this.common.copyObj(selectData[0]);
            this.$emit("openTab",{
                urlId: 'copySupplierWMSQuote' + data.quoteId,
                query: {quoteId: data.quoteId,isCopy: 1},
                urlName: "复制新增供应商仓配报价",
                urlPathName: "/quote",
                urlPath: "/pt/res/quote/addSupplierWMSQuote.vue"});
        },
        deleteWMSQuote()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的报价！");
                return false;
            }
            if(selectData[0].verifyState==1){
                this.$message.error("审核通过报价不能删除！");
                return false;
            }
            selectData[0].quoteType=enumData.quoteType.SUPLIER;
            let that = this;
            that.$confirm("确认需要取消报价？", "提示").then(() =>{
                that.common.postUrl("quoteService", "deleteWmsQuoteByQuoteId", selectData[0], function (data)
                {
                    that.doQuery();
                    that.showTableDetail = false;
                    that.$message.success("删除成功！");
                });
            }).catch(() =>{});
        },
        async verifyQuote()
        {
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length !== 1)
            {
                this.$message.error("请选择一个需要审核的报价！");
                return false;
            }
            let data = selectData[0];
            if (data.verifyState == enumData.verifyState.approved)
            {
                this.$message.error("已经审核通过的报价,不允许操作操作！");
                return false;
            }
            if (data.verifyState == enumData.verifyState.noApproved)
            {
                this.$message.error("已经审核不通过的报价,不允许操作！");
                return false;
            }
            let param = this.common.copyObj(data);
            this.$confirm("您正在操作审核确认，是否继续?", "提示",{
                confirmButtonText: '通过',
                cancelButtonText: '不通过',
                type: 'warning',
                center: true,
                // showInput: true,
                closeOnClickModal: false,
                distinguishCancelAndClose: true,
            }).then(async () =>{
                param.verifyState = true;
                await this.common.postUrl("quoteService", "verifyWmsQuote", param, null, null, '', true);
                this.$message.success("审核通过！");
                this.showTableDetail = false;
                await this.doQuery();
                this.$parent.loadTodoData();

            }).catch(async action =>{
                if ( action === 'cancel')
                {
                    param.verifyState = false;
                    await this.common.postUrl("quoteService", "verifyWmsQuote", param, null, null, '', true);
                    this.$message.success("审核不通过！");
                    this.showTableDetail = false;
                    await this.doQuery();
                    this.$parent.loadTodoData();
                }
            });
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
        // exportData()
        // {
        //     let excelLables = "报价单号,供应商名称,报价级别,起始地,中途点1,中途点2,目的地,指定客户,运输时效,计费方式,报价车型,车长,货物,单程运费单价,点位费单价,生效时间,失效时间";
        //     let excelKeys = "quoteNum,tenantName,quoteLevelName,beginIndexSearchStr,midwayPoint1IndexSearchStr,midwayPoint2IndexSearchStr,endIndexSearchStr," +
        //             "specifyTenantName,transportTimeliness,billingTypeName,quoteVehicleTypeName,vehicleLengthName,goodsIdName,feePrice,pointFee,effectDate,expireDate";
        //     let selectData = this.common.copyObj(this.query);
        //     this.common.downloadExcelFile("quoteService|exportSupplierWMSQuoteData", selectData, excelLables, excelKeys);
        // },
    },
    computed:{
        formData(){
            return [
                {"name":"报价单号","model":"quoteNum","type":"input","isshow":true},
                {"name":"供应商名称","model":"tenantId","type":"select","options":this.supplierData, "label":"supplierName","value":"tenantId","method":"doQuery","isshow":true},
                {"name":"起始地","model":"beginIndexSearchStr","type":"input","isshow":true, "if": true},
                {"name":"目的地","model":"endIndexSearchStr","type":"input","isshow":true, "if": true},
                {"name":"报价车型","model":"quoteVehicleType","type":"select","options":this.quoteVehicleTypeData, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true, "if": true, "multiple": true},
                {"name":"车长","model":"vehicleLength","type":"select","options":this.vehicleLengthData, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true, "if": true, "multiple": true},
                {"name":"审核状态","model":"verifyState","type":"select","options":this.verifyStateData, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                {"name":"生失效状态","model":"validState","type":"select","options":this.validStateData, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
            ]
        }
    },
}
