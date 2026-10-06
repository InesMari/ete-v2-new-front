import tableCommon from "@/components/table/tableCommon.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'ownVehicleCheckManage',
    data() {
        return {
            head: [
                {"name": "派车单号", "code": "waybillNum", "width": "120", "type": "diy"},
                {"name": "运作时间", "code": "workDate", "width": "160", "type": "text"},
                {"name": "线路名称", "code": "routeName", "width": "160", "type": "text"},
                {"name": "车头号码", "code": "plateNumber", "width": "90", "type": "text"},
                {"name": "挂车号码", "code": "trailerNumber", "width": "90", "type": "text"},
                {"name": "司机", "code": "driverName", "width": "120", "type": "text"},
                {"name": "开始里程", "code": "startMileage", "width": "90", "type": "text"},
                {"name": "结束里程", "code": "endMileage", "width": "90", "type": "text"},
                {"name": "里程数", "code": "mileage", "width": "90", "type": "text"},
                {"name": "是否异常", "code": "haveErrorName", "width": "90", "type": "text"},
                {"name": "点检状态", "code": "stateName", "width": "120", "type": "text"},
                {"name": "跟进人", "code": "followUserName", "width": "120", "type": "text"},
                {"name": "跟进意见", "code": "followRemark", "width": "120", "type": "text"},
                {"name": "跟进日期", "code": "followDate", "width": "120", "type": "text"},
                {"name": "处理人", "code": "doneUserName", "width": "120", "type": "text"},
                {"name": "处理意见", "code": "doneRemark", "width": "120", "type": "text"},
                {"name": "处理日期", "code": "doneDate", "width": "120", "type": "text"},
                {"name": "确认人", "code": "confirmUserName", "width": "120", "type": "text"},
                {"name": "确认意见", "code": "confirmRemark", "width": "120", "type": "text"},
                {"name": "确认日期", "code": "confirmDate", "width": "120", "type": "text"},
                {"name": "创建人", "code": "createUserName", "width": "120", "type": "text"},
                {"name": "开始提交日期", "code": "startSubmitDate", "width": "120", "type": "text"},
                {"name": "结束提交日期", "code": "endSubmitDate", "width": "120", "type": "text"},
            ],
            loadParam: {
                type:2,
                waybillNum: '',
                routeName:'',
                plateNumber:'',
                trailerNumber:'',
                driverName:'',
                states:[],
                submitDate:'',
                haveError:'',
            },
            stateData:[],
            whetherData:[],
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initStaticData();
        this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        myFileModel,
        searchList
    },
    /**
     * 绑定函数
     */
    methods: {
        doQuery(query=this.loadParam) {
            this.loadParam = query;
            if(this.common.isNotBlank(this.loadParam.submitDate) && this.loadParam.submitDate.length==2){
                this.loadParam.startDate = this.loadParam.submitDate[0];
                this.loadParam.endDate = this.loadParam.submitDate[1];
            }else{
                this.loadParam.startDate = '';
                this.loadParam.endDate = '';
            }
            this.$refs.table.load("resVehicleInfoTF", "queryVehicleCheckPage", this.loadParam);
        },
        //初始化页面的静态数据
        initStaticData(){
            let that = this;
            this.common.postUrl('commonTF','getSysStaticData',{'codeType':'VEHICLE_CHECK_STATE'},function (data) {
                that.stateData = data;
            });
            this.common.postUrl('commonTF','getSysStaticData',{'codeType':'WHETHER'},function (data) {
                that.whetherData = data;
            });
        },
        clear() {
            this.loadParam = {};
        },

        confirmOrdWaybillVehicleCheck(){
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length !== 1){
                this.$message.error("请选择一条需要确认的自有车点检数据！");
                return false;
            }
            if (selectData[0].state != 0&&selectData[0].state != 1) {
                this.$message.error("自有车点检数据不是待确认/待跟进状态！");
                return false;
            }
            if(!selectData[0].endSubmitDate){
                this.$confirm("还未进行收车点检，是否确认处理！", "提示").then(() =>{
                    this.toConfirmCheck(selectData)
                }).catch(() =>{})
                return false;
            }
            this.toConfirmCheck(selectData);
        },
        toConfirmCheck(selectData){
            this.$emit("openTab",{
                urlId: 'ownVehicleCheckDetail' + new Date().getTime(),
                query: {id:selectData[0].id,type:1},//type 1 确认处理 2 查看 3 打印
                urlName: "确认处理",
                urlPathName: "/ownVehicleCheckDetail",
                urlPath: "/pt/ord/vehicleCheck/ownVehicleCheckDetail.vue"});

        },
        toDetail(data){
            this.$emit("openTab",{
                urlId: 'ownVehicleCheckDetail' + new Date().getTime(),
                query: {id:data.id,type:2},//type 1 确认处理 2 查看 3 打印
                urlName: "点检详情",
                urlPathName: "/ownVehicleCheckDetail",
                urlPath: "/pt/ord/vehicleCheck/ownVehicleCheckDetail.vue"});
        },
        toWaybillDetail(item)
        {
            if (item.type == 2)
            {
                this.$emit('openTab', {
                    urlName: '查看配送',
                    urlId: 'wmsWaybillDetail' + item.waybillId,
                    urlPathName: "/wms/waybill",
                    urlPath: "/pt/wms/waybill/wmsWaybillDetail.vue",
                    query: {id: item.waybillId}
                });
            }
            else
            {
                this.$emit("openTab",{
                    urlId: 'waybillDetail' + item.waybillId,
                    query: {waybillId: item.waybillId},
                    urlName: "派车单详情",
                    urlPathName: "/detail",
                    urlPath: "/pt/ord/waybill/detail/waybillDetail.vue"});
            }
        },
        toPrint(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一条需要打印的自有车点检数据！");
                return false;
            }
            if (selectData[0].state != 2&&selectData[0].state != 3) {
                this.$message.error("自有车点检数据不是已确认/已处理状态！");
                return false;
            }
            this.$emit("openTab",{
                urlId: 'ownVehicleCheckDetail' + new Date().getTime(),
                query: {id:selectData[0].id,type:3},//type 1 点检 2 查看 3 打印
                urlName: "点检打印",
                urlPathName: "/ownVehicleCheckDetail",
                urlPath: "/pt/ord/vehicleCheck/ownVehicleCheckDetail.vue"});
        },
        download(){
            this.$refs.table.downloadExcelFile('自有车点检管理列表');
        },

    },
    computed:{
        formData(){
            return [
                {"name":"派车单号","model":"waybillNum","type":"input","placeholder":"派车单号","isshow":true},
                {"name":"线路名称","model":"routeName","type":"input","placeholder":"线路名称","isshow":true},
                {"name":"车头号码","model":"plateNumber","type":"input","placeholder":"车头号码","isshow":true},
                {"name":"司机","model":"driverName","type":"input","placeholder":"司机","isshow":true},
                {"name":"点检状态","model":"states","type":"select","options":this.stateData,"label":"codeName","value":"codeValue","multiple":true,"placeholder":"点检状态","method":"doQuery","isshow":true},
                {"name":"提交日期","model":"submitDate","type":"daterange","isshow":true},
                {"name":"是否有异常","model":"haveError","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","placeholder":"是否有异常","method":"doQuery","isshow":true},
            ]
        }
    },
}
