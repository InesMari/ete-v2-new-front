import tableCommon from "@/components/table/tableCommon.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import searchList from "@/components/searchList/searchList.vue";

export default {
    name: 'vehicleCheckManage',
    data() {
        return {
            head: [
                {"name": "派车单号", "code": "waybillNum", "width": "120", "type": "text"},
                {"name": "提交日期", "code": "submitDate", "width": "120", "type": "text"},
                {"name": "所属车队", "code": "tenantName", "width": "180", "type": "text"},
                {"name": "线路名称", "code": "routeName", "width": "160", "type": "text"},
                {"name": "车头号码", "code": "plateNumber", "width": "90", "type": "text"},
                {"name": "挂车号码", "code": "trailerNumber", "width": "90", "type": "text"},
                {"name": "司机", "code": "driverName", "width": "120", "type": "text"},
                {"name": "到厂时间", "code": "arriveDate", "width": "120", "type": "text"},
                {"name": "点检状态", "code": "confirmStateName", "width": "120", "type": "text"},
            ],
            loadParam: {
                waybillNum: '',
                tenantName: '',
                routeName:'',
                plateNumber:'',
                driverName:'',
                confirmStates:[],
                submitDate:'',
            },
            confirmStateData:[],
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
                this.loadParam.startSubmitDate = this.loadParam.submitDate[0];
                this.loadParam.endSubmitDate = this.loadParam.submitDate[1];
            }else{
                this.loadParam.startSubmitDate = '';
                this.loadParam.endSubmitDate = '';
            }
            this.$refs.table.load("ordWaybillTF", "queryOrdWaybillVehicleCheckPage", this.loadParam);
        },
        //初始化页面的静态数据
        initStaticData(){
            let that = this;
            this.common.postUrl('commonTF','getSysStaticData',{'codeType':'QUOTE_CONFIRM_STATE'},function (data) {
                that.confirmStateData = data;
            });
        },
        clear() {
            this.loadParam = {};
        },

        confirmOrdWaybillVehicleCheck(){
            let selectData = this.$refs.table.getSelectItem();
            if(selectData.length !== 1){
                this.$message.error("请选择一条需要确认的点检数据！");
                return false;
            }
            if (selectData[0].confirmState != 0) {
                this.$message.error("点检数据不是待确认状态！");
                return false;
            }
            this.$emit("openTab",{
                urlId: 'vehicleCheck' + new Date().getTime(),
                query: {id:selectData[0].id,type:1},//type 1 点检 2 查看 3 打印
                urlName: "点检确认",
                urlPathName: "/vehicleCheck",
                urlPath: "/pt/ord/vehicleCheck/vehicleCheckDetail.vue"});
        },
        toDetail(data){
            this.$emit("openTab",{
                urlId: 'vehicleCheck' + new Date().getTime(),
                query: {id:data.id,type:2},//type 1 点检 2 查看 3 打印
                urlName: "点检详情",
                urlPathName: "/vehicleCheck",
                urlPath: "/pt/ord/vehicleCheck/vehicleCheckDetail.vue"});
        },
        toPrint(){
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一条需要打印的点检数据！");
                return false;
            }
            if (selectData[0].confirmState != 1) {
                this.$message.error("点检数据不是已确认状态！");
                return false;
            }
            this.$emit("openTab",{
                urlId: 'vehicleCheck' + new Date().getTime(),
                query: {id:selectData[0].id,type:3},//type 1 点检 2 查看 3 打印
                urlName: "点检打印",
                urlPathName: "/vehicleCheck",
                urlPath: "/pt/ord/vehicleCheck/vehicleCheckDetail.vue"});
        },
        cancelConfirmOrdWaybillVehicleCheck() {
            let selectData = this.$refs.table.getSelectItem();
            if (selectData.length !== 1) {
                this.$message.error("请选择一条需要取消确认的点检数据！");
                return false;
            }
            if (selectData[0].confirmState != 1) {
                this.$message.error("点检数据不是已确认状态！");
                return false;
            }
            let that = this;
            this.$confirm("确认需要取消？", "提示").then(() =>{
                this.common.postUrl("ordWaybillTF", "cancelConfirmOrdWaybillVehicleCheck", selectData[0], function (data) {
                    that.doQuery();
                    that.$message.success("取消成功！");
                },null,'',true);
            });
        },

    },
    computed:{
        formData(){
            return [
                {"name":"派车单号","model":"waybillNum","type":"input","placeholder":"派车单号","isshow":true},
                {"name":"所属车队","model":"tenantName","type":"input","placeholder":"所属车队","isshow":true},
                {"name":"线路名称","model":"routeName","type":"input","placeholder":"线路名称","isshow":true},
                {"name":"车头号码","model":"plateNumber","type":"input","placeholder":"车头号码","isshow":true},
                {"name":"司机","model":"driverName","type":"input","placeholder":"司机","isshow":true},
                {"name":"点检状态","model":"confirmStates","type":"select","options":this.confirmStateData,"label":"codeName","value":"codeValue","multiple":true,"placeholder":"点检状态","method":"doQuery","isshow":true},
                {"name":"提交日期","model":"submitDate","type":"daterange","isshow":true},
            ]
        }
    },
}
