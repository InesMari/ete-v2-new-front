import tableCommon from "@/components/table/tableCommon.vue";
import $echarts from 'echarts'
import enumData from "@/page/pt/enum";

export default {
    name: 'answerSheetStatisticsByCustomerService',
    data()
    {
        return {
            head: [
                {"name": "客服名称", "code": "putUserName", "width": "150", "type": "text"},
                {"name": "仓库名称", "code": "workName", "width": "250", "type": "text"},
                {"name": "满意率", "code": "avgRate", "width": "90", "type": "text"},
                {"name": "文明礼貌(5星)", "code": "civilizationRate", "width": "90", "type": "text"},
                {"name": "服务态度好(5星)", "code": "servicRate", "width": "90", "type": "text"},
                {"name": "解决问题及时(5星)", "code": "solveRate", "width": "150", "type": "text"},
                {"name": "专业敬业(5星)", "code": "professionalRate", "width": "150", "type": "text"},
                {"name": "语言流畅(5星)", "code": "languageRate", "width": "200", "type": "text"},
            ],
            query: {date: this.initDate()},//默认三个月
            text: '图表详情',
            showList: true, //默认展示列表
            pickerOptions: enumData.DATE_RANGE_SHORTCUT_OPTIONS,
        }
    },
    /**
     * 初始化
     */
    mounted()
    {
        this.doQuery();
    },
    /**
     * 组件
     */
    components: {
        tableCommon
    },
    /**
     * 绑定函数
     */
    methods: {
        initQuery()
        {
            return this.query = {
                date: []
            }
        },
        /**
         * 查询最近三个月的
         * @returns {*[]}
         */
        initDate()
        {
            const start = new Date();
            const end = new Date();
            start.setMonth(start.getMonth() - 3);
            start.setDate(1);
            end.setMonth(end.getMonth() + 1);
            end.setDate(0);
            return [this.getDate(start), this.getDate(end)];
        },
        getDate(date)
        {
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            return year + "-" + (month < 10 ? '0' + month : month) + "-" + (day < 10 ? '0' + day : day);
        },
        /**
         * 查询列表
         * query  空值时，默认为页面配置参this.query，传值时为传值参
         */
        doQuery()
        {
            if (this.common.isNotBlank(this.query.date) && this.query.date.length == 2)
            {
                this.query.startDate = this.query.date[0];
                this.query.endDate = this.query.date[1];
            }
            else
            {
                this.query.startDate = '';
                this.query.endDate = '';
            }
            this.$refs.table.load("answerService", "queryAnswerPageGroupByPutUser", this.query);
            if (!this.showList)
            {
                this.initEchart();
            }
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
                this.text = '图表详情';
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
            if (this.common.isNotBlank(this.query.date) && this.query.date.length == 2)
            {
                this.query.startDate = this.query.date[0];
                this.query.endDate = this.query.date[1];
            } else
            {
                this.query.startDate = '';
                this.query.endDate = '';
            }
            let data = await this.common.postUrl("answerService", "queryAnswerDataGroupByPutUser", this.query);
            //柱形图
            $echarts.init(document.getElementById("chart1")).setOption({
                title: {
                    text: '按满意率-前10',
                    left: '10%',
                },
                legend: {},
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}: {c} %'
                },
                xAxis: {
                    type: 'category',
                    data: data.dsscCustomerServiceNames
                },
                yAxis: {
                    axisLabel: {
                        formatter: '{value} %'
                    }
                },
                series: [
                    {
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '{c} %'
                        },
                        data: data.descCustomerServiceSatisfyRate
                    }
                ]
            });
            $echarts.init(document.getElementById("chart2")).setOption({
                title: {
                    text: '按满意率-后10',
                    left: '10%',
                },
                legend: {},
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}: {c} %'
                },
                xAxis: {
                    type: 'category',
                    data: data.ascCustomerServiceNames
                },
                yAxis: {
                    axisLabel: {
                        formatter: '{value} %'
                    }
                },
                series: [
                    {
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '{c} %'
                        },
                        data: data.ascCustomerServiceSatisfyRate
                    }
                ]
            });
            $echarts.init(document.getElementById("chart3")).setOption({
                title: {
                    text: '按明细',
                    left: '10%',
                },
                legend: {},
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}: {c} %'
                },
                xAxis: {
                    type: 'category',
                    data: data.customerServiceNames
                },
                yAxis: {
                    axisLabel: {
                        formatter: '{value} %'
                    }
                },
                series: [
                    {
                        name: '文明有礼貌',
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '{c} %'
                        },
                        data: data.civilizationRate
                    },
                    {
                        name: '服务态度好',
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '{c} %'
                        },
                        data: data.servicRate
                    },
                    {
                        name: '解决问题及时',
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '{c} %'
                        },
                        data: data.solveRate
                    },
                    {
                        name: '专业敬业',
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '{c} %'
                        },
                        data: data.professionalRate
                    },
                    {
                        name: '语言流畅',
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '{c} %'
                        },
                        data: data.languageRate
                    }
                ]
            });
        },
    },
}


