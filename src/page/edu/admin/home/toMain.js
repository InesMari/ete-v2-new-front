import $echarts from 'echarts'
export default {
    name: 'toMain', 
    data() {
        return {
            info:{},
            type:1,
        }
    },
    mounted() {
        this.doQuery();
    },
    components: {
        
    },
    methods: {
        async doQuery(){
            this.info = await this.common.postUrl("eduUserService", "loadAdminHomeData");     
            this.initChart(1);       
        },
        // 新增课程
        addCourse(){
            this.$emit("openTab",{
                urlName: "添加课程",
                urlId: "addCourse"+new Date().getTime(),
                urlPath: "/edu/admin/course/addCourse.vue",
                urlPathName: "/addCourse",
            })
        },
        // 查看学员列表
        toStudentDetail(){
            this.$emit("openTab",{
                urlName: "学员列表",
                urlId: "studentList"+new Date().getTime(),
                urlPath: "/edu/admin/student/studentList.vue",
                urlPathName: "/studentList",
            })
        },
        // 查看主页设置
        toHomeSet(){
            this.$emit("openTab",{
                urlName: "主页设置",
                urlId: "homeManage"+new Date().getTime(),
                urlPath: "/edu/admin/base/homeManage.vue",
                urlPathName: "/homeManage",
            })
        },
        initChart(type){
            this.type = type;
            const echart = $echarts.init(document.getElementById('lineCharts'));
            if(type==1){
                var xAxisData = this.info.type1StudentsNums.xAxisData;
                var seriesData = this.info.type1StudentsNums.seriesData;
            }else if(type==2){
                var xAxisData = this.info.type2StudentsNums.xAxisData;
                var seriesData = this.info.type2StudentsNums.seriesData;
            }
            echart.setOption({
                color:['#5087ec'],
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    left: '20px',
                    right: '20px',
                    bottom: '0',
                    top:'30px',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: xAxisData
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '学习人数',
                        data: seriesData,
                        type: 'line'
                    },
                ]
            })
        },
    }
}
