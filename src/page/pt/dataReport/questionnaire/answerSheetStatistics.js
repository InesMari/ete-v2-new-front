import searchList from "@/components/searchList/searchList.vue";
import $echarts from 'echarts'

export default {
    name: 'answerSheetStatistics',
    data()
    {
        return {
            list: [],
            query: {order: 1},
            questionnaireList: [],
            questionnaireQuestionList: [],
            orderList: [
                {id: 1, name: '按问卷原序'},
                {id: 2, name: '按满意度'},
                {id: 3, name: '按平均分'},
            ],
            showChart:false,
        }
    },
    async mounted()
    {
        this.questionnaireList = await this.common.postUrl("questionnaireService", "queryQuestionnaireList", {loadHasAnswer: 1});
        if (this.questionnaireList.length > 0)
        {
            this.query.questionnaireId = this.questionnaireList[this.questionnaireList.length - 1].id;
            await this.queryQuestionnaireQuestionList();
            await this.initEchart();
        }
    },
    components: {
        searchList
    },
    methods: {
        async changeQuestionnaire()
        {
            this.query.questionId = null;
            this.questionnaireQuestionList = [];
            await this.queryQuestionnaireQuestionList();
            await this.initEchart();
        },
        async queryQuestionnaireQuestionList()
        {
            this.questionnaireQuestionList = await this.common.postUrl("questionnaireService", 'queryQuestionnaireQuestionList', this.query);
        },
        async initEchart(){
            // echart图表
            //已经强调过 客服类和非客服类展示一起的问题(不同纬度的数据一起展示，排序等)，产品坚持要这样做 拿原型说是老板要这样做的
            this.list = await this.common.postUrl("answerService", 'loadAnswerQuestionDataByQuestionnaireId', this.query);
            if (this.list.length > 0)
            {
                for (let i = 0; i < this.list.length; i++)
                {
                    this.list[i].showChart = true;
                    let data = this.list[i];
                    data.origin = i;
                    if (data.questionType == 2)
                    {
                        data.avgScoreFlag = -1;
                        data.satisfyRateFlag = -1;
                    }
                    else
                    {
                        data.avgScoreFlag = data.avgScore;
                        data.satisfyRateFlag = data.satisfyRate;
                    }
                }
            }
            this.$nextTick(() => {
                for (let i = 0; i < this.list.length; i++)
                {
                    this.initEchartData(this.list[i], i);
                }
            })
        },
        initEchartData(data, index)
        {
            if (data.questionType == 1)
            {
                const echart = $echarts.init(document.getElementById('chart' + index));
                echart.setOption({
                    series: [{
                        type: 'pie',
                        radius: ['45%', '80%'],
                        left: 0,
                        top: '20px',
                        right: 0,
                        bottom: 0,
                        itemStyle: {
                            borderColor: '#fff',
                            borderWidth: 1
                        },
                        label: {
                            minMargin: 5,
                            formatter: '{b}\n次数：{c}',
                            lineHeight: 15
                        },
                        data: data.list,
                        itemStyle:{
                            normal: {
                                color: function (colors) {
                                   var colorList = [
                                        '#ef6567',
                                        '#fc8251',
                                        '#f9c956',
                                        '#5470c6',
                                        '#91cd77',
                                   ];
                                   return colorList[colors.dataIndex];
                                }
                            },
                        }
                    }]
                });
            }
        },
        changeChartView(item){
            item.showChart = item.showChart?false:true;
            this.$forceUpdate();
        },
        toAnswer(item){
            let id = item.answerId;
            this.$emit('openTab', {
                urlName: '答卷详情',
                urlId: 'answerDetail'+id,
                urlPathName: "/answerDetail",
                urlPath: "/pt/dataReport/questionnaire/answerDetail.vue",
                query:{id}
            });
        },
        changeOrder(type)
        {
            if (type === 2)
            {
                this.list.sort((a ,b) => Number(b.satisfyRateFlag) - Number(a.satisfyRateFlag))
            }
            else if (type === 3)
            {
                this.list.sort((a ,b) => Number(b.avgScoreFlag) - Number(a.avgScoreFlag))
            }
            else
            {
                this.list.sort((a ,b) => a.origin - b.origin)
            }
            this.$nextTick(() => {
                for (let i = 0; i < this.list.length; i++)
                {
                    this.initEchartData(this.list[i], i);
                }
            })
            this.$forceUpdate();
        }
    },
    computed:{
        formData(){
            return [
                {"name":"问卷报表名称","model":"questionnaireId","type":"select","options":this.questionnaireList,"label":"questionnaireName","value":"id","method":"initEchart","isshow":true},
            ]
        }
    },
}
