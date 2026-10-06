import Highcharts from 'highcharts/highstock';
import selectWork from "@/page/pt/wms/selectWork.vue";
import fileViewer from '@/components/myFile/file-viewer.vue';
import visitionRegWXCode from '@/static/image/icons/visitionRegWXCode.png'
import $echarts from "echarts";

export default {
    name: 'warehousingCenter',
    data() {
        return {
            showSelWork: false,
            showChangeWork: true,
            firstIn: true,
            userInfo: {},
            warningSum: 0,
            collectData: { hasChildWork: false, workList: [] },//首页汇总数据
            moutn: new Date().getMonth() + 1,//当前月份
            inStokeType: 1,
            outStokeType: 1,
            stockMaterialType: 1,
            outMaterialType: 1,
            outMaterialType2: 1,
            qrCodeUrl: '',
            qrCodeVisitUrl: '',
            srcList: [],
            useSapStockNums: false,
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initSelWork();
        this.init();
        this.initCharts();
        this.initQrcode();
        this.initVisitQrcode();
    },
    /**
     * 组件
     */
    components: {
        selectWork,
        Highcharts,
        fileViewer
    },
    /**
     * 绑定函数
     */
    methods: {
        initSelWork() {
            this.userInfo = this.common.userInfo();
            if (!this.userInfo.workId) {
                this.showSelWork = true;
            } else {
                this.firstIn = false;
                this.useSapStockNums = this.userInfo.useSapStockNums == 1;
                this.initCollectData();
            }
        },
        init() {
            let that = this;
            this.common.postUrl('wmsBaseTF', 'getAllWorkStore', {}, function (data) {
                if (data.length == 0) {
                    that.showChangeWork = false;
                }
            });

            this.common.postUrl('wmsWarningTF', 'getWarningSum', {}, function (data) {
                if (data) {
                    that.warningSum = data.warningSum;
                }
            });
        },
        initQrcode() {
            let that = this;
            if (this.userInfo.workId) {
                //获取报到二维码
                this.common.postUrl('workGoodsTF', 'getWorkStoreQrcode', {}, function (data) {
                    if (data) {
                        that.qrCodeUrl = data;
                    }
                });
            }
        },
        initVisitQrcode() {
            let that = this;
            if (this.userInfo.workId) {
                //获取来访二维码
                this.common.postUrl('workGoodsTF', 'getWorkStoreVisitQrcode', {}, function (data) {
                    if (data) {
                        that.qrCodeVisitUrl = data;
                    }
                });
            }
        },
        selWork() {
            this.showSelWork = false;
            this.$forceUpdate();
            if (!this.firstIn) {
                this.$emit('closeOthers', {});
            }
            this.userInfo = this.common.userInfo();
            this.useSapStockNums = this.userInfo.useSapStockNums == 1;
            this.firstIn = false;
            this.initCollectData();
            this.initCharts();
            this.initQrcode();
        },
        changeInfoSwitch() {
            // this.useSapStockNums=this.useSapStockNums;
            let that = this;
            if (this.userInfo.workId) {
                //获取报到二维码
                this.common.postUrl('workGoodsTF', 'saveUseSapStockNums', { id: this.userInfo.workId, useSapStockNums: this.useSapStockNums ? 1 : 0 }, function (data) {
                    if (data) {
                        //不显示
                        let userInfo = that.common.userInfo();
                        userInfo.useSapStockNums = that.useSapStockNums ? 1 : 0;
                        localStorage.setItem("userInfo", JSON.stringify(userInfo));
                        that.$message.success('更新成功');
                    }
                });
            }
        },
        changeWork() {
            let that = this;
            this.$confirm("切换仓库需要关闭打开的所有页面，确定需要切换？", "切换仓库", { center: true }).then(() => {
                that.showSelWork = true;
            }).catch(() => { })
        },
        /**
         * 显示仓库预约码
         * @param data
         */
        showQrcode(data) {
            let url = "";
            if (data) {
                url = data.qrcodeUrl;
            }
            else {
                if (!this.qrCodeUrl) {
                    this.$message.error("没有图片~");
                    return;
                }
                url = this.qrCodeUrl;
            }

            this.srcList = [];
            this.srcList.push(url);
            this.$refs.viewer.show();
        },
        /**
         * 显示仓库来访码
         * @param data
         */
        showVisitQrcode(data) {
            let url = "";
            if (data) {
                url = data.qrcodeVisitUrl;
            }
            else {
                if (!this.qrCodeVisitUrl) {
                    this.$message.error("没有图片~");
                    return;
                }
                url = this.qrCodeVisitUrl;
            }
            this.srcList = [];
            this.srcList.push(url);
            this.$refs.viewer.show();
        },
        // 显示来访登记码
        showVisitionRgecode() {
            this.srcList = [];
            this.srcList.push(visitionRegWXCode);
            this.$refs.viewer.show();
        },
        go(path, pId, urlName, urlId) {
            if (this.common.isBlank(urlId))
                urlId = path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf(".vue"));
            let query = { pId: pId };
            if (pId == null && urlName == '入库单管理') {
                query.states = [1, 2, 3];
            }
            if (pId == null && urlName == '出库单管理') {
                query.states = [1, 2, 3, 4];
            }
            if (urlName == '仓储月成本') {
                query.t = 1;
            }
            if (urlName === '作业信息') {
                query = {
                    isWmsWork: 1,
                    pId: pId,
                    unShowCheck: 1,
                };
            }
            if (urlName === '卸货点管理') {
                query = {};
            }
            if (pId == 1005225) {
                query.workId = this.userInfo.workId;
            }
            this.$emit("openTab", {
                urlId: pId,
                query: query,
                urlName: urlName,
                urlPathName: "/" + urlId,
                urlPath: path
            });
        },
        //初始化首页汇总数据
        async initCollectData() {
            let collectData = await this.common.postUrl("wmsBaseTF", 'queryHomeCollectData', {});
            this.collectData = collectData;
        },
        //初始化入库量趋势图
        async initInStokeCharts(type) {
            this.inStokeType = type;
            let data = await this.common.postUrl("wmsBaseTF", 'queryHomeInStokeData', { type: type },
                null, null, '', true);
            Highcharts.chart('warehousingCharts', {
                title: {
                    text: null
                },
                yAxis: {
                    title: {
                        text: null
                    }
                },
                xAxis: {
                    categories: this.getdays()
                },
                credits: {
                    enabled: false
                },
                legend: {
                    align: 'center',
                    verticalAlign: 'top',
                },
                series: [{
                    name: '入库量趋势图',
                    data: [
                        data.count1,
                        data.count2,
                        data.count3,
                        data.count4,
                        data.count5,
                        data.count6,
                        data.count7,
                    ],
                    showInLegend: false
                }],
            });
        },
        //初始化出库量趋势图
        async initOutStokeCharts(type) {
            this.outStokeType = type;
            let data = await this.common.postUrl("wmsBaseTF", 'queryHomeOutStokeData', { type: type },
                null, null, '', true);
            Highcharts.chart('deliveryCharts', {
                title: {
                    text: null
                },
                yAxis: {
                    title: {
                        text: null
                    }
                },
                xAxis: {
                    categories: this.getdays()
                },
                credits: {
                    enabled: false
                },
                legend: {
                    align: 'center',
                    verticalAlign: 'top',
                },
                series: [{
                    name: '出库量趋势图',
                    data: [
                        data.count1,
                        data.count2,
                        data.count3,
                        data.count4,
                        data.count5,
                        data.count6,
                        data.count7,
                    ],
                    showInLegend: false
                }],
            });
        },
        //初始化库存物料占比
        async initStockMaterialCharts(type) {
            this.stockMaterialType = type;
            let stockMaterialData = [];
            await this.common.postUrl("wmsBaseTF", 'queryStockMaterialData', { monthType: type }, function (data) {
                for (let i = 0; i < data.length; i++) {
                    stockMaterialData.push({
                        name: data[i].materialName,
                        y: data[i].materialSum
                    });
                }
            }, null, '', true);
            Highcharts.chart('warehousingStuffCharts', {
                chart: {
                    type: 'pie',
                    spacing: [20, 0, 20, 0]
                },
                title: {
                    text: null
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    pie: {
                        size: 110,
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || '#666666'
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
        },
        //初始化出库物料占比
        async initOutMaterialCharts(type) {
            this.outMaterialType = type;
            let outMaterialData = [];
            await this.common.postUrl("wmsBaseTF", 'queryOutMaterialData', { monthType: type }, function (data) {
                for (let i = 0; i < data.length; i++) {
                    outMaterialData.push({
                        name: data[i].materialName,
                        y: data[i].materialSum
                    });
                }
            }, null, '', true);
            Highcharts.chart('deliveryStuffCharts', {
                chart: {
                    type: 'pie',
                    spacing: [20, 0, 20, 0]
                },
                title: {
                    text: null
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    pie: {
                        size: 110,
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || '#666666'
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
        },

        // 初始化图表
        initCharts() {
            // 初始化入库量趋势图
            this.initInStokeCharts(1);
            // 初始化出库量趋势图
            this.initOutStokeCharts(1);
            // 初始化库存物料占比
            this.initStockMaterialCharts(1);
            // 初始化出库物料占比
            this.initOutMaterialCharts(1);

            this.initEchart1(1);
        },
        async initEchart1(type) {
            this.outMaterialType2 = type;
            let data = await this.common.postUrl("wmsBaseTF", 'queryOutMaterialDataByCondition', { dateType: type });
            //柱形图
            let option = {
                // color: ['#4cabce', '#91cc75'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: data.legend
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
                        data: data.xList,
                        axisLabel: {
                            interval: 0, //展示全部条目
                            fontSize: 12,
                            overflow: "breakAll",
                            width: 60,
                            lineHeight: 16,
                            rotate: 45,
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: data.series
            };
            $echarts.init(document.getElementById("chart1")).setOption(option);
        },
        // 获取最近一周日期
        getdays() {
            let days = [];
            var date = new Date();
            for (let i = 0; i <= 144; i += 24) {		//144是前六天的小时数
                let dateItem = new Date(date.getTime() - i * 60 * 60 * 1000);	//使用当天时间戳减去以前的时间毫秒（小时*分*秒*毫秒）
                let m = dateItem.getMonth() + 1;	//获取月份js月份从0开始，需要+1
                let d = dateItem.getDate();	//获取日期
                let valueItem = m + '-' + d;	//组合
                days.unshift(valueItem);	//添加至数组
            }
            return days;
        },
        // 今日计划看板
        toTodayPlanBoard(){
            window.open(window.location.origin + '/todayPlanBoard', "_blank");
        },
        // 预约看板
        toAppointmentBoard() {
            window.open(window.location.origin + '/appointmentBoard', "_blank");
        },
        // 仓储看板
        toWarehousingCenterBoard() {
            window.open(window.location.origin + '/warehousingCenterBoard', "_blank");
        },
        // 配送看板
        toDeliveryBoard() {
            window.open(window.location.origin + '/deliveryBoard', "_blank");
        },
    }
}
