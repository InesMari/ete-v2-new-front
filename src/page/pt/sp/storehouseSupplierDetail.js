import enumData from "@/page/pt/enum";
import $echarts from 'echarts'

export default {
    name: 'storehouseSupplierDetail',
    data()
    {
        return {
            weeks: null,
            currentDate: new Date().getDate(),//当前日期
            month: this.common.formatDate.getMonth(),//默认当前月份
            selectIndex: 0,//选择天数在本周的数组索引
            sumData:{
                todayWorkCount: 0,//今日作业
                totalWorkCount: 0,//累计作业
                monthWorkCount: 0,//本月累计
                monthWorkSettleFeeSum: 0,//本月累计费用
            },
            sumDayData:{
                notRegisterCount: 0,//未登记
                registerCount: 0,//已登记
                confirmCount: 0,//已确认
            },
            enumData: enumData,
            weekDataMap: enumData.weekDataMap,//周几的数据
            supplierInfo: {
                tenantId: this.$route.query.tenantId,
                supplierType: this.$route.query.supplierType,
                supplierName: this.$route.query.supplierName,
                invoiceFlg: this.$route.query.invoiceFlg,
            },//供应商信息
        }
    },
    mounted()
    {
        this.initWeek().then(() => {});
    },
    components: {},
    methods: {
        /**
         * 初始化日历
         * e Date格式，月份 不传是默认的
         */
        async initWeek(e)
        {
            this.weeks = [];
            let date = this.common.isBlank(e) ? new Date() : this.getMyDate(e);
            let week = date.getDay();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            this.selectIndex = week;
            this.currentDate = day;//当前天
            for (let i = 0; i < 7; i++)
            {
                let el = {};
                let monthMaxDay = new Date(date.getFullYear(), month, 0).getDate();//month月份最后一天天数
                let actualMonth = month;//日期实际月份
                el.date = day - week + i;//默认本月份的天数
                if (el.date < 1)//上个月日期处理
                {
                    el.date = new Date(date.getFullYear(), month - 1, 0).getDate() + el.date;//month - 1月最后一天天数减去obj.date
                    actualMonth = month - 1;
                }
                else if (el.date > monthMaxDay)//下个月日期处理
                {
                    el.date = el.date - monthMaxDay;//下个月的天数
                    actualMonth = month + 1;
                }
                el.time = new Date(date.getFullYear(), actualMonth - 1, el.date);//天时间对象
                el.week = this.weekDataMap.get(i);//显示周几数据
                
                let month_ = el.time.getFullYear() + "-" + (actualMonth < 10 ? '0' + actualMonth : actualMonth);//加载数据的年月条件
                let sumDayData = await this.loadStorehouseSupplierSpecifyDayDataByTenantId(month_ + "-" + el.date);
                this.initSumDayData(el, sumDayData);
                //赋值当天展示派车单数据
                if (this.selectIndex === i)
                {
                    this.initSumDayData(this.sumDayData, sumDayData);
                }
                this.weeks.push(el);
            }
            await this.loadStorehouseSupplierDataByTenantId();
            this.initEchart1();
            this.initEchart2();
            this.initEchart3();
            this.initEchart4();
        },
        /**
         * 获取时间
         * @param date
         */
        getMyDate(date)
        {
            let maxDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();//date月份最后一天天数
            if (this.currentDate <= maxDay)
                return new Date(date.getFullYear(), date.getMonth(), this.currentDate);
            else
                return date;
        },
        /**
         * 上周
         */
        async preWeek()
        {
            for (let i = 0; i < this.weeks.length; i++)
            {
                let el = this.weeks[i];
                let day = el.date - 7;
                if (day > 0)//当前月份
                {
                    el.date = day;
                    el.time = new Date(el.time.getFullYear(), el.time.getMonth(), el.date);
                }
                else
                {
                    let lastMonthMaxDate = new Date(el.time.getFullYear(), el.time.getMonth(), 0);//上个月最后一天
                    el.date = lastMonthMaxDate.getDate() + day;
                    el.time = new Date(lastMonthMaxDate.getFullYear(), lastMonthMaxDate.getMonth(), el.date);
                }
                let month_ = el.time.getFullYear() + "-" + ((el.time.getMonth() + 1) < 10 ? '0' + (el.time.getMonth() + 1) : el.time.getMonth() + 1);//加载数据的年月条件
                let sumDayData = await this.loadStorehouseSupplierSpecifyDayDataByTenantId(month_ + "-" + el.date);
                this.initSumDayData(el, sumDayData);
                if (this.selectIndex === i)
                {
                    this.currentDate = el.date;//设置选择的本周天数
                    //设置月份数据
                    let month = el.time.getMonth() + 1;
                    this.month = el.time.getFullYear() + "-" + (month < 10 ? '0' + month : month);
                    this.initSumDayData(this.sumDayData, el);
                }
            }
        },
        /**
         * 下周
         */
        async nextWeek()
        {
            for (let i = 0; i < this.weeks.length; i++)
            {
                let el = this.weeks[i];
                let day = el.date + 7;
                let monthMaxDate = new Date(el.time.getFullYear(), el.time.getMonth() + 1, 0);
                if (day > monthMaxDate.getDate())//下个月
                {
                    el.date = day - monthMaxDate.getDate();
                    el.time = new Date(el.time.getFullYear(), el.time.getMonth() + 1, el.date);
                }
                else
                {
                    el.date = day;
                    el.time = new Date(el.time.getFullYear(), el.time.getMonth(), el.date);
                }
                let month_ = el.time.getFullYear() + "-" + ((el.time.getMonth() + 1) < 10 ? '0' + (el.time.getMonth() + 1) : el.time.getMonth() + 1);//加载数据的年月条件
                let sumDayData = await this.loadStorehouseSupplierSpecifyDayDataByTenantId(month_ + "-" + el.date);
                this.initSumDayData(el, sumDayData);
                if (this.selectIndex === i)
                {
                    this.currentDate = el.date;//设置选择的本周天数
                    //设置月份数据
                    let month = el.time.getMonth() + 1;
                    this.month = el.time.getFullYear() + "-" + (month < 10 ? '0' + month : month);
                    this.initSumDayData(this.sumDayData, el);
                }
            }
        },
        /**
         * 改变天数
         * @param data
         * @param index
         */
        async changeDay(data, index)
        {
            this.selectIndex = index;
            this.currentDate = data.date;
            let month = data.time.getMonth() + 1;
            this.month = data.time.getFullYear() + "-" + (month < 10 ? '0' + month : month);
            this.initSumDayData(this.sumDayData, data);
        },
        /**
         * 初始化当日的 待出车、运作中、已完成数据
         * @param target
         * @param source
         */
        initSumDayData(target, source)
        {
            target.notRegisterCount = source.notRegisterCount;
            target.registerCount = source.registerCount;
            target.confirmCount = source.confirmCount;
            this.$forceUpdate();
        },
        /**
         * 加载仓储供应商统计数据
         * @returns {Promise<void>}
         */
        async loadStorehouseSupplierDataByTenantId()
        {
            this.sumData = await this.common.postUrl("supplierTF", "loadStorehouseSupplierDataByTenantId", this.supplierInfo,null, null, null, true);
            this.$forceUpdate();
        },
        /**
         * 加载每天的统计数据
         * @returns {Promise<void>}
         */
        async loadStorehouseSupplierSpecifyDayDataByTenantId(day)
        {
            this.supplierInfo.day = day;
            return await this.common.postUrl("supplierTF", "loadStorehouseSupplierSpecifyDayDataByTenantId", this.supplierInfo,null, null, null, true);
        },
        /**
         * @param path
         * @param pId
         * @param urlName
         * @param urlId
         * @param urlPathName
         */
        go(path, pId, urlName, urlId, urlPathName,unShowCheck)
        {
            if (this.common.isBlank(urlId))
            {
                return false;//暂时不跳转了  一个供应商对应多个仓库的跳过去数据不对
            }
            let query = {supplierId: this.supplierInfo.tenantId, supplierName: this.supplierInfo.supplierName, pId: pId,unShowCheck: unShowCheck,};
            this.$emit("openTab",{
                urlId: urlId + this.supplierInfo.tenantId,
                query: query,
                urlName: urlName,
                urlPathName: urlPathName,
                urlPath: path});
        },
        /**
         *
         * @returns {Promise<void>}
         */
        async initEchart1(){
            let data = await this.common.postUrl("workOrderService", "loadRecentHalfAYearWorkOrderBarData", {
                tenantId: this.$route.query.tenantId});
            //柱形图
            let option = {
                title: {
                    text: '近6月作业累计',
                    x: 'center',
                    y: 'top',
                    textStyle: {
                        fontSize: 16,
                        fontWeight: 'bold'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                // legend: {
                //     data: ['作业量']
                // },
                xAxis: [
                    {
                        type: 'category',
                        data: data.x,
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
                        name: '作业量',
                        type: 'bar',
                        barGap: 0,
                        data: data.y
                    }
                ]
            };
            $echarts.init(document.getElementById("chart1")).setOption(option);
        },
        async initEchart2(){
            //折线图
            let data = await this.common.postUrl("workOrderService", "loadRecentHalfAYearWorkOrderFeeLineData", {
                tenantId: this.$route.query.tenantId
            });
            let option = {
                title: {
                    text: '近6月作业金额累计',
                    x: 'center',
                    y: 'top',
                    textStyle: {
                        fontSize: 16,
                        fontWeight: 'bold'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                // legend: {
                //     data: ['作业金额']
                // },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: data.x,
                    axisLabel:{
                        interval:0, //展示全部条目
                        fontSize:12,
                        overflow:"breakAll",
                        width:60,
                        lineHeight:16,
                        rotate:45,
                    }
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '作业金额',
                        type: 'line',
                        areaStyle: {},
                        data: data.y
                    }
                ]
            };
            $echarts.init(document.getElementById("chart2")).setOption(option);
        },
        async initEchart3(date){
            //饼图
            let data = await this.common.postUrl("workOrderService", "loadRecentHalfAYearWorkOrderPieData", {
                tenantId: this.$route.query.tenantId
            });
            let option = {
                title: {
                    text: '近6月作业情况',
                    x: 'center',
                    y: 'top',
                    textStyle: {
                        fontSize: 16,
                        fontWeight: 'bold'
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    bottom: 10,
                    left: 'center',
                    data: data.typeNameList
                },
                series: [
                    {
                        name: '仓库成本',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        selectedMode: 'single',
                        data: data.dataList,
                    }
                ]
            };
            $echarts.init(document.getElementById("chart3")).setOption(option);
        },
        async initEchart4(date){
            //饼图
            let data = await this.common.postUrl("workOrderService", "loadRecentHalfAYearWorkOrderFeeItemTypeLineData", {
                tenantId: this.$route.query.tenantId
            });
            if (data.dataList && data.dataList.length > 0)
            {
                for (let i = 0; i < data.dataList.length; i++)
                {
                    data.dataList[i].type = 'line';
                    data.dataList[i].stack = 'Total';
                }
            }
            let option = {
                title: {
                    text: '近6月作业金额情况',
                    x: 'center',
                    y: 'top',
                    textStyle: {
                        fontSize: 16,
                        fontWeight: 'bold'
                    }
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: data.typeNameList, //['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
                    bottom: 0,
                },
                // grid: {
                //     left: '3%',
                //     right: '4%',
                //     bottom: '3%',
                //     containLabel: true
                // },
                // toolbox: {
                //     feature: {
                //         saveAsImage: {}
                //     }
                // },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: data.x, //['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value'
                },
                series:data.dataList,
                // [
                //     {
                //         name: 'Email',
                //         type: 'line',
                //         stack: 'Total',
                //         data: [120, 132, 101, 134, 90, 230, 210]
                //     },
                //     {
                //         name: 'Union Ads',
                //         type: 'line',
                //         stack: 'Total',
                //         data: [220, 182, 191, 234, 290, 330, 310]
                //     },
                //     {
                //         name: 'Video Ads',
                //         type: 'line',
                //         stack: 'Total',
                //         data: [150, 232, 201, 154, 190, 330, 410]
                //     },
                //     {
                //         name: 'Direct',
                //         type: 'line',
                //         stack: 'Total',
                //         data: [320, 332, 301, 334, 390, 330, 320]
                //     },
                //     {
                //         name: 'Search Engine',
                //         type: 'line',
                //         stack: 'Total',
                //         data: [820, 932, 901, 934, 1290, 1330, 1320]
                //     }
                // ]
            };
            $echarts.init(document.getElementById("chart4")).setOption(option);
        },

    }
}
