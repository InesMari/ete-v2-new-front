import Highcharts from 'highcharts/highstock';
import $echarts from "echarts";

export default {
    name: 'warehousingCenterBoard',
    data() {
        return {
            userInfo: {},
            workName: JSON.parse(localStorage.userInfo).workName,
            collectData: { hasChildWork: false, workList: [] },//首页汇总数据
            moutn: new Date().getMonth() + 1,//当前月份
            dateTime: '',
            week: "",
            isFullScreen: false,
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initCollectData();
        this.initCharts();
        this.updateDateTime();
        this.timer = setInterval(this.updateDateTime, 1000);
        let _this = this;
        window.onresize = function(event) {
            _this.initCharts();
        };
    },

    /**
     * 销毁组件时清除定时器
     */
    beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    },

    /**
     * 组件
     */
    components: {
        Highcharts,
    },
    /**
     * 绑定函数
     */
    methods: {
        // 更新日期时间
        updateDateTime() {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');

            this.dateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

            const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
            this.week = weekDays[now.getDay()];
        },

        //初始化首页汇总数据
        async initCollectData() {
            try {
                let collectData = await this.common.postUrl("wmsBaseTF", 'queryHomeCollectData', {});
                this.collectData = collectData;
            } catch (error) {
                console.error('获取首页汇总数据失败:', error);
            }
        },

        //初始化入库量趋势图
        async initInStokeCharts() {
            try {
                let data = await this.common.postUrl("wmsBaseTF", 'queryHomeInStokeData', { type: 1 });
                Highcharts.chart('warehousingCharts', {
                    chart: {
                        backgroundColor: 'transparent',
                        spacing: [20, 10, 10, 10]
                    },
                    title: { text: null },
                    yAxis: { 
                        title: { text: null },
                        gridLineColor: 'rgba(255, 255, 255, 0.1)',
                        labels: { style: { color: '#fff' } }
                    },
                    xAxis: { 
                        categories: this.getdays(),
                        lineColor: 'rgba(255, 255, 255, 0.2)',
                        tickColor: 'rgba(255, 255, 255, 0.2)',
                        labels: { style: { color: '#fff' } }
                    },
                    credits: { enabled: false },
                    legend: { 
                        align: 'center',
                        verticalAlign: 'top',
                        itemStyle: { color: '#fff' }
                    },
                    series: [{
                        name: '入库量趋势图',
                        data: [
                            data.count1, data.count2, data.count3, data.count4,
                            data.count5, data.count6, data.count7
                        ],
                        showInLegend: false,
                        color: '#00ffff'
                    }],
                });
            } catch (error) {
                console.error('初始化入库量趋势图失败:', error);
            }
        },

        //初始化出库量趋势图
        async initOutStokeCharts() {
            try {
                let data = await this.common.postUrl("wmsBaseTF", 'queryHomeOutStokeData', { type: 1 });
                Highcharts.chart('deliveryCharts', {
                    chart: {
                        backgroundColor: 'transparent',
                        spacing: [20, 10, 10, 10]
                    },
                    title: { text: null },
                    yAxis: { 
                        title: { text: null },
                        gridLineColor: 'rgba(255, 255, 255, 0.1)',
                        labels: { style: { color: '#fff' } }
                    },
                    xAxis: { 
                        categories: this.getdays(),
                        lineColor: 'rgba(255, 255, 255, 0.2)',
                        tickColor: 'rgba(255, 255, 255, 0.2)',
                        labels: { style: { color: '#fff' } }
                    },
                    credits: { enabled: false },
                    legend: { 
                        align: 'center',
                        verticalAlign: 'top',
                        itemStyle: { color: '#fff' }
                    },
                    series: [{
                        name: '出库量趋势图',
                        data: [
                            data.count1, data.count2, data.count3, data.count4,
                            data.count5, data.count6, data.count7
                        ],
                        showInLegend: false,
                        color: '#0099ff'
                    }],
                });
            } catch (error) {
                console.error('初始化出库量趋势图失败:', error);
            }
        },

        //初始化库存物料占比
        async initStockMaterialCharts() {
            try {
                const stockMaterialData = await this.getMaterialData('queryStockMaterialData', { monthType: 1 });
                Highcharts.chart('warehousingStuffCharts', {
                    chart: { 
                        type: 'pie', 
                        spacing: [20, 0, 20, 0],
                        backgroundColor: 'transparent'
                    },
                    title: { text: null },
                    credits: { enabled: false },
                    plotOptions: {
                        pie: {
                            size: 110,
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                style: {
                                    color: '#fff',
                                    textOutline: 'none'
                                }
                            }
                        }
                    },
                    series: [{
                        size: "100%",
                        name: '占比',
                        colorByPoint: true,
                        data: stockMaterialData
                    }]
                });
            } catch (error) {
                console.error('初始化库存物料占比失败:', error);
            }
        },

        //初始化出库物料占比
        async initOutMaterialCharts() {
            try {
                const outMaterialData = await this.getMaterialData('queryOutMaterialData', { monthType: 1 });
                Highcharts.chart('deliveryStuffCharts', {
                    chart: { 
                        type: 'pie', 
                        spacing: [20, 0, 20, 0],
                        backgroundColor: 'transparent'
                    },
                    title: { text: null },
                    credits: { enabled: false },
                    plotOptions: {
                        pie: {
                            size: 110,
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                style: {
                                    color: '#fff',
                                    textOutline: 'none'
                                }
                            }
                        }
                    },
                    series: [{
                        size: "100%",
                        name: '占比',
                        colorByPoint: true,
                        data: outMaterialData
                    }]
                });
            } catch (error) {
                console.error('初始化出库物料占比失败:', error);
            }
        },

        // 获取物料数据的通用方法
        async getMaterialData(api, params) {
            const data = await this.common.postUrl("wmsBaseTF", api, params);
            return data.map(item => ({
                name: item.materialName,
                y: item.materialSum
            }));
        },

        // 初始化物料出库流向图表
        async initEchart1() {
            try {
                let data = await this.common.postUrl("wmsBaseTF", 'queryOutMaterialDataByCondition', { dateType: 1 });
                let option = {
                    backgroundColor: 'transparent',
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { type: 'shadow' }
                    },
                    legend: { 
                        data: data.legend,
                        top:10,
                        textStyle: { color: '#fff' }
                    },
                    grid: {
                        top: 50, left: 20, right: 20, bottom: 10,
                        containLabel: true
                    },
                    xAxis: [{
                        type: 'category',
                        data: data.xList,
                        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.2)' } },
                        axisTick: { lineStyle: { color: 'rgba(255, 255, 255, 0.2)' } },
                        axisLabel: {
                            interval: 0,
                            fontSize: 12,
                            color: '#fff',
                            overflow: "breakAll",
                            width: 60,
                        }
                    }],
                    yAxis: [{ 
                        type: 'value',
                        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.2)' } },
                        axisTick: { lineStyle: { color: 'rgba(255, 255, 255, 0.2)' } },
                        splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
                        axisLabel: { color: '#fff' }
                    }],
                    series: data.series
                };
                let myChart = $echarts.init(document.getElementById("chart1"));
                myChart.setOption(option);
                myChart.resize();
            } catch (error) {
                console.error('初始化物料出库流向图表失败:', error);
            }
        },

        // 初始化所有图表
        initCharts() {
            this.initInStokeCharts();
            this.initOutStokeCharts();
            this.initStockMaterialCharts();
            this.initOutMaterialCharts();
            this.initEchart1();
        },
        // 获取最近一周日期
        getdays() {
            const days = [];
            const date = new Date();
            for (let i = 0; i <= 144; i += 24) {
                const dateItem = new Date(date.getTime() - i * 60 * 60 * 1000);
                const month = dateItem.getMonth() + 1;
                const day = dateItem.getDate();
                const valueItem = `${month}-${day}`;
                days.unshift(valueItem);
            }
            return days;
        },

        // 刷新页面
        refreshPage() {
            window.location.reload();
        },
        /**
         * 全屏
         */
        fullScreen() {
            if(this.isFullScreen){
                this.exitFullScreen();
                return
            }
            this.isFullScreen = true;
            let el = document.documentElement;
            let rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;
            if (rfs) {
                rfs.call(el);
            }
            this.$forceUpdate();
        },
        // 退出全屏
        exitFullScreen() {
            this.isFullScreen = false;
            // let el = document.documentElement;
            // let cfs = el.exitFullscreen || el.mozCancelFullScreen || el.webkitExitFullscreen || el.msExitFullscreen;
            // if (cfs && document.fullscreenElement) {
            //   cfs.call(document);
            // }
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { /* Firefox */
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { /* Chrome, Safari 和 Opera */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE/Edge */
                document.msExitFullscreen();
            }
            this.$forceUpdate();
        },
    }
}
