import tableCommon from "@/components/table/tableCommon.vue";
import myElDatePicker from "@/components/myElDatePicker/index.js";
import myImport from "@/components/myImport/myImport";
import searchList from "@/components/searchList/searchList.vue";
import selectWork from "@/page/pt/wms/selectWork.vue";
import enumData from "@/page/pt/enum";
import fileViewer from '@/components/myFile/file-viewer.vue';


export default {
    name: 'appointManage',
    data() {
        return {
            head: [
                {"name": "操作", "code": "caozuo", "width": "270", "type": "diy","excelField":false},
                {"name": "仓库", "code": "workName", "width": "300", "type": "text"},
                {"name": "预约编号", "code": "appointNum", "width": "120", "type": "text"},
                // {"name": "出发地", "code": "beginAddress", "width": "120", "type": "text"},
                {"name": "到货厂商", "code": "fromTenantName", "width": "150", "type": "text"},
                {"name": "车牌号码", "code": "plateNumber", "width": "120", "type": "text"},
                {"name": "车长", "code": "vehicleLengthName", "width": "120", "type": "text"},
                {"name": "到货单", "code": "url", "width": "150", "type": "diy","excelField":false},
                {"name": "预计到达时间", "code": "expectArriveDate", "width": "160", "type": "text"},
                {"name": "实际报到时间", "code": "checkInDate", "width": "160", "type": "text"},
                {"name": "预约状态", "code": "stateName", "width": "120", "type": "text"},
                {"name": "到达地", "code": "arriveAddress", "width": "120", "type": "text"},
                {"name": "货物类型", "code": "goodsType", "width": "120", "type": "text"},
                {"name": "货物托数", "code": "goodsCount", "width": "120", "type": "text"},
                {"name": "货物重量", "code": "goodsWeight", "width": "120", "type": "text"},
                {"name": "手机号", "code": "billId", "width": "120", "type": "text"},
                {"name": "预约时间", "code": "createDate", "width": "160", "type": "text"},
                {"name": "开始操作时间", "code": "beginDischargeDate", "width": "160", "type": "text"},
                {"name": "开始操作人", "code": "beginDischargeUserName", "width": "160", "type": "text"},
                {"name": "完成操作时间", "code": "endDischargeDate", "width": "160", "type": "text"},
                {"name": "完成操作人", "code": "endDischargeUserName", "width": "160", "type": "text"},
                {"name": "操作用时(分钟)", "code": "dischargeTime", "width": "120", "type": "text"},
            ],
            loadParam: {
                workId:'',
                fromTenantName:'',
                plateNumber:'',
                vehicleLength:'',
                billId:'',
                daterange1:'',
                daterange2:'',
                state:'',
            },
            showSelWork:false,
            showDialog:false,
            stateData:[],
            workList:[],
            vehicleLengthData:[],
            srcList: [],
            info: {
            
            },
        }
    },
    /**
     * 初始化
     */
    mounted() {
        // this.initSelWork();
        this.doQuery();
        this.init();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        myElDatePicker,
        myImport,
        searchList,
        fileViewer,
        selectWork
    },
    /**
     * 绑定函数
     */
    methods: {
        initSelWork(){
            this.userInfo = this.common.userInfo();
            if(!this.userInfo.workId){
                this.showSelWork = true;
            }else{
                this.firstIn = false;
            }
        },
        selWork(){
            this.showSelWork = false;
            this.$forceUpdate();
            if(!this.firstIn){
                this.$emit('closeOthers', {});
            }
            this.userInfo = this.common.userInfo();
            this.firstIn = false;
        },
        init() {
            let that = this;
            //入库状态
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "APPOINT_STATE"}, function (data) {
                that.stateData = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VEHICLE_LENGTH"}, function (data) {
                that.vehicleLengthData = data;
            });
            // 仓库
            this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {parentFlag:1,regionFlag:1}, function (data) {
                that.workList = data;
            });
        },
        async doQuery(query = this.loadParam) {
            this.loadParam = query;
            if (this.common.isNotBlank(this.loadParam.daterange1) && this.loadParam.daterange1.length == 2) {
                this.loadParam.startExpectArriveDate = this.loadParam.daterange1[0];
                this.loadParam.endExpectArriveDate = this.loadParam.daterange1[1];
            } else {
                this.loadParam.startExpectArriveDate = '';
                this.loadParam.endExpectArriveDate = '';
            }
            if (this.common.isNotBlank(this.loadParam.daterange2) && this.loadParam.daterange2.length == 2) {
                this.loadParam.startCheckInDate = this.loadParam.daterange2[0];
                this.loadParam.endCheckInDate = this.loadParam.daterange2[1];
            } else {
                this.loadParam.startCheckInDate = '';
                this.loadParam.endCheckInDate = '';
            }
            this.loadParam.all = 1;
            let {items} = await this.$refs.table.load("wmsAppointTF", "queryWmsAppointInfoPage", this.loadParam);
            items.forEach((el)=>{
                if(el.state == 4){
                    el.disabled = true;
                }
            })
            this.$refs.table.resetData(items);
        },
        updateWmsAppointInfoState(item,state){
            let that = this;
            if(state==1){
                if(item.state!=1){
                    this.$message.error('状态不是已预约状态');
                    return;
                }
                let msg = `
                    <p style="text-align:center;">预约编号：${item.appointNum}</p>
                    <p style="text-align:center;">车牌号码：${item.plateNumber}</p>
                    <p style="text-align:center;">进行报到，是否继续？</p>
                    `;
                this.$confirm(msg, "操作提示" ,{
                    confirmButtonText: '确认',
                    cancelButtonText: '关闭',
                    dangerouslyUseHTMLString:true,
                    center: true
                }).then(() =>{
                    if(item.opType == 2){
                        that.common.postUrl("wmsAppointTF", "wmsAppointInfoCheckInByStaff", item, function (data_) {
                            if (that.common.isNotBlank(data_)) {
                                that.$message.success('操作成功');
                                that.doQuery();
                            }
                        },null,'',true);
                    }else{
                        this.$emit("openTab",{
                            urlId: "addOrUpdateInOrder" + new Date().getTime(),
                            query: {appointId:item.appointId},
                            urlName: '新增入库单',
                            urlPathName: "/addOrUpdateInOrder",
                            urlPath: '/pt/wms/ord/addOrUpdateInOrder.vue'});
                    }
                }).catch(() =>{})
                return;
            }
            let msg = '';
            if(state==3){
                if(item.state!=2){
                    this.$message.error('卸货状态不是已报到状态');
                    return;
                }
                msg = `
                    <p style="text-align:center;">预约编号：${item.appointNum}</p>
                    <p style="text-align:center;">车牌号码：${item.plateNumber}</p>
                    <p style="text-align:center;">卸货状态从[已报到]变更为[卸货中]</p>
                    <p style="text-align:center;">是否继续？</p>
                    `;
            }else{
                if(item.state!=3){
                    this.$message.error('卸货状态不是卸货中状态');
                    return;
                }
                msg = `
                    <p style="text-align:center;">预约编号：${item.appointNum}</p>
                    <p style="text-align:center;">车牌号码：${item.plateNumber}</p>
                    <p style="text-align:center;">卸货状态从[卸货中]变更为[卸货完成]</p>
                    <p style="text-align:center;">是否继续？</p>
                    `;
            }
            this.$confirm(msg, "操作提示" ,{
                confirmButtonText: '确认',
                cancelButtonText: '关闭',
                dangerouslyUseHTMLString:true,
                center: true
            }).then(() =>{
                that.common.postUrl("wmsAppointTF", "updateWmsAppointInfoState", {appointId:item.appointId,state:state}, function (data_) {
                    if (that.common.isNotBlank(data_)) {
                        that.$message.success('操作成功');
                        that.doQuery();
                    }
                },null,'',true);
            }).catch(() =>{})
        },
        toFullScreen(){            
            window.open(window.location.origin+'/appointmentBoard', "_blank");
			// this.$emit("openTab",{
			// 	urlId: new Date().getTime(),
			// 	urlName: "预约看板",
			// 	urlPathName: "/appointmentBoard",
			// 	urlPath: "/pt/wms/appoint/appointmentBoard.vue"});
        },
        download(){
            this.$refs.table.downloadExcelFile('仓库预约列表');
        },
        cancelAppoint(){
            let that = this;
            let array = this.$refs.table.getSelectItem();
            if (array.length !== 1) {
                this.$message.error("请选择一条数据");
                return false;
            }
            // if(array[0].state>1){
            //     this.$message.error("已经报到不能取消");
            //     return false;
            // }
            let msg = `
                    <p style="text-align:center;">预约编号：${array[0].appointNum}</p>
                    <p style="text-align:center;">车牌号码：${array[0].plateNumber}</p>
                    <p style="text-align:center;">取消预约，是否继续？</p>
                    `;
            this.$confirm(msg, "操作提示" ,{
                confirmButtonText: '确认',
                cancelButtonText: '关闭',
                dangerouslyUseHTMLString:true,
                center: true
            }).then(() =>{
                that.common.postUrl("wmsAppointTF", "cancelWmsAppoint", array[0], function (data_) {
                    if (that.common.isNotBlank(data_)) {
                        that.$message.success('操作成功');
                        that.doQuery();
                    }
                },null,'',true);
            }).catch(() =>{})
        },
        checkInAppoint(){
            let that = this;
            let array = this.$refs.table.getSelectItem();
            if (array.length !== 1) {
                this.$message.error("请选择一条数据");
                return false;
            }
            if(array[0].state>1){
                this.$message.error("已经报到不能重复报到");
                return false;
            }
            let msg = `
                    <p style="text-align:center;">预约编号：${array[0].appointNum}</p>
                    <p style="text-align:center;">车牌号码：${array[0].plateNumber}</p>
                    <p style="text-align:center;">进行报到，是否继续？</p>
                    `;
            this.$confirm(msg, "操作提示" ,{
                confirmButtonText: '确认',
                cancelButtonText: '关闭',
                dangerouslyUseHTMLString:true,
                center: true
            }).then(() =>{
                that.common.postUrl("wmsAppointTF", "wmsAppointInfoCheckInByStaff", array[0], function (data_) {
                    if (that.common.isNotBlank(data_)) {
                        that.$message.success('操作成功');
                        that.doQuery();
                    }
                },null,'',true);
            }).catch(() =>{})
        },
        op(){
            let that = this;
            let array = this.$refs.table.getSelectItem();
            if (array.length !== 1) {
                this.$message.error("请选择一条数据");
                return false;
            }
            if(array[0].state>1){
                this.$message.error("已经报到不能取消");
                return false;
            }

            let msg = `
                    <p style="text-align:center;">预约编号：${array[0].appointNum}</p>
                    <p style="text-align:center;">车牌号码：${array[0].plateNumber}</p>
                    <p style="text-align:center;">取消预约，是否继续？</p>
                    `;
            this.$confirm(msg, "操作提示" ,{
                confirmButtonText: '确认',
                cancelButtonText: '关闭',
                dangerouslyUseHTMLString:true,
                center: true
            }).then(() =>{
                that.common.postUrl("wmsAppointTF", "cancelWmsAppoint", array[0], function (data_) {
                    if (that.common.isNotBlank(data_)) {
                        that.$message.success('操作成功');
                        that.doQuery();
                    }
                },null,'',true);
            }).catch(() =>{})
        },
        openDialog(){
            let array = this.$refs.table.getSelectItem();
            if (array.length !== 1) {
                this.$message.error("请选择一条数据");
                return false;
            }
            if(array[0].state != 1 && array[0].state != 2){
                this.$message.error("已预约/已报到才能修改到货厂商");
                return false;
            }
            this.info = this.common.copyObj(array[0]);
            this.info.oldFromTenantName = this.info.fromTenantName;
            this.info.fromTenantName = null;
            this.opDialog(true);
        },
        async updateWmsAppointFromTenantName(){
            let param = this.info;
            await this.common.postUrl("wmsAppointTF", "updateWmsAppointFromTenantName", param, null,null,'',true);
            await this.doQuery();
            this.opDialog(false);
            this.$message.success('操作成功');
        },
        opDialog(flag){
            this.showDialog = flag;
        },
        gotoLog()
        {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length != 1) {
                this.$message.error("请选择一条数据！");
                return;
            }
            let data = selectData[0];
            this.$emit("openTab",{
                urlId: 'wmsAppoint' + 'Detail' + data.appointId,
                query: {
                    logId: data.appointId,
                    logType: enumData.LOG_TYPE.WMS_APPOINT,
                },
                urlName: "仓库预约" + "操作日志",
                urlPathName: "/operateLog",
                urlPath: "/pt/operateLog/operateLog.vue"});
        },
        showBigImg(data)
        {
            if (this.common.isBlank(data.url))
            {
                this.$message.error("图片为空！");
                return false;
            }
            this.srcList = [];
            this.srcList.push(data.url);
            this.$refs.viewer.show();
        },
    },
    computed:{
        formData(){
            return [
                // 仓库、到货厂商、车牌号码、车长、司机手机、预计到达时间、实际报到时间（预约状态已有）
                {"name":"仓库","model":"workId","type":"select","options":this.workList,"label":"workName","value":"workId","placeholder":"仓库","method":"doQuery","isshow":true},
                {"name":"到货厂商","model":"fromTenantName","type":"input","placeholder":"到货厂商","isshow":true},
                {"name":"车牌号码","model":"plateNumber","type":"input","placeholder":"车牌号码","isshow":true},
                {"name":"车长","model":"vehicleLength","type":"select","options":this.vehicleLengthData,"label":"codeName","value":"codeValue","placeholder":"车长","method":"doQuery","isshow":true},
                {"name":"司机手机","model":"billId","type":"input","placeholder":"司机手机","isshow":true},
                {"name":"预计到达时间","model":"daterange1","type":"daterange","isshow":true},
                {"name":"实际报到时间","model":"daterange2","type":"daterange","isshow":true},
                {"name":"预约状态","model":"state","type":"select","options":this.stateData,"label":"codeName","value":"codeValue","placeholder":"预约状态","method":"doQuery","isshow":true},
            ]
        }
    },
}
