import Highcharts from 'highcharts/highstock';
import selectWork from "@/page/pt/wms/selectWork.vue";

export default {
    name: 'wmsConsignorTenantCenter',
    data() {
        return {
            showSelWork: false,
            showChangeWork: true,
            firstIn: true,
            userInfo: {},
            collectData: {inOrderCount: 0, outOrderCount: 0, noRecoverCount: 0},//首页汇总数据
            moutn: new Date().getMonth() + 1,//当前月份
            inStokeType: 1,
            outStokeType: 1,
            stockMaterialType: 1,
            outMaterialType: 1,

            //货主详情后面追加
            id: this.$route.query.id,//货主id
            consignor: {name: '', linkman: '', linkPhone: ''},
            consignorShow: false,
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initSelWork();
        this.init();
        this.initCollectData();
        this.initCharts();
    },
    /**
     * 组件
     */
    components: {
        selectWork,
        Highcharts
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
                // this.doQuery();
            }
        },
        init() {
            let that = this;
            this.common.postUrl("wmsTenantTF", "loadConsignorTenantById", {id: this.$route.query.id},function (data)
            {
                that.consignor = data;
                that.$forceUpdate();
            });
        },
        selWork() {
            this.showSelWork = false;
            this.$forceUpdate();
            if (!this.firstIn) {
                this.$emit('closeOthers', {});
            }
            this.userInfo = this.common.userInfo();
            this.firstIn = false;
            this.initCollectData();
            this.initCharts();
            // this.doQuery();
        },
        showConsignor(flag)
        {
            this.consignorShow = flag;
        },
        /**
         *
         * @param path
         * @param pId
         * @param urlName
         * @param urlId
         * @param urlPathName
         */
        go(path, pId, urlName, urlId) {
            if (this.common.isBlank(urlId))
                urlId = path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf(".vue"));
            let query = {pId: pId, srcTenantName: this.consignor.name};
            if (urlName === '入库单管理' || urlName === '出库单管理') {
                query.states = [1, 2];
            }
            if (urlName === '包材管理') {
                query.tenantName = this.consignor.name;
            }
            this.$emit("openTab", {
                urlId: urlId + pId,
                query: query,
                urlName: urlName,
                urlPathName: "/" + urlId,
                urlPath: path
            });
        },
        //初始化首页汇总数据
        async initCollectData() {
            this.collectData = await this.common.postUrl("wmsBaseTF", 'queryHomeCollectData', {srcTenantId: this.$route.query.id});
        },
        // 初始化图表
        initCharts() {
            // 初始化入库量趋势图
            this.initInStokeCharts(1);
            // 初始化出库量趋势图
            this.initOutStokeCharts(1);
            // // 初始化库存物料占比
            this.initStockMaterialCharts(1);
            // // 初始化出库物料占比
            this.initOutMaterialCharts(1);
        },
        //初始化入库量趋势图
        async initInStokeCharts(type) {
            this.inStokeType = type;
            let data = await this.common.postUrl("wmsBaseTF", 'queryHomeInStokeData', {type: type, srcTenantId: this.$route.query.id},
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
            let data = await this.common.postUrl("wmsBaseTF", 'queryHomeOutStokeData', {type: type, srcTenantId: this.$route.query.id},
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
            await this.common.postUrl("wmsBaseTF", 'queryStockMaterialData', {monthType: type, srcTenantId: this.$route.query.id}, function (data) {
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
            await this.common.postUrl("wmsBaseTF", 'queryOutMaterialData', {monthType: type, srcTenantId: this.$route.query.id}, function (data) {
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
    }
}
