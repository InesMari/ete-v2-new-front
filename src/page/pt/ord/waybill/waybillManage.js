import tableCommon from "@/components/table/tableCommon.vue";
import workNode from "@/page/pt/ord/waybill/subpage/workNode.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import enumData from "@/page/pt/enum";
import searchList from "@/components/searchList/searchList.vue";
import fileViewer from "@/components/myFile/file-viewer.vue";
import myImport from "@/components/myImport/myImport.vue";

export default {
    name: 'waybillManage',
    data() {
        return {
            head: [
                {"name": "派车单号", "code": "waybillNum", "width": "160", "type": "text"},
                {"name": "订单编号", "code": "orderNum", "width": "350", "type": "diy"},
                {"name": "客户", "code": "custName", "width": "250", "type": "text"},
                {"name": "调度类型", "code": "dispatchTypeName", "width": "90", "type": "text"},
                {"name": "派车状态", "code": "waybillStateName", "width": "80", "type": "diyColorTd"},
                {"name": "回单状态", "code": "receiptStateName", "width": "90", "type": "text"},
                {"name": "线路名称", "code": "routeName", "width": "180", "type": "text"},
                {"name": "线路里程", "code": "routeMileage", "width": "100", "type": "text"},
                {"name": "起始点", "code": "startWorkName", "width": "120", "type": "text"},
                {"name": "起始点详细地址", "code": "startWorkAddress", "width": "220", "type": "text"},
                {"name": "目的地", "code": "endWorkName", "width": "120", "type": "text"},
                {"name": "目的地详细地址", "code": "endWorkAddress", "width": "220", "type": "text"},
                {"name": "实际行驶距离", "code": "distance", "width": "120", "type": "text"},
                {"name": "供应商", "code": "supplierName", "width": "180", "type": "text"},
                {"name": "车牌号码", "code": "plateNumber", "width": "80", "type": "text"},
                {"name": "车长", "code": "vehicleLengthName", "width": "80", "type": "text"},
                {"name": "司机", "code": "driverName", "width": "80", "type": "text"},
                {"name": "司机手机号码", "code": "driverLinkPhone", "width": "120", "type": "text"},
                {"name": "司机身份证号", "code": "driverIdCard", "width": "180", "type": "text"},
                {"name": "客户下单时间", "code": "customerOrderDate", "width": "150", "type": "text"},
                {"name": "要求运作时间", "code": "startWorkDate", "width": "140", "type": "text"},
                {"name": "是否入账", "code": "entryBillFlagName", "width": "90", "type": "text"},
                {"name": "账单编号", "code": "billNum", "width": "160", "type": "text"},
                {"name": "是否生成报表", "code": "generateReportFlagName", "width": "120", "type": "text"},
                {"name": "是否开票", "code": "isInvoiceName", "width": "90", "type": "text"},
                {"name": "车辆属性", "code": "vehicleAttributionName", "width": "120", "type": "text"},
                {"name": "车辆使用性质", "code": "useCharacterName", "width": "120", "type": "text"},
                {"name": "出车时间", "code": "startCarDate", "width": "140", "type": "text"},
                {"name": "收车时间", "code": "endCarDate", "width": "140", "type": "text"},
                {"name": "货物名称", "code": "goodsName", "width": "120", "type": "text"},
                {"name": "货物件数/件", "code": "totalGoodsCount", "width": "80", "type": "text",isSum:true},
                {"name": "货物重量/kg", "code": "totalGoodsWeight", "width": "80", "type": "text",isSum:true},
                {"name": "货物体积/m³", "code": "totalGoodsVolume", "width": "80", "type": "text",isSum:true},
                {"name": "结算净重/kg", "code": "netWeight", "width": "90", "type": "text",isSum:true},
                {"name": "结算毛重/kg", "code": "grossWeight", "width": "90", "type": "text",isSum:true},
                {"name": "结算体积/m³", "code": "volume", "width": "90", "type": "text",isSum:true},
                {"name": "计费方式", "code": "billTypeName", "width": "100", "type": "text"},
                {"name": "下单金额合计", "code": "totalFee", "width": "80", "type": "text",isSum:true},
                {"name": "异动金额合计", "code": "statementFee", "width": "80", "type": "text",isSum:true},
                {"name": "补费金额合计", "code": "makeupFee", "width": "80", "type": "text",isSum:true},
                {"name": "费用合计", "code": "amount", "width": "80", "type": "text",isSum:true},
                {"name": "油费", "code": "oilFee", "width": "80", "type": "text",isSum:true},
                {"name": "支付状态","code":"payStateName","width":"100", "type": "text"},
                {"name": "订单备注","code":"orderRemark","width":"100", "type": "text"},
                {"name": "派车单备注","code":"waybillRemark","width":"100", "type": "text"},
                {"name": "结算主体","code":"settleBodyName","width":"100", "type": "text"},
                {"name": "平台运单号","code":"thrdWaybillNum","width":"150", "type": "text"},
                {"name": "平台状态","code":"syncStateName","width":"80", "type": "text"},
                {"name": "平台反馈结果","code":"errorMsg","width":"240", "type": "text"},
                {"name": "收单状态","code":"receiveStateName","width":"80", "type": "text"},
                {"name": "短信提醒状态","code":"smsRemindStateName","width":"120", "type": "text"},
                {"name": "接单声明","code":"transportationAgreementFileUrl","width":"100", "type": "diy"},
                {"name": "调度人", "code": "createUserName", "width": "80", "type": "text"},
                {"name": "调度时间", "code": "createDate", "width": "140", "type": "text"},
                {"name": "调度部门", "code": "orgName", "width": "150", "type": "text"},
                {"name": "审核状态", "code": "verifyStateName", "width": "120", "type": "text"},
                {"name": "审核人", "code": "verifyUserName", "width": "100", "type": "text"},
                {"name": "审核时间", "code": "verifyDate", "width": "150", "type": "text"},
            ],
            loadParam: {
                custName: this.$route.query.tenantName,//客户详情派车单管理跳转
                waybillState: this.initWaybillState(),//客户详情待调度、运作中、已完成跳转
                daterange1: this.initDaterange1(),//客户详情待调度、运作中、已完成跳转 //供应商详情跳转
                supplierName:this.$route.query.supplierName,
                waybillNum:this.$route.query.waybillNums?this.$route.query.waybillNums.replace(/,/g,"\n"):'',
                verifyState:'',
            },
            waybillStateOptions:[],
            whetherData:[],
            vehicleAttributionData:[],
            useCharacterData:[],
            showWorkNodeDialog:false,
            // g7StateOptions:[{
            //     value:0,
            //     name:'未上发'
            // },{
            //     value:1,
            //     name:'成功'
            // },{
            //     value:2,
            //     name:'失败'
            // }],
            showReceipts: false,//上传回单
            receipts: this.initReceipts(),
            orderData: [],
            waybillWorkData: [],
            pickerOptions: enumData.DATE_RANGE_SHORTCUT_OPTIONS,
            value1:'',
            value2:'',
            showGps:false,
            receiptStateData: [],
            showGround:false,
            g7NtoccGround:"1",
            g7NtoccGroundData:[],

            showChangeSupplier:false,
            tenantId:null,
            tenantData:[],

            verifyStateData:[{codeValue:0,codeName:'未审核'},{codeValue:1,codeName:'已审核'}],
            bizTypeData:[],
            // orgUserData:[],

            list:[{}],

            srcList: [],

            userId:this.common.userInfo().userId,
            orgIdData: [],
            uploadOpen:false,
            settleBodyOptions:[],
            syncStateOptions:[],

            receiveReceiptStateData:[],
            smsRemindStateData:[],

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
        myImport,
        fileViewer,
        tableCommon,
        myFileModel,
        workNode,
        searchList
    },
    /**
     * 绑定函数
     */
    methods: {
        async doQuery(query = this.loadParam) {
            this.loadParam = query;
            if (this.common.isNotBlank(this.loadParam.daterange1) && this.loadParam.daterange1.length == 2) {
                this.loadParam.startCreateDate = this.loadParam.daterange1[0];
                this.loadParam.endCreateDate = this.loadParam.daterange1[1];
            } else {
                this.loadParam.startCreateDate = '';
                this.loadParam.endCreateDate = '';
            }
            if (this.common.isNotBlank(this.loadParam.daterange2) && this.loadParam.daterange2.length == 2) {
                this.loadParam.startStartCarDate = this.loadParam.daterange2[0];
                this.loadParam.endStartCarDate = this.loadParam.daterange2[1];
            } else {
                this.loadParam.startStartCarDate = '';
                this.loadParam.endStartCarDate = '';
            }
            if (this.common.isNotBlank(this.loadParam.daterange3) && this.loadParam.daterange3.length == 2) {
                this.loadParam.startEndCarDate = this.loadParam.daterange3[0];
                this.loadParam.endEndCarDate = this.loadParam.daterange3[1];
            } else {
                this.loadParam.startEndCarDate = '';
                this.loadParam.endEndCarDate = '';
            }
            if (this.common.isNotBlank(this.loadParam.daterange4) && this.loadParam.daterange4.length == 2) {
                this.loadParam.startWorkDate = this.loadParam.daterange4[0];
                this.loadParam.endWorkDate = this.loadParam.daterange4[1];
            } else {
                this.loadParam.startWorkDate = '';
                this.loadParam.endWorkDate = '';
            }
            if (this.common.isNotBlank(this.loadParam.customerOrderDate) && this.loadParam.customerOrderDate.length === 2) {
                this.loadParam.startCustomerOrderDate = this.loadParam.customerOrderDate[0];
                this.loadParam.endCustomerOrderDate = this.loadParam.customerOrderDate[1];
            } else {
                this.loadParam.startCustomerOrderDate = '';
                this.loadParam.endCustomerOrderDate = '';
            }
            if (this.common.isNotBlank(this.$route.query.isFromSystemData))
            {
                this.loadParam.isFromSystemData = this.$route.query.isFromSystemData;
                this.loadParam.systemDataParam = this.$route.query.systemDataParam;
            }
            let {items} = await this.$refs.table.load("ordWaybillTF", "queryOrdWaybillPage", this.loadParam);
            items.forEach((el) => {
                if (el.waybillState == enumData.waybillState.cancelled) {
                    el.disabled = true;
                }
            });
            this.$refs.table.resetData(items);
        },
        initWaybillState()
        {
            let waybillState = [];
            if (!isNaN(this.$route.query.waybillState))
                waybillState.push(this.$route.query.waybillState);
            else
            {
                if (this.common.isNotBlank(this.$route.query.waybillState))
                    waybillState = this.$route.query.waybillState.split(",");
            }
            return waybillState;
        },
        initDaterange1()
        {
            let daterange1 = [];
            if (this.common.isNotBlank(this.$route.query.currentDate))
                daterange1 = [this.$route.query.currentDate,this.$route.query.currentDate];
            if (this.common.isNotBlank(this.$route.query.startDate))
                daterange1 = [this.$route.query.startDate,this.$route.query.endDate];
            return daterange1;
        },
        download(){
            this.$refs.table.downloadExcelFile('派车单列表');
        },
        init() {
            this.initStaticData();
        },
        //初始化页面的静态数据
        async initStaticData() {
            let that = this;
            this.common.postUrl('commonTF', 'getSysStaticData', {'codeType': 'WAYBILL_STATE'}, function (data) {
                that.waybillStateOptions = data;
            });
            //是否
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WHETHER"}, function (data) {
                that.whetherData = data;
            });
            //是否
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VEHICLE_ATTRIBUTION"}, function (data) {
                that.vehicleAttributionData = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VEHICLE_USE_CHARACTER"}, function (data) {
                that.useCharacterData = data;
            });
            //是否
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "RECEIPT_STATE"}, function (data) {
                that.receiptStateData = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PAY_TITLE"}, function (data) {
                that.settleBodyOptions = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "SYNC_STATE"}, function (data) {
                that.syncStateOptions = data;
            });
            // this.common.postUrl("userTF", "loadCurrentOrgUserList", {}, function (data) {
            //     that.orgUserData = data;
            // });
            this.common.postUrl("regionOrgTF", "getOrgInfoList", {}, function (data) {
                that.orgIdData = data;
            });

            this.common.postUrl("supplierTF", "queryAllSupplierList", {}, function (data) {
                that.tenantData = data;
            });

            this.receiveReceiptStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "RECEIVE_RECEIPT_STATE"});
            this.smsRemindStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "SMS_REMIND_STATE"});
        },
        async dispatch(dispatchType) {
            let dispatchName = await this.common.postUrl("ordDispatchTF", "getDispatchTypeName", {dispatchType});
            let item = {
                urlName: dispatchName,
                urlId: 'dispatch'+dispatchType,
                urlPathName: "/dispatch"+dispatchType,
                urlPath: "/pt/ord/dispatch/dispatch.vue",
                query: {dispatchType},
            }
            this.$emit('openTab', item);
        },
        clear() {
            this.loadParam = {};
        },
        async cancelWaybills() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一个需要取消的派车单！");
                return false;
            }
            for (let i = 0; i < selectData.length; i++) {
                if (selectData[i].waybillState == enumData.waybillState.cancelled) {
                    this.$message.error("派车单: " + selectData[i].waybillNum + "已经取消，请勿重复操作！");
                    return false;
                }
                if (selectData[i].waybillState == enumData.waybillState.finished) {
                    this.$message.error("派车单: " + selectData[i].waybillNum + "已完成，不可取消！");
                    return false;
                }
                if (selectData[i].waybillState == enumData.waybillState.abort) {
                    this.$message.error("派车单: " + selectData[i].waybillNum + "异常中止，不可取消！");
                    return false;
                }
                if (selectData[i].terminateStatus == enumData.verifyState.notReviewed) {
                    this.$message.error("派车单: " + selectData[i].waybillNum + "已经发起异常终止，不能重复发起！");
                    return false;
                }
            }

            if(selectData[0].waybillState != enumData.waybillState.waitAppointVehicle&&selectData[0].waybillState != enumData.waybillState.waitStartVehicle) {
                let now = new Date();
                let customerOrderDate = new Date(selectData[0].createDate);
                let year = now.getFullYear();
                let month = now.getMonth();
                if (now.getDate() <= 12) {
                    //如果是12号或者以前 不能选上上个月的
                    let beginOfMonth = new Date(year, month - 1, 1);
                    if (customerOrderDate.getTime() < beginOfMonth.getTime()) {
                        this.$message.error("调度时间在上上个月或之前的不能取消！");
                        return false;
                    }
                } else {
                    //如果是12号以后  不能选上个月的
                    let beginOfMonth = new Date(year, month, 1);
                    if (customerOrderDate.getTime() < beginOfMonth.getTime()) {
                        this.$message.error("12号以后，调度时间在上个月的不能取消！");
                        return false;
                    }
                }
            }

            let waybillIds = [];
            let waybillNum = '';
            let states = 0;
            selectData.forEach(item => {
                if (item.waybillState == enumData.waybillState.inWay) {
                    states++;
                }
                if (this.common.isNotBlank(item.waybillId)) {
                    waybillIds.push(item.waybillId);
                    waybillNum += item.waybillNum + ",";
                }
            });
            if (states > 0) {
                if (states > 1 || states != selectData.length) {
                    this.$message.error("只能异常终止一个派车单！");
                    return false;
                } else {
                    selectData[0].unShowCheck = 1;
                    selectData[0].cancelWaybills = 1;
                    this.$emit("openTab", {
                        urlId: 'feeChange' + selectData[0].waybillId,
                        query: selectData[0],
                        urlName: "异常终止",
                        urlPathName: "/feeChange",
                        urlPath: "/pt/ord/waybill/feeChange/feeChange.vue"
                    });
                    return;
                }
            }
            waybillNum = waybillNum.substring(0, waybillNum.length - 1);
            let that = this;
            this.$confirm("确认需要取消派车单？", "提示").then(() => {
                this.common.postUrl("ordWaybillTF", "cancelWaybills", {waybillIds, waybillNum}, function (data) {
                    that.doQuery();
                    that.$message.success("取消成功！");
                }, null, '', true);
            });
        },


        /**
         * 运单详情
         * @returns {boolean}
         */
        toWaybillDetailBtn()
        {

            let waybillId = null;
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length !== 1)
            {
                this.$message.error("请选择一个需要查看的派车单！");
                return false;
            }
            waybillId = selectData[0].waybillId;
            this.toWaybillDetail(waybillId);

        },
        toWaybillDetailDbClick(data){
            this.toWaybillDetail(data.waybillId);
        },

        /**
         * 运单详情
         * @returns {boolean}
         */
        toWaybillDetail(waybillId)
        {
            this.$emit("openTab",{
                urlId: 'waybillDetail' + waybillId,
                query: {waybillId: waybillId,unShowCheck: 1,},
                urlName: "派车单详情",
                urlPathName: "/detail",
                urlPath: "/pt/ord/waybill/detail/waybillDetail.vue"});
        },
        toUpdateWaybill(){
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length !== 1){
                this.$message.error("请选择一个需要修改的派车单！");
                return false;
            }
            if (selectData[0].waybillState == enumData.waybillState.cancelled) {
                this.$message.error("派车单: " + selectData[0].waybillNum + "已经取消，不能修改！");
                return false;
            }
            if (selectData[0].waybillState == enumData.waybillState.abort) {
                this.$message.error("派车单: " + selectData[0].waybillNum + "异常中止，不能修改！");
                return false;
            }
            if(selectData[0].syncState == 1||selectData[0].syncState == 9){
                this.$message.error("派车单: " + selectData[0].waybillNum + "已同步到三方平台，不能修改！");
                return false;
            }
            
            let now = new Date();
            let customerOrderDate = new Date(selectData[0].createDate);
            let year = now.getFullYear();
            let month = now.getMonth();
            if(now.getDate() <= 12) {
                //如果是12号或者以前 不能选上上个月的
                let beginOfMonth = new Date(year, month - 1, 1);
                if(customerOrderDate.getTime() < beginOfMonth.getTime()){
                    this.$message.error("调度时间在上上个月或之前的不能修改！");
                    return false;
                }
            }else{
                //如果是12号以后  不能选上个月的
                let beginOfMonth = new Date(year, month, 1);
                if (customerOrderDate.getTime() < beginOfMonth.getTime())
                {
                    this.$message.error("12号以后，调度时间在上个月的不能修改！");
                    return false;
                }
            }
            
            this.$emit("openTab",{
                urlId: 'updateWaybill' + selectData[0].waybillId,
                query: selectData[0],
                urlName: "修改派车单",
                urlPathName: "/updateWaybill",
                urlPath: "/pt/ord/waybill/update/updateWaybill.vue"});
        },
        async toFeeChange() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一个需要费用异动的派车单！");
                return false;
            }
            // if (selectData[0].waybillState != enumData.waybillState.finished
            //     && selectData[0].waybillState != enumData.waybillState.abort
            //     && selectData[0].syncState != 9) {
            //     this.$message.error("派车单: " + selectData[0].waybillNum + "不是已完成或者异常中止状态！");
            //     return false;
            // }
            if (selectData[0].verifyState == 1) {
                this.$message.error("派车单: " + selectData[0].waybillNum + "已审核，不能费用异动！");
                return false;
            }
            if (selectData[0].entryBillFlag != undefined && selectData[0].entryBillFlag == 1) {
                this.$message.error("派车单: " + selectData[0].waybillNum + "已经进入账单！");
                return false;
            }
            if (selectData[0].terminateStatus == enumData.verifyState.notReviewed) {
                this.$message.error("派车单: " + selectData[0].waybillNum + "已经发起异常终止，不能费用异动！");
                return false;
            }
            selectData[0].unShowCheck = 1;
            await this.common.postUrl("commonTF", "checkDateLimit", {date: selectData[0].endCarDate});
            this.$emit("openTab", {
                urlId: 'feeChange' + selectData[0].waybillId,
                query: selectData[0],
                urlName: "费用异动",
                urlPathName: "/feeChange",
                urlPath: "/pt/ord/waybill/feeChange/feeChange.vue"
            });
        },
        doCopy(){
            let that = this;
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length !== 1){
                this.$message.error("请选择一个派车单！");
                return false;
            }
            let msg = '运作日期：'+(selectData[0].startWorkDate1||'')+"\r";
            msg += '运作线路：'+(selectData[0].routeName||'')+"\r";
            msg += '车辆信息：'+(selectData[0].plateNumber||'')+"\r";
            msg += '司机姓名：'+(selectData[0].driverName||'')+"\r";
            msg += '司机电话：'+(selectData[0].driverLinkPhone||'')+"\r";
            msg += '司机身份证：'+(selectData[0].driverIdCard||'')+"\r";
            msg += '车辆预计'+(selectData[0].startWorkDate2||'')+"到达提货点";
            this.$copyText(msg).then(function () {
                that.$message.success("复制成功！");
            });
        },
        showWorkNode() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一个需要修改的派车单！");
                return false;
            }
            if (this.common.userInfo().userId != 2) {
                if (selectData[0].waybillState != enumData.waybillState.inWay
                    && selectData[0].waybillState != enumData.waybillState.finished) {
                    this.$message.error("派车单: " + selectData[0].waybillNum + "不处于运输中或者已完成，不能操作！");
                    return false;
                }
            }
            // if(selectData[0].generateReportFlag==1){
            //     this.$message.error("派车单: " + selectData[0].waybillNum + "已经进入报表，不能操作！");
            //     return false;
            // }
            this.showWorkNodeDialog = true;
            this.$nextTick(()=>{
                this.$refs.workNode.init(selectData[0]);
            })
        },
        close(){
            this.doQuery();
            this.showWorkNodeDialog = false;
        },
        syncG7(){
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length <= 0){
                this.$message.error("请选择一个需要同步的派车单！");
                return false;
            }
            let that = this;
            let waybillIds = [];
            for (let i = 0; i < selectData.length; i++) {
                let item = selectData[i];
                if (item.waybillState != enumData.waybillState.inWay&&item.waybillState != enumData.waybillState.finished) {
                    that.$message.error("派车单: " + item.waybillNum + "状态不对，不能同步！");
                    return false;
                }
                if(item.isInvoice==1){
                    that.$message.error("派车单: " + item.waybillNum + "能够开票，不能同步！");
                    return false;
                }
                if (that.common.isNotBlank(item.waybillId)) {
                    waybillIds.push(item.waybillId);
                }
            }
            this.common.postUrl("ordWaybillTF", "syncWaybill", {waybillIds}, function (data) {
                that.doQuery();
                if(data=='Y'){
                    that.$message.success("发起同步成功！");
                }else if(data=='N'){
                    that.$message.error("发起同步失败，请查看反馈结果！");
                }else{
                    that.$message.error(data);
                }
            },null,'',true);
        },
        appealWaybill(){
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length <= 0){
                this.$message.error("请选择一个需要发起申诉的派车单！");
                return false;
            }
            let that = this;
            this.common.postUrl("ordWaybillTF", "appealWaybill", {waybillId:selectData[0].waybillId}, function (data) {
                that.doQuery();
                if(data=='Y'){
                    that.$message.success("发起申诉成功！");
                }else if(data=='N'){
                    that.$message.error("发起申诉失败！");
                }else{
                    that.$message.error(data);
                }
            },null,'',true);
        },
        /**
         * 初始化回单对象
         * @returns {*}
         */
        initReceipts()
        {
            this.receipts = {
                rId: '',//ord_waybill_receipts_info id
                waybillId: '',
                dispatchId: '',
                waybillNum: '',
                orderId: '',
                orderNum: '',
                tenantName: '',
                waybillWorkId: '',
                workAddressStr: '',
                receiptsType: '1',
            };
            return this.receipts;
        },
        /**
         * 打开上传单据
         */
        openAddReceipts()
        {
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length !== 1)
            {
                this.$message.error("请选择一个上传单据的派车单！");
                return false;
            }
            if (!(selectData[0].waybillState == enumData.waybillState.finished
                    || selectData[0].waybillState == enumData.waybillState.abort))
            {
                this.$message.error("完成的派车单才能上传单据！");
                return false;
            }
            this.initReceipts();
            this.receipts.waybillId = selectData[0].waybillId;
            this.receipts.waybillNum = selectData[0].waybillNum;
            this.receipts.dispatchId = selectData[0].dispatchId;
            this.loadWaybillOrderData();

            this.list=[{}];
        },
        changeGroundShow(flag){
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length <=0)
            {
                this.$message.error("请选择派车单！");
                return false;
            }
            this.showGround=flag;
            this.g7NtoccGround = '1';
        },
        transG7NtoccGround(){
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length <=0)
            {
                this.$message.error("请选择派车单！");
                return false;
            }
            if(!this.g7NtoccGround){
                this.$message.error("请选择基地！");
                return false;
            }
            let waybillIds = [];

            for (let i = 0; i < selectData.length; i++) {
                waybillIds.push(selectData[i].waybillId);
            }
            let that = this;
            this.common.postUrl("ordWaybillTF", "transG7NtoccGround", {waybillIds,g7NtoccGround:this.g7NtoccGround}, function (data) {
                that.doQuery();
                if(data){
                    that.$message.success("切换基地成功！");
                    that.showGround=false;
                    that.g7NtoccGround = '1';
                }
            },null,'',true);
        },
        /**
         * 改变运单号
         */
        async loadWaybillOrderData()
        {
            this.orderData = await this.common.postUrl("receiptsTF", "loadWaybillOrderInfoByWaybillId", {waybillId: this.receipts.waybillId});
            if (this.orderData.length === 1)
            {
                this.receipts.orderId = this.orderData[0].orderId;
                this.receipts.tenantName = this.orderData[0].tenantName;
            }
            this.loadWaybillWorkData();
        },
        /**
         * 加载运单作业点数据
         * @returns {Promise<void>}
         */
        async loadWaybillWorkData()
        {
            this.waybillWorkData = await this.common.postUrl("receiptsTF", "loadWaybillWorkInfoByWaybillId", {waybillId: this.receipts.waybillId});
            this.changeReceiptsShow(true);
        },
        /**
         * 改变展示窗口
         */
        changeReceiptsShow(flag)
        {
            this.showReceipts = flag;
        },
        /**
         * 改变订单
         */
        changeWaybillOrder(orderId)
        {
            this.orderData.forEach(item => {
                if (item.orderId == orderId){ this.receipts.tenantName = item.tenantName ;}
            });
        },
        /**
         * 运单作业点改变
         */
        changeWaybillWork(waybillWorkId)
        {
            if (this.common.isNotBlank(this.waybillWorkData) && this.waybillWorkData.length > 0)
            {
                this.waybillWorkData.forEach(item => {
                    if (item.waybillWorkId == waybillWorkId){ this.receipts.workAddressStr = item.workAddressStr ;}
                });
            }
        },
        // /**
        //  * 回调获取图片的信息
        //  * @param imgData
        //  */
        // setImgData(imgData)
        // {
        //     this.receipts.imgId = imgData.flowId;
        //     this.receipts.fileName = imgData.fileName;
        //     this.receipts.imgPath = imgData.storePath;
        // },
        /**
         * 新增单据
         */
        addReceipts()
        {
            if (this.common.isBlank(this.receipts.waybillId))
            {
                this.$message.error("请选择派车单号再提交！");
                return false;
            }
            if (this.common.isBlank(this.receipts.orderId))
            {
                this.$message.error("请选择订单号再提交！");
                return false;
            }
            if (this.common.isBlank(this.receipts.waybillWorkId))
            {
                this.$message.error("请选择作业点再提交！");
                return false;
            }
            if (this.common.isBlank(this.receipts.receiptsType))
            {
                this.$message.error("请选择单据类型再提交！");
                return false;
            }
            // this.receipts.imgId = this.$refs.receiptsImg.getImageData().flowId;
            // this.receipts.imgPath = this.$refs.receiptsImg.getImageData().storePath;
            // if (this.common.isBlank(this.receipts.imgId))
            // {
            //     this.$message.error("请上传图片信息再提交！");
            //     return false;
            // }
            // if (this.common.isBlank(this.receipts.imgPath))
            // {
            //     this.$message.error("请上传图片信息再提交！");
            //     return false;
            // }
            let list = this.common.copyObj(this.list);
            this.receipts.receiptsList=[];
            for (let i = 0; i < list.length; i++) {
                if(list[i].imgId){
                    this.receipts.receiptsList.push(list[i]);
                }
            }
            if (this.receipts.receiptsList.length==0)
            {
                this.$message.error("请上传图片信息再提交！");
                return false;
            }

            this.receipts.ischeckFinish = 1;
            let that = this;
            this.common.postUrl("receiptsTF", "addReceipts", this.receipts, function (data)
            {
                that.doQuery();
                that.changeReceiptsShow(false);
                that.$message.success("单据上传成功");
            },null, null,true);
        },
        /**
         * 订单详情
         */
        toOrderDetail(item,index)
        {
            let orderId = item.orderIds[index];
            this.$emit("openTab",{
                urlId: 'orderDetail' + orderId,
                query: {orderId: orderId,pId: 1001070},
                urlName: "订单详情",
                urlPathName: "/order",
                urlPath: "/pt/ord/order/orderDetail/orderDetailMain.vue"});
        },
        closeGpsDialog(){
            this.showGps = false;
            this.value1='';
            this.value2='';
        },
        downloadExcel(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length <= 0) {
                this.$message.error("请至少选择一条派车单数据！");
                return false;
            }

            let fileName = '派车单运作状况';
            let param = {waybillIds:[],timeStr:[]};
            for (let i = 0; i < selectData.length; i++) {
                param.waybillIds.push(selectData[i].waybillId);
            }
            param.timeStr.push(this.value1);
            param.timeStr.push(this.value2);
            param.selfCreateUrl = 'ordWaybillTF|downloadExcel';
            this.common.downloadExcelFile('', param, '', '', fileName, 'waybillGps');
            this.closeGpsDialog();
        },
        async verifyWaybill(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length <=0 )
            {
                this.$message.error("请至少选择一条需要审核的派车单！");
                return false;
            }
            let waybillIds = [];
            for (let i = 0; i < selectData.length; i++) {
                if (selectData[i].waybillState != enumData.waybillState.finished)
                {
                    this.$message.error("只能选择已完成的派车单！");
                    return false;
                }
                // if (selectData[i].verifyState == 1) {
                //     this.$message.error("只能选择未审核的派车单！");
                //     return false;
                // }
                waybillIds.push(selectData[i].waybillId);
            }
            let that = this;
            that.$confirm('您正在操作取消已完成派车单操作,是否确认取消？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                that.common.postUrl("ordWaybillTF", "verifyWaybill", {waybillIds}, function (data){
                    that.doQuery();
                    that.$message.success("审核成功");
                },null, null,true);
            }).catch(() => {
                // 取消
            });
        },
        changeSupplierShow(flag){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length <=0 )
            {
                this.$message.error("请至少选择一条需要切换供应商的派车单！");
                return false;
            }
            for (let i = 0; i < selectData.length; i++) {
                if (selectData[i].entryBillFlag != undefined && selectData[i].entryBillFlag == 1) {
                    this.$message.error("派车单: " + selectData[i].waybillNum + "已经进入账单,不能！");
                    return false;
                }
            }
            this.showChangeSupplier = flag;
        },
        async changeSupplier(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length <=0 )
            {
                this.$message.error("请至少选择一条需要切换供应商的派车单！");
                return false;
            }
            let waybillIds = [];
            for (let i = 0; i < selectData.length; i++) {
                if (selectData[i].entryBillFlag != undefined && selectData[i].entryBillFlag == 1) {
                    this.$message.error("派车单: " + selectData[i].waybillNum + "已经进入账单,不能！");
                    return false;
                }
                waybillIds.push(selectData[i].waybillId);
            }
            let that = this;
            that.$confirm('您正在操作切换供应商,是否确认？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                that.common.postUrl("ordWaybillTF", "changeSupplier", {waybillIds,tenantId:this.tenantId}, function (data){
                    that.doQuery();
                    that.$message.success("操作成功");
                    that.showChangeSupplier = false;
                },null, null,true);
            }).catch(() => {
                // 取消
            });
        },

        /**
         * 上传图片回调
         * @param flag
         */
        fileCallback(imgData){
            imgData.imgId = imgData.flowId;
            imgData.imgPath = imgData.storePath;
            if (this.list.length <= 5)
                this.list[imgData.componentId] = imgData;
            let flag = true;
            for (let i = 0; i < this.list.length; i++)
                if (this.common.isBlank(this.list[i].imgId)) flag = false;//存在空的
            if(this.list.length  < 5 && flag){
                this.list.push({});
            }
            this.initListComponentId();
        },
        initListComponentId()
        {
            for (let i = 0; i < this.list.length; i++)
                this.list[i].componentId = i;
            this.$forceUpdate();
        },
        delCallback(index){
            this.list.splice(index,1);
            let flag = true;
            for (let i = 0; i < this.list.length; i++)
                if (this.common.isBlank(this.list[i].imgId)) flag = false;//存在空的
            if(this.list.length === 4 && flag){
                this.list.push({});
            }
            this.imgDisplay();
            this.initListComponentId();
        },
        imgDisplay(){
            this.$nextTick(() => {
                let that = this;
                for (let i = 0; i < this.list.length; i++) {
                    if (that.list[i].imgId) {
                        eval("that.$refs.file" + i + "[0].initDate(" + that.list[i].imgId + ")");
                    } else {
                        eval("that.$refs.file" + i + "[0].clean()");
                    }
                }
            });
        },
        showImg(item){
            let data = item.transportationAgreementFileUrl;
            if(!data||item.waybillState<=1){
                return;
            }
            let typeList = {
                img:".gif,.GIF,.jpg,.JPG,.png,.PNG,.jpeg,.JPEG,.ico,.ICO",
                table:".xls,.xlsx,.XLS,.XLSX",
                file:"file"
            };
            let fileTypeName = data.substring(data.lastIndexOf('.'), data.length);
            if(typeList['img'].indexOf(fileTypeName)>-1){
                this.srcList=[];
                this.srcList.push(data);
			    this.$refs.viewer.show();
            }else{
                data = data.replace("_big", "");
                let url = data;
                let fileType = this.common.getFileType('',url);
                if(fileType=='pdf'){   //查看pdf
                    let idx = url.indexOf("?");
                    if(idx>=0){
                        url = url.substring(idx,0);
                    }
                    this.srcList=[];
                    this.srcList.push(url);
			        this.$refs.viewer.show();
                }else if(fileType=='excel'||fileType=='word'||fileType=='ppt'){
                    this.srcList=[];
                    this.srcList.push(url);
                    this.$refs.viewer.show();
                }else{  //下载文件
                    this.common.downloadFile(url)
                }
            }
        },
        generateWaybillInfoQrCode(){
            let that = this;
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length !== 1){
                this.$message.error("请选择一个派车单！");
                return false;
            }
            if(this.common.isNotBlank(selectData[0].qrcodeFileUrl)){
                this.srcList=[];
                this.srcList.push(selectData[0].qrcodeFileUrl);
			    this.$refs.viewer.show();
                return;
            }
            that.common.postUrl("ordWaybillTF", "generateWaybillInfoQrCode", {waybillId:selectData[0].waybillId}, function (data){
                that.doQuery();
                that.srcList=[];
                that.srcList.push(data);
			    that.$refs.viewer.show();
            },null, null,true);
        },
        async receiveReceiptById(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !=1 )
            {
                this.$message.error("请选择一条需要进行收单确认操作的派车单！");
                return false;
            }
            let that = this;
            that.$confirm('您正在进行派车单收单确认操作,是否确认取消？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                that.common.postUrl("ordWaybillTF", "receiveReceiptById", {waybillId:selectData[0].waybillId}, function (data){
                    that.doQuery();
                    that.$message.success("收单确认成功");
                },null, null,true);
            }).catch(() => {
                // 取消
            });
        },
        toScanReceipt(){
            this.$emit("openTab",{
                urlId: 'receiptScan' + new Date().getTime(),
                urlName: "扫码收单",
                urlPathName: "/receiptScan",
                urlPath: "/pt/ord/waybill/receiptScan.vue"});
        },
        smsReminderDriverDeliver(){
            let that = this;
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length !== 1){
                this.$message.error("请选择一个派车单！");
                return false;
            }
            that.common.postUrl("ordWaybillTF", "smsReminderDriverDeliver", selectData[0], function (data){
                that.doQuery();
                that.$message.success("短信提醒司机成功");
            },null, null,true);
        },
    },
    computed:{
        formData(){
            return [
                {"name":"派车单号","model":"waybillNum","type":"textarea","placeholder":"派车单号","isshow":true},
                {"name":"订单编号","model":"orderNum","type":"input","placeholder":"订单编号","isshow":true},
                {"name":"派车状态","model":"waybillState","type":"select","options":this.waybillStateOptions,"label":"codeName","value":"codeValue","multiple":true,"placeholder":"派车状态","method":"doQuery","isshow":true},
                {"name":"起始地址","model":"startWorkKeyword","type":"input","placeholder":"起始地址","isshow":true},
                {"name":"目的地址","model":"endWorkKeyword","type":"input","placeholder":"目的地址","isshow":true},
                {"name":"供应商","model":"supplierName","type":"input","placeholder":"供应商","isshow":true},
                {"name":"车牌号码","model":"plateNumber","type":"input","placeholder":"车牌号码","isshow":true},
                {"name":"司机","model":"driverName","type":"input","placeholder":"司机","isshow":true},
                {"name":"结算主体","model":"settleBody","type":"select","options":this.settleBodyOptions,"label":"codeName","value":"codeValue","placeholder":"结算主体","method":"doQuery","isshow":true},
                {"name":"平台状态","model":"syncState","type":"select","options":this.syncStateOptions,"label":"codeName","value":"codeValue","placeholder":"平台状态","method":"doQuery","isshow":true},
                {"name":"调度时间","model":"daterange1","type":"daterange","isshow":true},
                {"name":"客户下单时间","model":"customerOrderDate","type":"daterange","isshow":true},
                {"name":"要求运作时间","model":"daterange4","type":"daterange","isshow":true},
                {"name":"出车时间","model":"daterange2","type":"daterange","isshow":true},
                {"name":"收车时间","model":"daterange3","type":"daterange","isshow":true},
                {"name":"订单客户","model":"custName","type":"input","placeholder":"订单客户","isshow":true},
                {"name":"是否入账","model":"isEntryBill","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","placeholder":"是否入账","method":"doQuery","isshow":true},
                {"name":"是否生成报表","model":"isGenerateReport","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","placeholder":"是否生成报表","method":"doQuery","isshow":true},
                {"name":"是否开票","model":"isInvoice","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","placeholder":"是否开票","method":"doQuery","isshow":true},
                {"name":"车辆属性","model":"vehicleAttribution","type":"select","options":this.vehicleAttributionData,"label":"codeName","value":"codeValue","placeholder":"车辆属性","method":"doQuery","isshow":true},
                {"name":"车辆使用性质","model":"useCharacter","type":"select","options":this.useCharacterData,"label":"codeName","value":"codeValue","placeholder":"车辆使用性质","method":"doQuery","isshow":true},
                {"name":"账单编号","model":"billNum","type":"input","placeholder":"账单编号","isshow":true},
                {"name":"回单状态","model":"receiptState","type":"select","options":this.receiptStateData,"label":"codeName","value":"codeValue","placeholder":"回单状态","method":"doQuery","isshow":true},
                {"name":"支付状态","model":"payState","type":"select","options":[{codeName:'未支付',codeValue:'1'},{codeName:'部分支付',codeValue:'2'},{codeName:'全部支付',codeValue:'3'}],"label":"codeName","value":"codeValue","placeholder":"支付状态","method":"doQuery","isshow":true},
                {"name":"审核状态","model":"verifyState","type":"select","options":this.verifyStateData,"label":"codeName","value":"codeValue","placeholder":"审核状态","method":"doQuery","isshow":true},
                {"name":"调度人","model":"createUserName","type":"input","placeholder":"调度人","isshow":true},
                {"name":"调度部门","model":"orgIds","type":"select","options":this.orgIdData,"label":"orgName","value":"id", "multiple":true,"placeholder":"调度部门","method":"doQuery","isshow":true},
                {"name":"收单状态","model":"receiveState","type":"select","options":this.receiveReceiptStateData,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
                {"name":"短信提醒状态","model":"smsRemindState","type":"select","options":this.smsRemindStateData,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
            ]
        }
    },
}
