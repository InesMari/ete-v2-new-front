import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import $echarts from 'echarts'

export default {
    name: 'vehicleScheduleManage',
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
            total: {vehicleScheduleMatch: 0, vehicleScheduleUnMatch: 0},
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
            showHistoryButton: false, //展示历史按钮
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.initData();
        let isMatch = this.$route.query.isMatch
        if (this.common.isNotBlank(isMatch)){
            this.query.isMatch = Number(isMatch);
            this.doQuery();
        }else{
            this.changeShowStyle();
        }
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
        initData()
        {
            let that = this;
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VEHICLE_LENGTH"}, function (data)
            {
                that.vehicleLengthData = data;
            });
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "VEHICLE_TYPE"}, function (data)
            {
                that.vehicleTypeData = data;
            });
        },
        /**
         * 查询列表
         * query  空值时，默认为页面配置参this.query，传值时为传值参
         */
        doQuery(query = this.query)
        {
            this.query = query;
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
            this.queryVehicleScheduleData();
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
        async queryVehicleScheduleData()
        {
            this.total = await this.common.postUrl("vehicleScheduleService", "queryVehicleScheduleData");
            this.$forceUpdate();
        },
        async go(type)
        {
            this.query.isMatch = type;
            await this.doQuery();
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
            this.showHistoryButton = this.showList;
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
        gotoHistory()
        {
            this.$emit("openTab",{
                urlId: 'vehicleScheduleHistoryManage',
                query: {},
                urlName: "历史运力管理列表",
                urlPathName: "/res",
                urlPath: "/pt/res/vehicleScheduleHistoryManage.vue"});
        },
        async initEchart(){
            this.total = await this.common.postUrl("vehicleScheduleService", "queryVehicleScheduleData", {isLoadOtherData: 1});
            //饼图
            $echarts.init(document.getElementById("chart1")).setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    top: '5%',
                    left: 'center'
                },
                series: [{
                    name: '运力数据',
                    type: 'pie',
                    radius: ['30%', '60%'],
                    avoidLabelOverlap: false,
                    label: {
                        formatter: '{b} {c}',
                        show: true,
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontWeight: 'bold'
                        }
                    },
                    data: [
                        { value: this.total.vehicleScheduleUnMatch, name: '未匹配' },
                        { value: this.total.vehicleScheduleMatch, name: '已匹配' },
                    ]
                }]
            });
            //折线图
            $echarts.init(document.getElementById("chart2")).setOption({
                title: {
                    text: '按车型',
                    left: '10%',
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {},
                xAxis: {
                    type: 'category',
                    data: this.total.vehicleLengthNameList
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '未匹配',
                        type: 'line',
                        smooth: true,
                        data: this.total.vehicleLengthUnMatchList
                    },
                    {
                        name: '已匹配',
                        type: 'line',
                        smooth: true,
                        data: this.total.vehicleLengthMatchList
                    }
                ]
            });
            //柱形图
            $echarts.init(document.getElementById("chart3")).setOption({
                title: {
                    text: '按起始地',
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
                        name: '未匹配',
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'top'
                        },
                        data: this.total.baseCityUnMatchList
                    },
                    {
                        name: '已匹配',
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'top'
                        },
                        data: this.total.baseCityMatchList
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


