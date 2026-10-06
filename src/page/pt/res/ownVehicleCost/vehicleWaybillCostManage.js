import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";
import myImport from "@/components/myImport/myImport";


export default {
    name: 'vehicleWaybillCostManage',
    data()
    {
        return {
            head: [
                {"name": "车牌号码", "code": "plateNumber", "width": "100", "type": "text"},
                {"name": "费用日期", "code": "feeDate", "width": "100", "type": "text"},
                {"name": "费用类型", "code": "feeTypeName", "width": "100", "type": "text"},
                {"name": "支付类型", "code": "costPayTypeName", "width": "100", "type": "text"},
                {"name": "付款状态", "code": "payStateName", "width": "100", "type": "text"},
                {"name": "生成请付款单", "code": "hasGenerateReqPay", "width": "100", "type": "text"},
                {"name": "请款单号", "code": "reqNums", "width": "150", "type": "diy"},
                {"name": "付款单号", "code": "payNums", "width": "150", "type": "diy"},
                {"name": "里程数(km)", "code": "mileage", "width": "100", "type": "text"},
                {"name": "数量", "code": "num", "width": "50", "type": "text"},
                {"name": "单位", "code": "unit", "width": "50", "type": "text"},
                {"name": "金额", "code": "fee", "width": "100", "type": "text"},
                {"name": "已申请金额", "code": "applyFee", "width": "100", "type": "text"},
                {"name": "未申请金额", "code": "noApplyFee", "width": "100", "type": "text"},
                {"name": "审核状态", "code": "verifyStateName", "width": "100", "type": "text"},
                {"name": "审核人", "code": "verifyUserName", "width": "150", "type": "text"},
                {"name": "审核时间", "code": "verifyDate", "width": "150", "type": "text"},
                {"name": "审核备注", "code": "verifyRemark", "width": "150", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "150", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "备注", "code": "remark", "width": "250", "type": "text"},
            ],
            query: this.initQuery(),
            verifyStateData: [],
            uploadOpen:false,
            feeTypeData:[],
            costPayTypeData:[],
            whetherData:[],
            payStateData:[],
            enumData: enumData,
        }
    },
    components: {
        tableCommon,
        searchList,
        myImport
    },
    mounted()
    {
        this.initStaticData();
        this.doQuery();
    },
    /**
     * 绑定函数
     */
    methods: {
        async initStaticData()
        {
            let data = await this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes', {'codeType': 'VERIFY_STATE,VEHICLE_WAYBILL_COST_VEHICLE_TYPE,COST_PAY_TYPE,WHETHER,PURCHASE_PAY_STATE'});
            this.verifyStateData = data.VERIFY_STATE;
            this.feeTypeData = data.VEHICLE_WAYBILL_COST_VEHICLE_TYPE;
            this.costPayTypeData = data.COST_PAY_TYPE;
            this.whetherData = data.WHETHER;
            this.payStateData = data.PURCHASE_PAY_STATE;
            this.$forceUpdate();
        },
        initQuery()
        {
            return this.query = {
                plateNumber: '',
                verifyState: '',
                feeType: '',
                costPayType: '',
                createDate: null,
                feeDate: null,
                hasGenerateReqPay: null,
                expirationStatus:this.common.isBlank(this.$route.query.expirationStatus) ? [] : this.$route.query.expirationStatus,
                
            };
        },
        async doQuery(query = this.query)
        {
            this.query=query;
            this.uploadOpen = false;
            if(this.common.isNotBlank(this.query.createDate) && this.query.createDate.length==2){
                this.query.startCreateDate = this.query.createDate[0];
                this.query.endCreateDate = this.query.createDate[1];
            }else{
                this.query.startCreateDate = '';
                this.query.endCreateDate = '';
            }
            if(this.common.isNotBlank(this.query.feeDate) && this.query.feeDate.length==2){
                this.query.startFeeDate = this.query.feeDate[0];
                this.query.endFeeDate = this.query.feeDate[1];
            }else{
                this.query.startFeeDate = '';
                this.query.endFeeDate = '';
            }
            let {items} = await this.$refs.table.load("vehicleWaybillCostService", "queryVehicleWaybillCostPage", this.query);
            items.forEach((el)=>{
                el.disabled = el.payState == 2;
            });
        },
        /**
         * 0 查看 1 新增 2 修改 3 审核
         * @param type
         * @returns {boolean}
         */
        openPage(type, data)
        {
            let param = {};
            let title = "";
            let urlPath = "/pt/res/ownVehicleCost/vehicleWaybillCostInfo.vue";
            if (type == 1)
            {
                param.time = new Date().getTime();
                title = "新增车辆变动成本";
            }
            else if(type == 2)
            {
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length !== 1) {
                    this.$message.error("请选择一条需要修改的车辆变动成本！");
                    return false;
                }
                data = selectData[0];
                if (data.verifyState == 1)
                {
                    this.$message.error("已经审核通过，不能修改！");
                    return false;
                }
                param.time = data.id;
                param.id = data.id;
                title = "修改车辆变动成本";
            }
            else if(type == 0)//双击
            {
                param.time = data.id + "detail";
                param.id = data.id;
                title = "查看车辆变动成本";
                urlPath = "/pt/res/ownVehicleCost/vehicleWaybillCostInfoMain.vue";
            }
            else if(type == 3)
            {
                let selectData = this.$refs.table.getSelectItem();
                if (selectData.length !== 1) {
                    this.$message.error("请选择一条需要审核的车辆变动成本！");
                    return false;
                }
                if (selectData[0].verifyState != 0)
                {
                    this.$message.error("只有未审核的车辆变动成本才能执行审核操作！");
                    return false;
                }
                data = selectData[0];
                param.time = data.id + "verify";
                param.id = data.id;
                title = "审核车辆变动成本";
            }
            else
            {
                this.$message.error("请刷新试试！");
                return false;
            }
            this.$emit("openTab",{
                urlId: 'vehicleWaybillCostInfo' + param.time,
                query: {id: param.id, type,
                    logId: param.id,
                    logType: enumData.LOG_TYPE.VEHICLE_WAYBILL_COST,
                },
                urlName: title,
                urlPathName: "/res",
                urlPath: urlPath});
        },
        dblclickItem(data)
        {
            this.openPage(0, data);
        },
        async deleteVehicleWaybillCost()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1)
            {
                this.$message.error("请选择一条需要删除的车辆变动成本！");
                return false;
            }
            let data = selectData[0];
            if (1 == data.verifyState)
            {
                this.$message.error("审核通过的车辆变动成本不可以删除！");
                return false;
            }
            let that = this;
            this.$confirm("确定需要删除？", "提示", {type: "warning", center: true}).then(() =>{
                this.common.postUrl("vehicleWaybillCostService", "deleteVehicleWaybillCostById", data, function ()
                {
                    that.doQuery();
                    that.$message.success("删除成功!");
                });
            }).catch(() =>{})
        },
        async generatePayApplyCheck(type) {
            let isReq = type === enumData.PAY_TYPE.REQ;
            let selectData = this.$refs.table.getSelectItem();
            let ids = new Array();
            if(selectData.length<=0){
                this.$message.error("请先选择车辆变动成本!");
                return false;
            }
            if(selectData.length>3){
                // this.$message.error("最多选择三个车辆变动成本!");
                // return false;
            }
            for (let i = 0; i < selectData.length; i++) {
                let item = selectData[i];
                if (item.verifyState!=1) {
                    this.$message.error((selectData.length > 1 ? "第" + (i + 1)+ "条" : "该") + "车辆变动成本未审核通过");
                    return false;
                }
                if (item.noApplyFee==0) {
                    this.$message.error((selectData.length > 1 ? "第" + (i + 1)+ "条" : "该") + "车辆变动成本已经全部生成" + (this.common.isNotBlank(item.reqIds) ? "请" : "付") + "款单！");
                    return false;
                }
                if (item.costPayType == 2)
                {
                    this.$message.error("支付类型为补能的无法生成" + (isReq ? "请款":"付款"));
                    return false;
                }
                ids.push(selectData[i].id);
            }
            let str = ids.join(",");
            this.$emit('openTab',{
                query:{
                    feeIds: str,
                    feeType:1
                },
                urlName: isReq ? '车辆变动成本生成请款单' : '车辆变动成本生成付款单',
                urlId: new Date().getTime(),
                urlPathName: isReq ? "/addReq" : "/addPayOrder",
                urlPath: isReq ? "/pt/fc/receipts/add/addRequestFee.vue" : "/pt/fc/receipts/add/addPayOrder.vue",
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
                 this.$emit('openTab',{
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
                await this.$emit('openTab',{
                    urlName: '查看付款单',
                    urlId: "payOrderDetail" + id,
                    urlPathName: "/payOrderDetail",
                    urlPath: "/pt/fc/receipts/detail/payOrderDetailMain.vue",
                    query:{id: id,type:0}
                });
            }
        },
        download(){
            this.$refs.table.downloadExcelFile('车辆变动成本列表');
        },
    },
    computed: {
        formData()
        {
            return [
                {"name": "车牌号码", "model": "plateNumber", "type": "input", "isshow": true},
                {"name": "审核状态", "model": "verifyState", "type": "select", "options": this.verifyStateData, "label": "codeName", "value": "codeValue", "method": "doQuery", "isshow": true},
                {"name": "费用类型", "model": "feeType", "type": "select", "options": this.feeTypeData, "label": "codeName", "value": "codeValue", "method": "doQuery", "isshow": true},
                {"name": "支付类型", "model": "costPayType", "type": "select", "options": this.costPayTypeData, "label": "codeName", "value": "codeValue", "method": "doQuery", "isshow": true},
                {"name": "付款状态", "model": "payState", "type": "select", "options": this.payStateData, "label": "codeName", "value": "codeValue", "method": "doQuery", "isshow": true},
                {"name": "生成请付款单", "model": "hasGenerateReqPay", "type": "select", "options": this.whetherData, "label": "codeName", "value": "codeValue", "method": "doQuery", "isshow": true},
                {"name": "创建时间","model":"createDate","type":"daterange","isshow":true},
                {"name": "费用日期","model":"feeDate","type":"daterange","isshow":true},
            ]
        }
    },
}
