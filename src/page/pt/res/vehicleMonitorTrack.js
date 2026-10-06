import mapTrack from "@/components/mapTrack/mapTrack.vue";
export default {
    name: 'vehicleMonitorTrack',
    data()
    {
        return {
            map: null,
            query: {
                plateNumber: '',
                startDate: '',
                endDate: '',
            },
        }
    },
    /**
     * 组件
     */
    components: {
        mapTrack
    },
    computed: {
        pickerOptions() {
            const start = this.query.startDate ? new Date(this.query.startDate).getTime() : null;
            const sevenDays = 7 * 24 * 60 * 60 * 1000;
            return {
                disabledDate(time) {
                    if (!start) return false;
                    const maxDate = start + sevenDays;
                    return time.getTime() > maxDate || time.getTime() < start;
                }
            };
        }
    },
    /**
     * 初始化
     */
    mounted()
    {

    },
    /**
     * 绑定函数
     */
    methods: {
        /**
         * 初始化
         */
        init() {
            
        },
        /**
         * 查询车辆
         */
        async doQuery()
        {
            if(!this.query.plateNumber){
                this.$message.error("请输入车牌号码");
                return;
            }
            if(!this.query.startDate){
                this.$message.error("请选择起始时间");
                return;
            }
            if(!this.query.endDate){
                this.$message.error("请选择结束时间");
                return;
            }
            let data = await this.common.postUrl("monitorTF", "getAllGpsInfoList", this.query,null,null,null,true);
            if(data.length == 0){
                this.$message.error("该车辆在该时间段内没有轨迹数据");
                return;
            }
            this.$refs.mapTrack.setData(data);
        },
    },
    
}
