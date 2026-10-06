import tableCommon from "@/components/table/tableCommon.vue";
import myElDatePicker from "@/components/myElDatePicker/index.js";
import myImport from "@/components/myImport/myImport";
import searchList from "@/components/searchList/searchList.vue";


export default {
    name: 'sensorDataInfoManage',
    data() {
        return {
            head: [
                {"name": "设备编号", "code": "deviceAddress", "width": "150", "type": "text"},
                {"name": "设备名称", "code": "name", "width": "200", "type": "text"},
                {"name": "设备位置", "code": "location", "width": "250", "type": "text"},
                {"name": "温度", "code": "temperature", "width": "120", "type": "text"},
                {"name": "湿度", "code": "humidity", "width": "120", "type": "text"},
                {"name": "电量", "code": "electricity", "width": "120", "type": "text"},
                {"name": "记录时间", "code": "recordTime", "width": "150", "type": "text"}
            ],
            loadParam: {
                recordDate:this.initRecordDate(),
                deviceAddress:'',
                name:'',
            },
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        myElDatePicker,
        myImport,
        searchList
    },
    /**
     * 绑定函数
     */
    methods: {
        doQuery(query=this.loadParam) {
            this.loadParam = query;
            if(this.common.isNotBlank(this.loadParam.recordDate) && this.loadParam.recordDate.length==2){
                this.loadParam.startRecordDate = this.loadParam.recordDate[0];
                this.loadParam.endRecordDate = this.loadParam.recordDate[1];
            }else{
                this.loadParam.startRecordDate = '';
                this.loadParam.endRecordDate = '';
            }
            this.$refs.table.load("sensorTF", "querySensorDataPage", this.loadParam);
        },
        initRecordDate(){
            const start = new Date();
            const end = new Date();
            start.setMonth(start.getMonth()-1);
            let time1 = this.common.formatTime(start, "yyyy-MM-dd HH:mm:ss");
            let time2 = this.common.formatTime(end, "yyyy-MM-dd 23:59:59");
            return [time1,time2];
        },
        clearFn(){
            this.loadParam={
                recordDate:this.initRecordDate(),
                deviceAddress:'',
                name:'',
            };
        },
        /**
         * 导出
         */
        downloadExcel() {
            this.$refs.table.downloadExcelFile();
        },
    },
    computed:{
        formData(){
            return [
                {"name":"记录时间","model":"recordDate","type":"datetimerange","isshow":true,"row":2},
                {"name":"设备编号","model":"deviceAddress","type":"input","placeholder":"设备编号","isshow":true},
                {"name":"设备名称","model":"name","type":"input","placeholder":"设备名称","isshow":true},
            ]
        }
    },
}
