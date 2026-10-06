import tableCommon from "@/components/table/tableCommon.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import fileViewer from '@/components/myFile/file-viewer.vue';
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";
import MyImport from "@/components/myImport/myImport.vue";
import myImportDown from "@/components/myImportDown/myImportDown.vue";

export default {
    name: 'vehiclePositionManage',
    data() {
        return {
            head: [
                {"name": "车牌号码", "code": "plateNumber", "width": "100", "type": "text"},
                {"name": "最后定位时间", "code": "gpsTime", "width": "150", "type": "text"},
                {"name": "车辆位置", "code": "gpsLocation", "width": "350", "type": "text"},
                {"name": "派车单号", "code": "waybillNum", "width": "150", "type": "diy"},
                {"name": "预计到达时间", "code": "duration", "width": "150", "type": "text"},
                {"name": "距离目的地", "code": "distance", "width": "150", "type": "text"},
            ],
            query: {
                plateNumber: '',
                addressStr: '',
            },
            importInfo:{
                plateNumberIndex: 12,
                addressStrIndex: 7,
                gpsLocationIndex: 20,
                distanceIndex: 21,
                durationIndex: 17,
            },
            showModify:false,
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.$nextTick(()=>{
            this.$refs.table.changeTop(0);
        })
    },
    /**
     * 组件
     */
    components: {
        myImportDown,
        MyImport,
        myFileModel,
        fileViewer,
        tableCommon,
        searchList
    },
    /**
     * 绑定函数
     */
    methods: {
        async doQuery(query = this.query) {
            if (this.common.isBlank(query.plateNumbers)) {
                this.$message.error("请至少输入一个正确车牌再查询！");
                return;
            }
            this.query = query;
            let {items} = await this.$refs.table.load("sinoiovBusinessTF", "queryVehiclePositionPage", this.query);
            this.$refs.table.resetData(items);
        },
        openDetail(data)
        {
            this.$emit("openTab",{
                urlId: 'waybillDetail' + data.waybillId,
                query: {waybillId: data.waybillId},
                urlName: "派车单详情",
                urlPathName: "/detail",
                urlPath: "/pt/ord/waybill/detail/waybillDetail.vue"});
        },
        /**
         * 导出
         */
        downloadExcel() {
            this.$refs.table.downloadExcelFile();
        },
        myImportBudgetCallback() {
            this.$message.success("上传成功");
        },
        showModifyDialog(tag){
            this.showModify = tag;
        },
    },
    computed:{
      formData(){  
            return [
                {"name":"车牌号码","model":"plateNumbers","type":"textarea","isshow":true},
                {"name":"目的地地址","model":"addressStr","type":"input","isshow":true},
            ]
        }
    },
}
