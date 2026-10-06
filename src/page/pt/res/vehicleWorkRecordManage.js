import tableCommon from "@/components/table/tableCommon.vue";
import myImport from "@/components/myImport/myImport.vue";
import selectWork from "@/page/pt/wms/selectWork.vue";

export default {
    name: 'vehicleWorkRecordManage',
    data()
    {
        return {
            head: [
                {"name": "车牌号码", "code": "plateNumber", "width": "150", "type": "text"},
                {"name": "作业点名称", "code": "workName", "width": "150", "type": "text"},
                {"name": "详情地址", "code": "workAddress", "width": "250", "type": "text"},
                {"name": "进入时间", "code": "enterDate", "width": "150", "type": "text"},
                {"name": "离开时间", "code": "leaveDate", "width": "150", "type": "text"},
                {"name": "用时", "code": "timeConsuming", "width": "150", "type": "text"},
            ],
            query: this.initQuery(this.$route.query),
            showSelWork: false,
        }
    },
    mounted()
    {
        this.initSelWork();
        this.initStaticData();
    },
    components: {
        selectWork,
        myImport,
        tableCommon,
    },
    methods: {
        initSelWork(){
            this.userInfo = this.common.userInfo();
            if(!this.userInfo.workId){
                this.showSelWork = true;
            }else{
                this.firstIn = false;
                this.doQuery();
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
            this.doQuery();
        },
        initQuery(query)
        {
            return this.query = {
                plateNumber: '',
                workName: '',
                enterDate: null,
                leaveDate: null,
            };
        },
        async initStaticData()
        {

        },
        doQuery()
        {
            if(this.common.isNotBlank(this.query.enterDate) && this.query.enterDate.length === 2){
                this.query.enterTimeBegin = this.query.enterDate[0];
                this.query.enterTimeEnd = this.query.enterDate[1];
            }else{
                this.query.enterTimeBegin = '';
                this.query.enterTimeEnd = '';
            }
            if(this.common.isNotBlank(this.query.leaveDate) && this.query.leaveDate.length === 2){
                this.query.leaveTimeBegin = this.query.leaveDate[0];
                this.query.leaveTimeEnd = this.query.leaveDate[1];
            }else{
                this.query.leaveTimeBegin = '';
                this.query.leaveTimeEnd = '';
            }
            this.$refs.table.load("vehicleWorkService", "queryVehicleWorkRecordPage", this.query);
        },
        goto(){
            let item = {
                urlName: '监控维护',
                urlId: 'vehicleWorkManage',
                urlPathName: "/vehicleWorkManage",
                urlPath: "/pt/res/vehicleWorkManage.vue",
                query: {},
            }
            this.$emit('openTab', item);
        },
        dblclickItem(data)
        {
            let item = {
                urlName: '车辆监控护详情',
                urlId: 'vehicleWorkMonitor',
                urlPathName: "/vehicleWorkMonitor",
                urlPath: "/pt/res/vehicleWorkMonitor.vue",
                query: {id: data.id},
            }
            this.$emit('openTab', item);
        },
        exportWmsPersonCost()
        {
            this.$refs.table.downloadExcelFile();
        },
    },
}
