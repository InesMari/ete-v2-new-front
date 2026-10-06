import tableCommon from "@/components/table/tableCommon.vue";
import myImport from "@/components/myImport/myImport";
import enumData from "@/page/pt/enum";
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'customerZCQuoteManage',
    data()
    {
        return {
            head: [
                {"name": "报价单号", "code": "quoteNum", "width": "180", "type": "text"},
                {"name": "客户名称", "code": "tenantName", "width": "300", "type": "text"},
                {"name": "起始地", "code": "beginIndexSearchStr", "width": "150", "type": "text"},
                {"name": "目的地", "code": "endIndexSearchStr", "width": "150", "type": "text"},
                {"name": "中途点个数", "code": "midwayPointCount", "width": "100", "type": "text"},
                {"name": "生效时间", "code": "effectDate", "width": "110", "type": "text"},
                {"name": "失效时间", "code": "expireDate", "width": "110", "type": "text"},
                {"name": "生失效状态", "code": "validStateName", "width": "90", "type": "text"},
                {"name": "审核状态", "code": "verifyStateName", "width": "90", "type": "text"},
                {"name": "审核时间", "code": "verifyDate", "width": "150", "type": "text"},
                {"name": "审核人", "code": "verifyUserName", "width": "110", "type": "text"}
            ],
            isVerify: this.common.isNotBlank(this.$route.query.todo),
            query: this.initQuery(this.$route.query.tenantId, this.$route.query.quoteNum),//查询条件
            vehicleLengthData:[],//报价车长
            quoteVehicleTypeData:[],//报价车型
            verifyStateData:[],//审核状态
            quoteData:this.initQuoteData(),//报价数据
            quoteDetailData: [],//报价明细数据
            validStateData:[],//生失效状态
            tenantData:[],
            showUploadPage: false,
            param:
            {
                quoteType: enumData.quoteType.CUSTOMER,
                quoteSubType: enumData.quoteSubType.VEHICLE_ONE_WAY_QUOTE
            },
        }
    },
    /**
     * 初始化
     */
    async mounted()
    {
        await this.init();
        await this.doQuery();
    },
    /**
     * 组件
     */
    components:
    {
        tableCommon,
        myImport,
        searchList
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
                tenantId: this.common.isBlank(tenantId) ? '' : tenantId.toString(),//客户详情整车报价跳转
                tenantName: '',
                workName: '',
                beginIndexSearchStr: '',
                endIndexSearchStr: '',
                quoteVehicleType: null,
                vehicleLength: null,
                verifyState: '',
                validState:null,
                quoteType: enumData.quoteType.CUSTOMER,
                quoteSubType: enumData.quoteSubType.VEHICLE_ONE_WAY_QUOTE,
            };
        },
        clear()
        {
            this.query = {
                quoteType: enumData.quoteType.CUSTOMER,
                quoteSubType: enumData.quoteSubType.VEHICLE_ONE_WAY_QUOTE,
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
            this.tenantData = await this.common.postUrl("customerTF", "queryCustomerListNoPage", {sts: enumData.STS.VALID});
            this.quoteVehicleTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VEHICLE_TYPE_QUOTE"});
            this.vehicleLengthData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VEHICLE_LENGTH"});
            this.verifyStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VERIFY_STATE"});
            this.validStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VALID_STATE"});
            if (this.isVerify){
                this.verifyStateData.splice(1, 1);
                this.query.verifyState='0';
            }
        },
        async doQuery(query=this.query)
        {
            this.query = query;
            this.query.quoteType = enumData.quoteType.CUSTOMER;
            this.query.quoteSubType = enumData.quoteSubType.VEHICLE_ONE_WAY_QUOTE;
            this.query.todo = this.$route.query.todo;
            let {items} = await this.$refs.table.load("ZCQuoteNewTF", "queryQuote", this.query);
            items.forEach((el)=>{
                if(el.validState != 1){
                    el.disabled = true;
                }
            });
            this.$refs.table.resetData(items);
            this.$forceUpdate();
        },
        addZCQuote()
        {
            this.$emit("openTab",{
                urlId: 'addCustomerZCQuote',
                query: {tenantId: this.$route.query.tenantId},
                urlName: "新增客户整车报价",
                urlPathName: "/quote",
                urlPath: "/pt/cm/customer/quote/addCustomerZCQuote.vue"});
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
                urlId: 'copyCustomerZCQuote' + data.quoteId,
                query: {srcQuoteId: data.quoteId,tenantId: this.$route.query.tenantId},
                urlName: "复制客户整车报价",
                urlPathName: "/quote",
                urlPath: "/pt/cm/customer/quote/addCustomerZCQuote.vue"});
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
            this.$emit("openTab",{
                urlId: 'updateCustomerZCQuote' + data.quoteId,
                query: {quoteId: data.quoteId,unShowCheck: 1,modifyType},
                urlName: "修改客户整车报价",
                urlPathName: "/quote",
                urlPath: "/pt/cm/customer/quote/updateCustomerZCQuote.vue"});
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
            let that = this;
            selectData[0].quoteType=enumData.quoteType.CUSTOMER;
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
        exportData()
        {
            let excelLables = "报价单号,客户名称,报价级别,起始地,中途点1,中途点2,目的地,计费方式,报价车型,车长,货物,单程运费单价,往返运费单价,点位费单价,生效时间,失效时间";
            let excelKeys = "quoteNum,tenantName,quoteLevelName,beginIndexSearchStr,midwayPoint1IndexSearchStr,midwayPoint2IndexSearchStr,endIndexSearchStr," +
                    "billingTypeName,quoteVehicleTypeName,vehicleLengthName,goodsIdName,feePrice,returnPrice,pointFee,effectDate,expireDate";
            let selectData = this.common.copyObj(this.query);
            this.common.downloadExcelFile("ZCQuoteNewTF|exportCustomerZCQuoteData", selectData, excelLables, excelKeys);
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
            param.quoteType=enumData.quoteType.CUSTOMER;
            this.$confirm("是否确认" + tip +"？", "提示").then(async () =>{
                await this.common.postUrl("ZCQuoteNewTF", "verifyQuote", param, null, null, '', true);
                this.$message.success(tip + "成功！");
                await this.doQuery();
                this.$parent.loadTodoData();
            }).catch(() =>{
                //取消
            });
        },
        cancelVerifyQuote(){
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length !== 1)
            {
                this.$message.error("请选择一个需要取消审核的报价！");
                return false;
            }
            let data = selectData[0];
            if (data.verifyState == enumData.verifyState.notReviewed)
            {
                this.$message.error("未审核的报价,不允许操作！");
                return false;
            }
            let param = this.common.copyObj(data);
            param.quoteType=enumData.quoteType.CUSTOMER;
            this.$confirm("是否确认取消审核？", "提示").then(async () =>{
                await this.common.postUrl("ZCQuoteNewTF", "cancelVerifyQuote", param, null, null, '', true);
                this.$message.success("取消审核成功！");
                await this.doQuery();
                this.$parent.loadTodoData();
            }).catch(() =>{
                //取消
            });
        },
        dblclickItem(data){
            this.$emit("openTab",{
                urlId: 'customerZCQuoteDetailMain' + data.quoteId,
                query: {
                    quoteId:data.quoteId,
                    logId: data.quoteId,
                    logType: enumData.LOG_TYPE.QUOTE,
                },
                urlName: "报价详情",
                urlPathName: "/quote",
                urlPath: "/pt/cm/customer/quote/customerZCQuoteDetailMain.vue"});
        },
    },
    computed:{
        formData(){
            return [
                {"name":"报价单号","model":"quoteNum","type":"input","placeholder":"报价单号","isshow":true},
                {"name":"客户名称","model":"tenantId","type":"select","options":this.tenantData,"label":"name","value":"tenantId","placeholder":"客户名称","method":"doQuery","isshow":true},
                {"name":"作业点","model":"workName","type":"input","placeholder":"作业点","isshow":true},
                {"name":"起始地","model":"beginIndexSearchStr","type":"input","placeholder":"起始地","isshow":true},
                {"name":"目的地","model":"endIndexSearchStr","type":"input","placeholder":"目的地","isshow":true},
                {"name":"报价车型","model":"quoteVehicleType","type":"select","options":this.quoteVehicleTypeData,"label":"codeName","value":"codeValue","multiple":true,"placeholder":"报价车型","method":"doQuery","isshow":true},
                {"name":"车长","model":"vehicleLength","type":"select","options":this.vehicleLengthData,"label":"codeName","value":"codeValue","multiple":true,"placeholder":"车长","method":"doQuery","isshow":true},
                {"name":"审核状态","model":"verifyState","type":"select","options":this.verifyStateData,"label":"codeName","value":"codeValue","placeholder":"审核状态","method":"doQuery","isshow":true},
                {"name":"生失效状态","model":"validState","type":"select","options":this.validStateData, "label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
            ]
        }
    },
}
