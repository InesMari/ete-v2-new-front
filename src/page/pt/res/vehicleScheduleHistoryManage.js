import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import $echarts from 'echarts'

export default {
    name: 'vehicleScheduleHistoryManage',
    data()
    {
        return {
            head: [
                {"name": "运力上报编号", "code": "vehicleScheduleNum", "width": "150", "type": "text"},
                {"name": "供应商名称", "code": "tenantName", "width": "250", "type": "text"},
                {"name": "车牌号码", "code": "plateNumber", "width": "90", "type": "text"},
                {"name": "车型", "code": "vehicleTypeName", "width": "90", "type": "text"},
                {"name": "车长", "code": "vehicleLengthName", "width": "90", "type": "text"},
                {"name": "预计出车时间", "code": "scheduleTime", "width": "150", "type": "text"},
                {"name": "预计到达起始地", "code": "baseCityIdName", "width": "150", "type": "text"},
                {"name": "起始地城市", "code": "beginCityName", "width": "200", "type": "text"},
                {"name": "常运线路目的地城市", "code": "endCityName", "width": "300", "type": "text"},
                {"name": "司机", "code": "driverName", "width": "150", "type": "text"},
                {"name": "司机手机号", "code": "driverPhone", "width": "150", "type": "text"},
                {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
                {"name": "匹配状态", "code": "isMatch", "width": "100", "type": "text"},
                {"name": "生效状态", "code": "stateName", "width": "100", "type": "text"},
                {"name": "备注", "code": "remark", "width": "100", "type": "text"},
            ],
            info: {},
            query: {isMatch: ''},
            showDialog: false,
            vehicleLengthData: [],
            vehicleTypeData: [],
            matchData: [
                {"codeValue": 0, "codeName": "未匹配"},
                {"codeValue": 1, "codeName": "已匹配"},
            ],
            text: '切换图形',
            showList: true, //默认展示列表
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.initData();
        //产品大佬要求进来展示图标，这里自动切换下
        this.changeShowStyle();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        searchList
    },
    /**
     * 绑定函数
     */
    methods: {
        /**
         * 初始化静态数据
         */
        async initData()
        {
            this.vehicleLengthData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VEHICLE_LENGTH"});
            this.vehicleTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VEHICLE_TYPE"});
        },
        /**
         * 查询列表
         * query  空值时，默认为页面配置参this.query，传值时为传值参
         */
        doQuery(query = this.query)
        {
            this.query = query;
            this.query.loadHistory = 1;
            if (this.common.isNotBlank(this.query.scheduleTime) && this.query.scheduleTime.length == 2)
            {
                this.query.startScheduleTime = this.query.scheduleTime[0];
                this.query.endScheduleTime = this.query.scheduleTime[1];
            } else
            {
                this.query.startScheduleTime = '';
                this.query.endScheduleTime = '';
            }
            this.$refs.table.load("vehicleScheduleService", "queryVehicleSchedulePage", this.query);
        },
        dblclickItem(data)
        {
            this.info = data;
            this.open(true);
        },
        open(flag)
        {
            this.showDialog = flag;
            this.$forceUpdate();
        },
        async changeShowStyle()
        {
            if (this.showList)
            {
                //页面展示问题导致后面$nextTick再处理表格
                this.text = '切换列表';
            }
            else
            {
                this.text = '切换图形';
                await this.doQuery();
            }
            this.showList = !this.showList;
            //需要页面渲染完毕才处理图标
            if (!this.showList)
            {
                this.$nextTick(async() => {
                    await this.initEchart();
                })
            }
            this.$forceUpdate();
        },
        async initEchart(){
            this.total = await this.common.postUrl("vehicleScheduleService", "queryVehicleScheduleData", {isLoadOtherData: 1, loadHistory: 1});
            //柱形图
            $echarts.init(document.getElementById("chart1")).setOption({
                title: {
                    text: '按供应商',
                    left: '10%',
                },
                legend: {},
                tooltip: {},
                xAxis: {
                    type: 'category',
                    data: this.total.tenantNameList
                },
                yAxis: {},
                series: [
                    {
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'top'
                        },
                        data: this.total.tenantList
                    }
                ]
            });
            $echarts.init(document.getElementById("chart2")).setOption({
                title: {
                    text: '按起始地(基地)',
                    left: '10%',
                },
                legend: {},
                tooltip: {},
                xAxis: {
                    type: 'category',
                    data: this.total.baseCityhNameList
                },
                yAxis: {},
                series: [
                    {
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'top'
                        },
                        data: this.total.baseCityhList
                    }
                ]
            });
        },

    },
    computed: {
        formData()
        {
            return [
                {"name":"供应商名称","model":"tenantName","type":"input","isshow":true},
                {"name":"车长","model":"vehicleLength","type":"select","options":this.vehicleLengthData,"label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                {"name":"车型","model":"vehicleType","type":"select","options":this.vehicleTypeData,"label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                {"name":"匹配状态","model":"isMatch","type":"select","options":this.matchData,"label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
                {"name":"预计出车时间","model":"scheduleTime","type":"daterange","isshow":true},
                {"name":"起始地","model":"beginCity","type":"input","isshow":true},
                {"name":"目的地","model":"endCity","type":"input","isshow":true},
            ]
        }
    },
}
