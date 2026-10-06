// import $echarts from 'echarts'
import Highcharts from 'highcharts/highstock';
export default {
    name: 'toMain',
    data() {
        return {
            billId:"",  //登录账号
            isFullScreen:false,     //是否全屏
            collectData: {},//首页汇总数据
            zcData: {},//折线图的整车集合，今日汇总、昨日同比放在这里返回
            rankList: [],
            lineType:1,
            pieType:1,
            trankType:1,
            // rankList:[
            //     {city:"曹县",scale:"60%",progress:60},
            //     {city:"北京",scale:"15%",progress:15},
            //     {city:"上海",scale:"10%",progress:10},
            //     {city:"广州",scale:"8%",progress:8},
            //     {city:"深圳",scale:"10%",progress:10},
            //     {city:"重庆",scale:"5%",progress:5},
            //     {city:"天津",scale:"3%",progress:3},
            //     {city:"杭州",scale:"4%",progress:4},
            //     {city:"佛山",scale:"6%",progress:6},
            //     {city:"武汉",scale:"5%",progress:5},
            // ]
            isPT:true,
        }
    },
    created(){
        this.listenEsc();
    },
    mounted() {
        this.initHomeChart();
        this.initLineChart(1);
        this.initPieChart(1);
        this.initrankChart(1);
        let userInfo = JSON.parse(window.localStorage.userInfo);
        this.billId = userInfo.billId;
        if(userInfo.tenantId!=1){
            this.isPT=false;
        }
    },
    components: {

    },
    methods: {
        async initHomeChart(){
            let that = this;
            //首页汇总数据
            await this.common.postUrl("homeCollectTF", 'queryHomeCollectData', {}, function (data) {
                that.collectData = data;
            });
        },
        async initLineChart(type){
            let that = this;
            this.lineType = type;
            //折线图数据
            this.zcData = {};
            let ldData = {};
            await this.common.postUrl("homeCollectTF", 'queryHomeBrokenData', {type:type}, function (data) {
                if(data.length>1){
                    that.zcData = data[0];
                    ldData = data[1];
                    if(that.common.isNotBlank(that.zcData.count12) && Number(that.zcData.count12)>=0){
                        that.zcData.count12 = "+" + that.zcData.count12;
                    }
                }
            },null,'',true);
            let month = new Date().getMonth();
            // Highcharts图表
            Highcharts.chart('lineCharts', {
                title:{
                    text:null
                },
                colors:['#5087ec','#68bbc4'],
                yAxis: {
                    title: {
                            text: null
                    }
                },
                xAxis: {
                    categories: [
                        this.getDateFull(9),
                        this.getDateFull(8),
                        this.getDateFull(7),
                        this.getDateFull(6),
                        this.getDateFull(5),
                        this.getDateFull(4),
                        this.getDateFull(3),
                        this.getDateFull(2),
                        this.getDateFull(1),
                        this.getDateFull(0)
                    ]
                },
                credits: {
                    enabled: false
                },
                legend: {
                        align: 'center',
                        verticalAlign: 'top',
                },
                series: type!=4 ? [{
                        name: '整车订单',
                        data: [
                            this.zcData.count1,
                            this.zcData.count2,
                            this.zcData.count3,
                            this.zcData.count4,
                            this.zcData.count5,
                            this.zcData.count6,
                            this.zcData.count7,
                            this.zcData.count8,
                            this.zcData.count9,
                            this.zcData.count10
                        ],
                }, {
                        name: '零担订单',
                        data: [
                            ldData.count1,
                            ldData.count2,
                            ldData.count3,
                            ldData.count4,
                            ldData.count5,
                            ldData.count6,
                            ldData.count7,
                            ldData.count8,
                            ldData.count9,
                            ldData.count10
                        ]
                }, ] :
                    [{
                        name: '包装',
                        data: [
                            this.zcData.count1,
                            this.zcData.count2,
                            this.zcData.count3,
                            this.zcData.count4,
                            this.zcData.count5,
                            this.zcData.count6,
                            this.zcData.count7,
                            this.zcData.count8,
                            this.zcData.count9,
                            this.zcData.count10
                        ],
                    }, ],
                // series: [{
                //     name: '整车订单',
                //     data: [150, 230, 224, 218, 135, 147, 260],
                // }, {
                //     name: '零担订单',
                //     data: [220, 182, 191, 234, 290, 330, 310]
                // }, ],
            });
            // echart图表
            // const echart = $echarts.init(document.getElementById('echarts'))
            // echart.setOption({
            //     color:['#5087ec','#68bbc4'],
            //     tooltip: {
            //         trigger: 'axis'
            //     },
            //     legend: {
            //         data: ['整车订单', '零担订单']
            //     },
            //     grid: {
            //         left: '24px',
            //         right: '180px',
            //         bottom: '0',
            //         top:'30px',
            //         containLabel: true
            //     },
            //     xAxis: {
            //         type: 'category',
            //         data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            //     },
            //     yAxis: {
            //         type: 'value'
            //     },
            //     series: [
            //         {
            //             name: '整车订单',
            //             data: [150, 230, 224, 218, 135, 147, 260],
            //             type: 'line'
            //         },
            //         {
            //             name: '零担订单',
            //             type: 'line',
            //             data: [220, 182, 191, 234, 290, 330, 310]
            //         },
            //     ]
            // })
        },
        async initPieChart(type){
            this.pieType = type;
            let PieData = [];
            await this.common.postUrl("homeCollectTF", 'queryHomeCustomerData', {monthType:type}, function (data) {
                for (let i = 0; i < data.length; i++) {
                    PieData.push({
                        name:data[i].tenantName,
                        y: data[i].share
                    });
                }
            },null,'',true);
            Highcharts.chart('pieChart', {
                chart: {
                    spacing : [20, 0 , 20, 0]
                },
                title: {
                    floating:true,
                    text: null
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    pie: {
                        cursor: 'pointer',
                    }
                },
                series: [{
                    type: 'pie',
                    innerSize: '60%',
                    name: '运输业务',
                    data: PieData
                    // data: [
                    //     {name:'Firefox',y: 45.0},
                    //     ['IE',26.8],
                    //     {name: 'Chrome',y: 12.8,},
                    //     ['Safari',8.5],
                    //     ['Opera',6.2],
                    //     ['其他',0.7]
                    // ]
                }]
            }, function(c) { // 图表初始化完毕后的会调函数
                // 环形图圆心
                var centerY = c.series[0].center[1],
                    titleHeight = parseInt(c.title.styles.fontSize);
                // 动态设置标题位置
                c.setTitle({
                    y:centerY + titleHeight/2
                });
            });
        },
        async initrankChart(type){
            let that = this;
            this.trankType = type;
            this.rankList = [];
            await this.common.postUrl("homeCollectTF", 'queryHomeCustomerCityData', {cityType:type}, function (data) {
                for (let i = 0; i < data.length; i++) {
                    that.rankList.push({
                        city:data[i].cityName,
                        scale: data[i].share_,
                        progress: data[i].share
                    });
                }
            },null,'',true);
        },
        listenEsc(){
            let _this = this;
            document.addEventListener('keydown', function(e) {
                if (e.which == 27 && _this.isFullScreen) {
                    _this.isFullScreen = false;
                    _this.$forceUpdate();
                }
            }, false);
        },
        /**
         * 全屏
         */
         fullScreen()
         {
             if (!this.isFullScreen)
             {
                 this.isFullScreen = true;
                 let el = document.documentElement;
                 let rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;
                 if (rfs) {
                     rfs.call(el);
                 }
                 else if (typeof window.ActiveXObject !== "undefined") {
                     //for IE，这里其实就是模拟了按下键盘的F11，使浏览器全屏
                     let wscript = new ActiveXObject("WScript.Shell");
                     if (wscript != null) {
                         wscript.SendKeys("{F11}");
                     }
                 }
             }
             else
             {
                 this.isFullScreen = false;
                 let el = document;
                 let cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen;
                 if (cfs) {
                     cfs.call(el);
                 }
                 else if (typeof window.ActiveXObject !== "undefined") {
                     //for IE，这里和fullScreen相同，模拟按下F11键退出全屏
                     let wscript = new ActiveXObject("WScript.Shell");
                     if (wscript != null) {
                         wscript.SendKeys("{F11}");
                     }
                 }
             }
         },
        /**
         * 获取日期
         */
        getDateFull(num){
            let date = new Date();
            date.setDate(date.getDate() - num);
            let month = date.getMonth();
            let day = date.getDate();
            let str = (month == 0) ? (12) : (month+1) + "月" + day + "日";
            return str;
        },
        /**
         * 数字转中文
         */
        toChinesNum(num){
                let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
                let unit = ["", "十", "百", "千", "万"];
                num = parseInt(num);
                let getWan = (temp) => {
                   　　let strArr = temp.toString().split("").reverse();
                   　　let newNum = "";
                   　　for (var i = 0; i < strArr.length; i++) {
                        　　newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
                       　　}
                    　 return newNum;
                  }
                let overWan = Math.floor(num / 10000);
                let noWan = num % 10000;
                if (noWan.toString().length < 4) {
                noWan = "0" + noWan;
                }
                return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
        },
    }
}
