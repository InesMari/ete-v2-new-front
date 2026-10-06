import tableCommon from "@/components/table/tableCommon.vue";
import myElDatePicker from "@/components/myElDatePicker/index.js";
import myImport from "@/components/myImport/myImport";
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";

export default {
    name: 'custAppointManage',
    data() {
        return {
            head: [
                {"name": "操作", "code": "caozuo", "width": "220", "type": "diy","excelField":false},
                {"name": "仓库", "code": "workName", "width": "300", "type": "text"},
                {"name": "预约编号", "code": "appointNum", "width": "120", "type": "text"},
                {"name": "客户", "code": "custName", "width": "150", "type": "text"},
                {"name": "车牌号码", "code": "plateNumber", "width": "120", "type": "text"},
                {"name": "车长", "code": "vehicleLengthName", "width": "120", "type": "text"},
                {"name": "预计到达时间", "code": "expectArriveDate", "width": "160", "type": "text"},
                {"name": "实际到达时间", "code": "actualArriveDate", "width": "160", "type": "text"},
                {"name": "状态", "code": "stateName", "width": "120", "type": "text"},
                {"name": "货物类型", "code": "goodsType", "width": "120", "type": "text"},
                {"name": "批次号", "code": "batchNum", "width": "120", "type": "text"},
                {"name": "货物件数", "code": "goodsCount", "width": "120", "type": "text"},
                {"name": "货物托数", "code": "goodsPallet", "width": "120", "type": "text"},
                {"name": "司机", "code": "driverName", "width": "120", "type": "text"},
                {"name": "手机号", "code": "billId", "width": "120", "type": "text"},
                {"name": "预约时间", "code": "createDate", "width": "160", "type": "text"},
            ],
            loadParam: {
                workId:'',
                custName:'',
                plateNumber:'',
                vehicleLength:'',
                billId:'',
                daterange1:'',
                state:'',
            },
            stateData:[],
            workList:[],
            vehicleLengthData:[],
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.init();
        this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        myElDatePicker,
        myImport,
        searchList,
    },
    /**
     * 绑定函数
     */
    methods: {
        init() {
            let that = this;
            //入库状态
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "CUST_APPOINT_STATE"}, function (data) {
                that.stateData = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VEHICLE_LENGTH"}, function (data) {
                that.vehicleLengthData = data;
            });
            // 仓库
            this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {parentFlag:1,regionFlag:1}, function (data) {
                that.workList = data;
            });
            this.userInfo = this.common.userInfo();
            if(this.userInfo.workId){
                this.loadParam.workId = this.userInfo.workId;
            }
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

            await this.$refs.table.load("wmsCustAppointTF", "queryWmsAppointInfoPage", this.loadParam);
        },
        updateWmsAppointInfoState(item,state){
            let msg = '';
            if(item.state!=1){
                this.$message.error('预约信息不是已预约状态');
                return;
            }
            if(state==1){
                msg = `
                    <p style="text-align:center;">预约编号：${item.appointNum}</p>
                    <p style="text-align:center;">客户：${item.custName}</p>
                    <p style="text-align:center;">状态从[已预约]变更为[已到达]</p>
                    <p style="text-align:center;">是否继续？</p>
                    `;
            }else{
                msg = `
                    <p style="text-align:center;">预约编号：${item.appointNum}</p>
                    <p style="text-align:center;">客户：${item.custName}</p>
                    <p style="text-align:center;">状态从[已预约]变更为[未到达]</p>
                    <p style="text-align:center;">是否继续？</p>
                    `;
            }
            let that = this;
            this.$confirm(msg, "操作提示" ,{
                confirmButtonText: '确认',
                cancelButtonText: '关闭',
                dangerouslyUseHTMLString:true,
                center: true
            }).then(() =>{
                that.common.postUrl("wmsCustAppointTF", "updateWmsAppointInfoState", {id:item.id,state:state}, function (data_) {
                    if (that.common.isNotBlank(data_)) {
                        that.$message.success('操作成功');
                        that.doQuery();
                    }
                },null,'',true);
            }).catch(() =>{})
        },
        download(){
            this.$refs.table.downloadExcelFile('客户预约');
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
                urlId: 'custAppoint' + 'Detail' + data.id,
                query: {
                    logId: data.id,
                    logType: enumData.LOG_TYPE.CUST_APPOINT,
                },
                urlName: "客户预约" + "操作日志",
                urlPathName: "/operateLog",
                urlPath: "/pt/operateLog/operateLog.vue"});
        },

    },
    computed:{
        formData(){
            return [
                // 仓库、到货厂商、车牌号码、车长、司机手机、预计到达时间、实际报到时间（预约状态已有）
                {"name":"仓库","model":"workId","type":"select","options":this.workList,"label":"workName","value":"workId","placeholder":"仓库","method":"doQuery","isshow":true},
                {"name":"客户","model":"custName","type":"input","placeholder":"客户","isshow":true},
                {"name":"车牌号码","model":"plateNumber","type":"input","placeholder":"车牌号码","isshow":true},
                {"name":"车长","model":"vehicleLength","type":"select","options":this.vehicleLengthData,"label":"codeName","value":"codeValue","placeholder":"车长","method":"doQuery","isshow":true},
                {"name":"司机手机","model":"billId","type":"input","placeholder":"司机手机","isshow":true},
                {"name":"预计到达时间","model":"daterange1","type":"daterange","isshow":true},
                {"name":"预约状态","model":"state","type":"select","options":this.stateData,"label":"codeName","value":"codeValue","placeholder":"预约状态","method":"doQuery","isshow":true},
            ]
        }
    },
}
