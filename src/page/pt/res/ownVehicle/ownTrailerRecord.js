import fileViewer from '@/components/myFile/file-viewer.vue';
import printJS from 'print-js'

export default {
    name: 'ownTrailerRecord',
    data() {
        return {
            info: {},
            insuranceInfo: {},
            maintenance: {},
            repairList: [],
            insuranceInfoShow: false,
            maintenanceShow: false,
            srcList: [],    //查看器图片列表
        }
    },
    mounted() {
        this.loadVehicleInfoById(this.$route.query.vehicleId);
    },
    components: {
        fileViewer,
    },
    methods: {
        async loadVehicleInfoById(vehicleId) {
            let data = await this.common.postUrl("resVehicleInfoTF", 'loadVehicleInfoById', { id: vehicleId });
            this.info = data.info;
            this.insuranceInfo = data.insuranceInfo;
            this.insuranceInfoShow = this.common.isNotBlank(this.insuranceInfo);
            this.maintenance = data.maintenance;
            this.maintenanceShow = this.common.isNotBlank(this.maintenance);
            this.repairList = data.repairList;

            this.$forceUpdate();
        },
        // 查看示例图片大图
        showBig() {
            // 设置示例图片列表
            this.srcList = [this.info.carBodyImgPath_big];
            this.$refs.viewer.show();
        },
        /**
         * 打印
         */
        print() {
            printJS({
                printable: 'printTable',
                type: 'html',
                css: '/static/css/ownCarRecord.css',  //真实路径/public/static/css/printWaybill.css
                scanStyles: false
            })
        },
    },
}