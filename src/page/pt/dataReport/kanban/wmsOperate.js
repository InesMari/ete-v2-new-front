import tableCommon from "@/components/table/tableCommon.vue";
import $echarts from 'echarts'
import enumData from "@/page/pt/enum";

export default {
    name: 'wmsOperate',
    data()
    {
        return {
            query: {
                workId: [-1],
                month: [this.common.formatDate.getMonth()], //默认当前月份
            },
            list:[],
            workData:[],
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.initData();
    },
    /**
     * 组件
     */
    components: {
        tableCommon,
        enumData
    },
    /**
     * 绑定函数
     */
    methods: {
        async initData(){
            this.workData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
            this.workData.unshift({workId: -1, workName: '全部'});
            this.workData.forEach(item => {
                item.disabled = true;
            });
            this.loadData();
        },
        async loadData(){

            if (this.common.isBlank(this.query.workId) || this.query.workId.length == 0)
            {
                this.$message.warning("物流中心为空不查询数据！");
                return;
            }
            let workIds = this.query.workId.join(",");
            let months = this.query.month.join(",");
            let data = await this.common.postUrl("wmsDataReportService", "loadWmsDataByCondition", {
                workIds: workIds,
                months: months
            });
            this.list = data.list;

            this.initEchart1(data);
            this.initEchart2(data);
            this.initEchart3(data);
            this.initEchart4(data);
        },
        async initEchart1(data){
            //柱形图
            let option = {
                color: ['#4cabce', '#91cc75'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: ['入库托数', '出库托数']
                },
                grid: {
                    top: 50,
                    left: 20,
                    right: 20,
                    bottom: 0,
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: data.storeHouseNameList,
                        axisLabel:{
                            interval:0, //展示全部条目
                            fontSize:12,
                            overflow:"breakAll",
                            width:60,
                            lineHeight:16,
                            rotate:45,
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '入库托数',
                        type: 'bar',
                        barGap: 0,
                        barWidth:'40%',
                        data: data.inOrderNumList
                    },
                    {
                        name: '出库托数',
                        type: 'bar',
                        barWidth:'40%',
                        data: data.outOrderNumList
                    },

                ]
            };
            $echarts.init(document.getElementById("chart1")).setOption(option);
        },  
        async initEchart2(data){
            //柱形图
            let option = {
                color: ['#4cabce', '#fac858'],
                // toolbox: {
                //     feature: {
                //         dataView: { show: true, readOnly: false },
                //         magicType: { show: true, type: ['line', 'bar'] },
                //         restore: { show: true },
                //         saveAsImage: { show: true }
                //     }
                // },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: ['短驳（车次）', '短驳平均装配率']
                },
                grid: {
                    top: 50,
                    left: 20,
                    right: 20,
                    bottom: 0,
                    containLabel: true,
                },
                xAxis: [
                    {
                        type: 'category',
                        data: data.storeHouseNameList,
                        axisLabel:{
                            interval:0, //展示全部条目
                            fontSize:12,
                            overflow:"breakAll",
                            width:60,
                            lineHeight:16,
                            rotate:45,
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '短驳（车次）',
                        min: 0,
                        axisLabel: {
                            formatter: '{value} '
                        },
                        splitLine: {
                            show: false // 取消 y 轴网格线
                        }
                    },
                    {
                        type: 'value',
                        name: '短驳平均装配率',
                        min: 0,
                        axisLabel: {
                            formatter: '{value}%'
                        }
                    }
                ],
                series: [
                    {
                        name: '短驳（车次）',
                        type: 'bar',
                        barGap: 0,
                        barWidth:'40%',
                        tooltip: {
                            valueFormatter: function (value) {
                                return value + ' ml';
                            }
                        },
                        data: data.wmsWaybillCountList
                    },
                    {
                        name: '短驳平均装配率',
                        type: 'line',
                        barWidth:'40%',
                        yAxisIndex: 1,
                        tooltip: {
                            valueFormatter: function (value) {
                                return value + ' °C';
                            }
                        },
                        data: data.wmsWaybillAverageLoadRateList
                    },
                ]
            };
            $echarts.init(document.getElementById("chart2")).setOption(option);
        },  
        async initEchart3(data){
            //柱形图
            let option = {
                color: ['#4cabce', '#fac858', '#91cc75'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        // type: 'shadow'
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
                legend: {
                    data: ['需求盘点数', '实际盘点数', '盘点完成率']
                },
                grid: {
                    top: 50,
                    left: 20,
                    right: 20,
                    bottom: 0,
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: data.storeHouseNameList,
                        axisLabel:{
                            interval:0, //展示全部条目
                            fontSize:12,
                            overflow:"breakAll",
                            width:60,
                            lineHeight:16,
                            rotate:45,
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '盘点数(个)',
                        min: 0,
                        axisLabel: {
                            formatter: '{value} '
                        },
                        splitLine: {
                            show: false // 取消 y 轴网格线
                        }
                    },
                    {
                        type: 'value',
                        name: '完成率',
                        min: 0,
                        max: 100,
                        interval: 10,
                        axisLabel: {
                            formatter: '{value}%'
                        }
                    }
                ],
                series: [
                    {
                        name: '需求盘点数',
                        type: 'bar',
                        barGap: 0,
                        barWidth:'40%',
                        tooltip: {
                            valueFormatter: function (value) {
                                return value + ' ml';
                            }
                        },
                        data: data.inventoryNumSumList
                    },
                    {
                        name: '实际盘点数',
                        type: 'bar',
                        barWidth:'40%',
                        tooltip: {
                            valueFormatter: function (value) {
                                return value + ' ml';
                            }
                        },
                        data: data.inventoryNumActualList
                    },
                    {
                        name: '盘点完成率',
                        type: 'line',
                        barWidth:'40%',
                        yAxisIndex: 1,
                        tooltip: {
                            valueFormatter: function (value) {
                                return value + ' °C';
                            }
                        },
                        data: data.inventoryNumFinishRateList
                    },

                ]
            };
            $echarts.init(document.getElementById("chart3")).setOption(option);
        },  
        async initEchart4(data){
            //柱形图
            let option = {
                color: ['#4cabce', '#fac858'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: ['当期异常','累计异常']
                },
                grid: {
                    top: 50,
                    left: 20,
                    right: 20,
                    bottom: 0,
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: data.storeHouseNameList,
                        axisLabel:{
                            interval:0, //展示全部条目
                            fontSize:12,
                            overflow:"breakAll",
                            width:60,
                            lineHeight:16,
                            rotate:45,
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '当期异常',
                        type: 'bar',
                        barGap: 0,
                        barWidth:'40%',
                        data: data.exceptionNumList
                    },
                    {
                        name: '累计异常',
                        type: 'bar',
                        barGap: 0,
                        barWidth:'40%',
                        data: data.exceptionNumSumList
                    }
                ]
            };
            $echarts.init(document.getElementById("chart4")).setOption(option);
        },

        changeWork()
        {
            let workId = this.query.workId;
            if (this.common.isBlank(workId) || workId.length == 0)
            {
                this.workData.forEach(item => {
                    item.disabled = false;
                })
                return;
            }
            let set = new Set();
            workId.forEach(item => set.add(item) );
            this.workData.forEach(item => {
                item.disabled = set.has(-1);//有选择全部
                if (!item.disabled)//没有选择全部
                {
                    item.disabled = set.has(item.workId);
                }
            })

            this.loadData();
        },
        changeDate()
        {
            if (this.common.isBlank(this.query.month) || this.query.month.length == 0)
            {
                this.$message.error("月份不能为空");
                return;
            }
            this.loadData();
        },
        toUninventoryDetail(data)
        {
            // let month = this.common.formatDate.getDate();
            // let item = {
            //     urlName: '未盘点明细',
            //     urlId: 'uninventoryStockStorageManage',
            //     urlPathName: "/uninventoryStockStorageManage",
            //     urlPath: "/pt/dataReport/kanban/uninventoryStockStorageManage.vue",
            //     query: {workStoreId: data.workId, backupMonth: month.substring(0, 7)},
            // }
            // this.$emit('openTab', item);
        }
    },
}


