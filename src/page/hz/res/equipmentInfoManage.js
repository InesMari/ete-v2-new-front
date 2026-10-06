import tableCommon from "@/components/table/tableCommon.vue";
import scrollTable from "@/components/scrollTable/scrollTable.vue";
import myImport from "@/components/myImport/myImport";
import innerTab from "@/components/innerTab/innerTab.vue"
import notFindPage from "@/page/notFindPage/notFindPage.vue"
import searchList from "@/components/searchList/searchList.vue";
// import BMap from 'BMap'

export default {
    name: 'equipmentInfoManage',
    data() {
        return {
            head: [
                {"name": "操作", "code": "", "width": "150", "type": "diy"},
                {"name": "车牌号码", "code": "plateNumber", "width": "110", "type": "text"},
                {"name": "是否在线", "code": "isOnlineName", "width": "60", "type": "text"},
                {"name": "设备状态", "code": "vehicleStateName", "width": "110", "type": "text"},
                {"name": "定位时间", "code": "gpsTime", "width": "150", "type": "text"},
                {"name": "最新位置", "code": "location", "width": "300", "type": "text"},
                {"name": "备注", "code": "remark", "width": "110", "type": "text"},
            ],
            loadParam: {},//列表查询参数
            runTypeData: [
                {"codeValue":1,"codeName":"运作中"},
                {"codeValue":2,"codeName":"空闲中"},
            ],//运作状态
        }
    },
    /**
     * 初始化
     */
    async mounted() {
        await this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        myImport,
        notFindPage,
        innerTab,
        searchList,
        scrollTable
    },
    /**
     * 绑定函数
     */
    methods: {
        /**
         * 列表查询
         * @returns {Promise<void>}
         */
        async doQuery(query=this.loadParam) {
            this.loadParam = query;
            if(this.common.isNotBlank(this.loadParam.daterange) && this.loadParam.daterange.length==2){
                this.loadParam.stratDate = this.loadParam.daterange[0];
                this.loadParam.endDate = this.loadParam.daterange[1];
            }else{
                this.loadParam.stratDate = '';
                this.loadParam.endDate = '';
            }
            await this.$refs.table.load("equipmentTF", "queryEquipmentData", this.loadParam);
        },
        /**
         * 清空查询条件
         */
        clear() {
            this.loadParam = {};
        },

        /** 查看位置 */
        toMonitor(item) {
            if(this.common.isBlank(item.plateNumber)){
                this.$message.error("该设备没有绑定车辆！");
                return;
            }
            this.$emit("openTab",{
                urlId: 'vehicleMonitor' + item.vehicleId,
                query: {plateNumber:item.plateNumber},
                urlName: "车辆监控",
                urlPathName: "/res",
                urlPath: "/pt/res/vehicleMonitor.vue"});
        },


    },
    computed:{
        formData(){
            return [
                {"name":"车牌号码","model":"plateNumber","type":"input","placeholder":"车牌号码","isshow":true},
                {"name":"设备状态","model":"runType","type":"select","options":this.runTypeData,"label":"codeName","value":"codeValue","placeholder":"设备状态","method":"doQuery","isshow":true},
                {"name":"定位日期","model":"daterange","type":"daterange","isshow":true},
                {"name":"最新位置","model":"location","type":"input","placeholder":"最新位置","isshow":true},
            ]
        }
    },
}
